import {Revenue} from "../src-app/preload/preload";
// @ts-ignore
export const revenue: Revenue = window.revenue;

export async function makeRequest(url: string, token: string, body?: any): Promise<any> {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && (this.status || this.status == 404)) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState == 4 && this.status == 0) {
                resolve({
                    code: 500,
                    error: "net::ERR_CONNECTION_REFUSED"
                });
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        try {
            if (!!body) {

                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        } catch {
            resolve({
                code: 500,
                error: "net::ERR_CONNECTION_REFUSED"
            });
        }
    });
}

export interface ErrorMessage {
    code: 404;
    error: string;
}

export interface UnknownInfo {
    code: 200;
}

export interface AccountInfo {
    code: 200;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface RegistryInfo {
    code: 200,
    data: {
        id: string;
        detail: string;
        revision: number;
        token: number;
    }[];
    count: number;
    offset: number;
    limit: number;
}

export interface RegistryDetailInfo {
    code: 200,
    data: {
        id: string;
        publicPEM: string | null;
        tags: any | null;
    }[];
    count: number;
    offset: number;
    limit: number;
}

export interface EntryInfo {
    code: 200,
    data: {
        id: string;
        registry: string;
        data: string;
        seen: boolean;
        created: string;
    }[];
    count: number;
    offset: number;
    limit: number;
}

export type AccountReq = AccountInfo | ErrorMessage;
export type RegistryReq = RegistryInfo | ErrorMessage;
export type RegistryDetailReq = RegistryDetailInfo | ErrorMessage;
export type EntryReg = EntryInfo | ErrorMessage;
export type UnknownReq = UnknownInfo | ErrorMessage;