import * as path from "path";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as os from "os";
import * as chroma from "chroma-js";
import {DataSource, SecuredDataSource} from "./data";
import * as jdenticon from "jdenticon";
import * as electron from "electron";
import * as fs from "fs";
import {throws} from "node:assert";

// region METADATA
interface AccountTable {
    name: string;
    email: string;
    password: string;
    guid: string;
}

type AttributeKeys =
    "themeMode" |
    "themeColor" |
    "themeHoverColor" |
    "themeActiveColor" |
    "public_key" |
    "private_key" |
    "tag_count" |
    "profile_picture" |
    "hsnToken" |
    "hsnRegistry";

interface AttributeTable {
    key: AttributeKeys;
    value: string;
}

interface EntryTable {
    tag: number;
    value: number;
    description: string;
    day: number;
    month: number;
    year: number;
}

interface YearTable {
    name: number;
}

interface TagTable {
    id: number;
    name: string;
    income: boolean;
}

abstract class Entry {
    protected source: DataSource;

    public bind(db: DataSource): this {
        this.source = db;
        return this;
    }

    public save(): void {
        this.source.save();
    }
}

class AccountWrapper extends Entry {
    public data: AccountTable;

    public constructor(data: AccountTable) {
        super();
        this.data = data;
    }
}

export type Account = AccountWrapper;
// endregion

let administration: DataSource;
let currentAccount: SecuredDataSource | null;
let currentEmail: string | null;
let version: string;
let appData: string;

class ChartsWrapper implements ChartsData {
    public getYears(income: boolean, expense: boolean): number[] {
        if (!currentAccount) {
            return [];
        }
        const years: number[] = [];

        currentAccount.getEntries<YearTable>("years").forEach(row => {
            years.push(this.getYear(row.name, income, expense).reduce((a, b) => a + b, 0));
        });

        return years;
    }

    public getYear(year: number, income: boolean, expense: boolean): number[] {
        if (!currentAccount) {
            return [];
        }

        const months: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        currentAccount.getEntries<EntryTable>("entries").filter(row => row.year == year).forEach((row) => {
            const tag: TagTable = this.getTag(row.tag);
            if (tag.income && income) {
                months[row.month - 1] += row.value;
            } else if (!tag.income && expense) {
                months[row.month - 1] += -row.value;
            }
        });

        return months;
    }

    public getYearsNames(): string[] {
        if (!currentAccount) {
            return [];
        }
        return currentAccount.getEntries<YearTable>("years").map(row => row.name.toString());
    }

    public countEntries(): number {
        if (!currentAccount) {
            return 0;
        }

        return currentAccount.getEntries<EntryTable>("entries").length;
    }

    private getTag(id: number): TagTable {
        return currentAccount.getEntries<TagTable>("tags").find(tag => tag.id == id);
    }
}

class InformationWrapper implements Information {
    public getVersion(): string {
        return version;
    }

    public getVersionType(): string {
        return revenue.hasAttribute("hsnToken") ? "Online Version" : "Offline Version";
    }

    public getPlatform(): string {
        let s: string;
        switch (os.platform()) {
            case "win32":
                s = "Windows";
                break;
            case "linux":
                s = "Linux";
                break;
            case "darwin":
                s = "MacOS";
                break;
            default:
                s = "<unknown>";
        }

        return s + " " + os.arch();
    }

    public getUserName(): string {
        if (!currentEmail) {
            return "";
        }

        return administration.getEntries<AccountTable>("accounts").filter(acc => acc.email == currentEmail)[0].name;
    }
}

class RevenueWrapper implements Revenue {
    public constructor() {
        const query: URLSearchParams = new URLSearchParams(window.location.search);
        appData = query.get("appData");
        version = query.get("version");
        administration = new DataSource(path.join(appData, "administration"));
    }

    public getAccounts(): readonly Account[] {
        return administration.getEntries<AccountTable>("accounts").map(entry => new AccountWrapper(entry).bind(administration));
    }

