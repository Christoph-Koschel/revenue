import * as fs from "fs";
import * as crypto from "crypto";

type BasicCallback<T> = { (item: T, index: number): boolean };
type WhereCallback<T> = BasicCallback<T>;


export class DataSource {
    public readonly file: string;
    private data: any;

    public constructor(file: string, create?: ((source: DataSource) => void), autoOpen: boolean = true) {
        this.file = file;
        if (autoOpen) {
            this.open(create);
        }
    }

    public open(create?: ((source: DataSource) => void)): void {
        if (fs.existsSync(this.file) && fs.statSync(this.file).isFile()) {
            this.data = JSON.parse(this.readString().toString());
        } else {
            this.data = {};
            if (!!create) {
                create(this);
            }
        }
    }

    public save(): void {
        const str: string | Buffer = this.generateString();
        fs.writeFileSync(this.file, str);
    }

    protected generateString(): string | Buffer {
        return JSON.stringify(this.data);
    }

    protected readString(): Buffer {
        return fs.readFileSync(this.file);
    }

    public getEntries<T extends {}>(name: string): T[] {
        if (!(name in this.data)) {
            this.data[name] = [];
        }

        return this.data[name];
    }

    public update<T extends {}>(name: string, where: WhereCallback<T>, update: Partial<T>): void {
        this.data[name] = this.getEntries<T>(name).map((item: T, index: number) => {
            if (where(item, index)) {
                Object.keys(update).forEach(key => {
                    item[key] = update[key];
                });
            }

            return item;
        });
    }

    public remove<T extends {}>(name: string, where: WhereCallback<T>): void {
        this.data[name] = this.getEntries<T>(name).filter((item: T, index: number) => !where(item, index));
    }
}

const IV_SIZE: number = 16;
const ALGO: string = "aes-256-cbc";

export class SecuredDataSource extends DataSource {
    private psw: string;

    public set key(value: string) {
        this.psw = value;
    }

    public constructor(file: string, psw: string, create?: ((source: DataSource) => void)) {
        super(file, null, false);
        this.psw = psw;
        this.open(create);
    }

    protected generateString(): string | Buffer {
        let str: string | Buffer = super.generateString();
        if (typeof str == "string") {
            str = Buffer.from(str);
        }

        const key: Buffer = crypto.scryptSync(this.psw, 'revenue', 32);
        const iv: Buffer = crypto.randomBytes(IV_SIZE);

        const cipher: crypto.Cipher = crypto.createCipheriv(ALGO, key, iv);
        const data: Buffer = Buffer.concat([cipher.update(str), cipher.final()]);
        return Buffer.concat([iv, data]);
    }

    protected readString(): Buffer {
        const raw_data: Buffer = super.readString();

        const key: Buffer = crypto.scryptSync(this.psw, 'revenue', 32);
        const iv: Buffer = raw_data.subarray(0, IV_SIZE);
        const data: Buffer = raw_data.subarray(IV_SIZE);

        const decipher: crypto.Decipher = crypto.createDecipheriv(ALGO, key, iv);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }
}