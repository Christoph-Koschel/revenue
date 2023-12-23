type BasicCallback<T> = { (item: T, index: number): boolean };
type SelectCallback<T, R> = { (item: T, index: number): R };
type WhereCallback<T> = BasicCallback<T>;
type UntilCallback<T> = BasicCallback<T>;
type AllCallback<T> = BasicCallback<T>;
type AnyCallback<T> = BasicCallback<T>;
type CountCallback<T> = BasicCallback<T>;
type FirstCallback<T> = BasicCallback<T>;
type LastCallback<T> = BasicCallback<T>

type BasicWrapperCallback<R> = (item: R, index: number) => boolean;

declare global {
    interface Array<T> {
        select<R>(cb: SelectCallback<T, R>): R[];

        where(cb: WhereCallback<T>): T[];

        until(cb: UntilCallback<T>): T[];

        all(cb: AllCallback<T>, smart?: boolean): boolean;

        any(cb?: AnyCallback<T>, smart?: boolean): boolean;

        count(cb: CountCallback<T>): number;

        first(cb: FirstCallback<T>): T;

        last(cb: LastCallback<T>): T;

        chunk(size: number): T[][];
    }
}

Array.prototype.select = function <R>(cb: (item: any, index: number) => R): R[] {
    const result: R[] = [];
    this.forEach((item, index) => {
        result.push(cb(item, index));
    });

    return result;
}

Array.prototype.where = function <R>(cb: BasicWrapperCallback<R>): R[] {
    const result: R[] = [];
    this.forEach((item, index) => {
        if (cb(item, index)) {
            result.push(item);
        }
    });

    return result;
}

Array.prototype.until = function <R>(cb: BasicWrapperCallback<R>): R[] {
    const result: R[] = [];
    let index: number = 0;

    for (const item of this) {
        if (!cb(item, index++)) {
            break;
        }

        result.push(item);
    }

    return result;
}

Array.prototype.all = function <R>(cb: BasicWrapperCallback<R>, smart: boolean = true): boolean {
    let ok: boolean = true;

    let index: number = 0;
    for (const item of this) {
        if (!cb(item, index++)) {
            ok = false;
            if (!smart) {
                break;
            }
        }
    }

    return ok;
}

Array.prototype.any = function <R>(cb?: BasicWrapperCallback<R>, smart: boolean = true): boolean {
    if (!cb) {
        return this.length != 0;
    }

    let ok: boolean = false;

    let index: number = 0;
    for (const item of this) {
        if (cb(item, index++)) {
            ok = true;
            if (smart) {
                break;
            }
        }
    }

    return ok;
}

Array.prototype.count = function <R>(cb: BasicWrapperCallback<R>): number {
    let counter: number = 0;

    this.forEach((item, index) => {
        counter += cb(item, index) as unknown as number;
    });

    return counter;
}

Array.prototype.first = function <R>(cb: BasicWrapperCallback<R>): R | null {
    let index: number = 0;
    for (const item of this) {
        if (cb(item, index++)) {
            return item;
        }
    }

    return null;
}

Array.prototype.last = function <R>(cb: BasicWrapperCallback<R>): R | null {
    let last: R | null = null;
    this.forEach((item, index) => {
        if (cb(item, index)) {
            last = item;
        }
    });

    return last;
}

Array.prototype.chunk = function <R>(size: number): R[][] {
    const result: R[][] = [];
    let buff: R[] = [];

    for (let i: number = 0, k: number = 0; i < this.length; i++, k++) {
        if (k >= size) {
            k = 0;
            result.push(buff);
            buff = [];
        }

        buff.push(this[i]);
    }

    return result;
}

const VERSION: string = "1.0.0";
export default VERSION;