    public createAccount(data: Partial<AccountTable>): Account {
        do {
            data.guid = this.generateRandomString(25);
        } while (!!this.getAccounts().find(acc => acc.data.guid == data.guid));
        const psw: string = data.password;
        data.password = bcrypt.hashSync(data.password, 1024);
        administration.getEntries<AccountTable>("accounts").push(data as AccountTable);
        administration.save();


        currentAccount = new SecuredDataSource(path.join(appData, data.guid), psw);
        const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        });

        jdenticon.configure({
            hues: [196],
            lightness: {
                color: [0.36, 0.70],
                grayscale: [0.24, 0.82]
            },
            saturation: {
                color: 0.51,
                grayscale: 0.10
            },
            backColor: "#0000"
        });
        const png: string = "data:image/png;base64," + jdenticon.toPng(data.email, 420).toString("base64");


        currentAccount.getEntries<AttributeTable>("attributes").push({
                key: "themeMode",
                value: "dark"
            },
            {
                key: "themeColor",
                value: "#E14ECA"
            },
            {
                key: "themeHoverColor",
                value: "#E669D2"
            },
            {
                key: "themeActiveColor",
                value: "#E669D2"
            },
            {
                key: "public_key",
                value: publicKey
            },
            {
                key: "private_key",
                value: privateKey
            },
            {
                key: "tag_count",
                value: "14"
            },
            {
                key: "profile_picture",
                value: png
            }
        );
        currentAccount.getEntries<YearTable>("years").push({
            name: new Date().getFullYear()
        });
        currentAccount.getEntries<TagTable>("tags").push(
            {
                id: 1,
                name: "Gehalt",
                income: true
            },
            {
                id: 2,
                name: "Bonus",
                income: true
            },
            {
                id: 3,
                name: "Investitionen",
                income: true
            },
            {
                id: 4,
                name: "Lebensmittel",
                income: false
            },
            {
                id: 5,
                name: "Wohnen",
                income: false
            },
            {
                id: 6,
                name: "Transport",
                income: false
            },
            {
                id: 7,
                name: "Unterhaltung",
                income: false
            },
            {
                id: 8,
                name: "Schulden & Darlehen",
                income: false
            },
            {
                id: 9,
                name: "Ersparnisse",
                income: false
            },
            {
                id: 10,
                name: "Bildung",
                income: false
            },
            {
                id: 12,
                name: "Pflege",
                income: false
            },
            {
                id: 13,
                name: "Sonstiges",
                income: false
            }
        );
        currentAccount.save();
        currentEmail = data.email;
        return new AccountWrapper(data as AccountTable).bind(administration);
    }

    public decodeData(data: string): string | null {
        if (!currentAccount) {
            return null;
        }
        console.log(data);
        const decrypt: Buffer = crypto.privateDecrypt({
            key: this.getAttribute("private_key"),
            passphrase: "top secret",
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(data, "base64"));

        return decrypt.toString("utf-8");
    }


    public deleteCurrentAccount(): void {
        if (!currentAccount) {
            return;
        }
        fs.unlinkSync(currentAccount.file);
        currentAccount = null;
        administration.remove<AccountTable>("accounts", acc => acc.email == currentEmail);
        administration.save();
        currentEmail = null;
    }

    public login(email: string, password: string): Account | string {
        const acc: AccountTable | null = administration.getEntries<AccountTable>("accounts").find(acc => acc.email == email);
        if (!acc) {
            return `Kein Account ist auf die Email '${email}' registriert`;
        }

        if (!bcrypt.compareSync(password, acc.password)) {
            return "Falsches Passwort";
        }

        currentEmail = acc.email;
        currentAccount = new SecuredDataSource(path.join(appData, acc.guid), password);
        return new AccountWrapper(acc).bind(administration);
    }

    public logout() {
        if (!!currentAccount) {
            currentAccount.save();
        }
        currentAccount = null;
    }

    public getAttribute(name: AttributeKeys): string {
        return currentAccount?.getEntries<AttributeTable>("attributes").find(row => row.key == name)?.value || "";
    }

    public setAttribute(name: AttributeKeys, value: string): void {
        if (!currentAccount) {
            return;
        }

        if (name == "themeColor") {
            const color: chroma.Color = chroma.hex(value);
            const active: chroma.Color = color.brighten(0.20);
            const hover: chroma.Color = color.brighten(0.10);

            this.setAttribute("themeHoverColor", hover.hex("rgba"));
            this.setAttribute("themeActiveColor", active.hex("rgba"));
        }

        const effected: number = currentAccount.update<AttributeTable>("attributes", (item) => item.key == name, {
            value: value
        });
        console.log(name, effected);
        if (effected == 0) {
            currentAccount.getEntries<AttributeTable>("attributes").push({
                key: name,
                value: value
            });
        }
        currentAccount.save();
    }

    public hasAttribute(name: AttributeKeys): boolean {
        if (!currentAccount) {
            return false;
        }

        let ele: AttributeTable = currentAccount.getEntries<AttributeTable>("attributes").find(row => row.key == name)
        return !!ele;
    }

    public removeAttribute(name: AttributeKeys): void {
        if (!currentAccount) {
            return;
        }

        currentAccount.remove<AttributeTable>("attributes", row => row.key == name);
        currentAccount.save();
    }

    public getTags(): TagTable[] {
        return currentAccount?.getEntries<TagTable>("tags") || [];
    }

    public sumTag(id: number, year: number): number {
        if (!currentAccount) {
            return 0;
        }

        return currentAccount.getEntries<EntryTable>("entries").filter(entry => entry.tag == id && entry.year == year).map(entry => entry.value).reduce((a, b) => a + b, 0);
    }

    public getEntriesByTag(id: number, year: number): EntryTable[] {
        if (!currentAccount) {
            return [];
        }

        return currentAccount.getEntries<EntryTable>("entries").filter(entry => entry.tag == id && entry.year == year);
    }

    public createYear(): number {
        if (!currentAccount) {
            return 0;
        }

        let res: number = currentAccount.getEntries<YearTable>("years").push({
            name: currentAccount.getEntries<YearTable>("years").at(-1).name + 1
        }) - 1;
        currentAccount.save();
        return res;
    }

    public createEntry(description: string, value: number, tag: number, date: Date): void {
        if (!currentAccount) {
            return;
        }

        currentAccount.getEntries<EntryTable>("entries").push({
            description: description,
            value: value,
            tag: tag,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        });
        currentAccount.save();
    }

    public removeEntry(entry: EntryTable): void {
        if (!currentAccount) {
            return;
        }

        currentAccount.remove<EntryTable>("entries", row => {
            return row == entry;
        });
        currentAccount.save();
    }

    public createTag(name: string, income: boolean): void {
        if (!currentAccount) {
            return;
        }

        const id: number = parseInt(currentAccount.getEntries<AttributeTable>("attributes").find(row => row.key == "tag_count").value);
        currentAccount.getEntries<TagTable>("tags").push({
            id: id,
            name: name,
            income: income
        });
        currentAccount.update<AttributeTable>("attributes", item => item.key == "tag_count", {
            value: (id + 1).toString()
        });
        currentAccount.save();
    }

    public removeTag(id: number): void {
        if (!currentAccount) {
            return;
        }

        currentAccount.remove<TagTable>("tags", tag => tag.id == id);
        currentAccount.remove<EntryTable>("entries", entry => entry.tag == id);
        currentAccount.save();
    }

    public changePassword(password: string): void {
        administration.update<AccountTable>("accounts", acc => acc.email == currentEmail, {
            password: bcrypt.hashSync(password, 1024)
        });
        administration.save();
        currentAccount.key = password;
        currentAccount.save();
    }

    public alert(message: string): Promise<void> {
        return new Promise<void>(resolve => {
            electron.ipcRenderer.once("alert", () => {
                resolve();
            });
            electron.ipcRenderer.send("alert", {
                message: message
            });
        });
    }

    public confirm(message: string, okMessage: string = "Ja", noMessage: string = "Nein"): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            electron.ipcRenderer.once("confirm", (event, args) => {
                resolve(args.status);
            });
            electron.ipcRenderer.send("confirm", {
                message: message,
                btn1: okMessage,
                btn2: noMessage
            });
        });
    }

    private generateRandomString(length: number): string {
        const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result: string = "";

        for (let i = 0; i < length; i++) {
            const randomIndex: number = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    public charts: ChartsData = new ChartsWrapper();
    public information: Information = new InformationWrapper();
}

const revenue: Revenue = new RevenueWrapper();
// @ts-ignore
window.revenue = revenue;

// region Expose
export interface Revenue {
    getAccounts(): readonly Account[];

    createAccount(data: Partial<AccountTable>): Account;

    decodeData(data: string): string | null;

    deleteCurrentAccount(): void

    login(email: string, password: string): Account | string;

    logout(): void

    charts: ChartsData;

    getAttribute(name: AttributeKeys): string;

    setAttribute(name: AttributeKeys, value: string): void

    hasAttribute(name: AttributeKeys): boolean

    removeAttribute(name: AttributeKeys): void;

    getTags(): TagTable[];

    sumTag(id: number, year: number): number;

    getEntriesByTag(id: number, year: number): EntryTable[]

    createYear(): number;

    createEntry(description: string, value: number, tag: number, date: Date): void;

    removeEntry(entry: EntryTable): void

    createTag(name: string, income: boolean): void;

    removeTag(id: number): void;

    changePassword(password: string): void;

    alert(message: string): Promise<void>;

    confirm(message: string, okMessage?: string, noMessage?: string): Promise<boolean>;

    information: Information;
}

export interface ChartsData {
    getYears(income: boolean, expense: boolean): number[];

    getYear(year: number, income: boolean, expense: boolean): number[];

    getYearsNames(): string[];

    countEntries(): number;
}

export interface Information {
    getVersion(): string;

    getVersionType(): string;

    getPlatform(): string;

    getUserName(): string;
}

// endregion