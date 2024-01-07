import Spinner from "./Spinner";
import React, {useState} from "react";
import {EntryReg, makeRequest, revenue} from "../revenue";

interface PreloadMetadata {
    onFinish(): void;
}

interface DecryptedData {
    description: string;
    tag: number;
    value: number;
}

let started: boolean = false;

async function update(setTitle: React.Dispatch<React.SetStateAction<string>>): Promise<boolean> {
    if (started) {
        return false;
    }
    started = true;
    if (!window.navigator.onLine) {
        revenue.alert("Benötigt eine Internet verbindung zum Synchronisieren");
        return true;
    }

    const token: string = revenue.getAttribute("hsnToken");
    const registry: string = revenue.getAttribute("hsnRegistry");

    setTitle("Suche nach neuen Einträge");
    const data: EntryReg = await makeRequest("https://hexa-studio.de:8443/api/select/revenue.entry", token, {
        where: {
            registry: registry,
            seen: false
        }
    });
    if (data.code != 200) {
        return true;
    }
    for (let i: number = 0; i < data.count; i++) {
        const row = data.data[i];
        setTitle(`Füge neuen Eintrag hinzu (${i}/${data.count})`);
        try {
            const decryptedData: string | null = revenue.decodeData(row.data);
            if (!decryptedData) {
                setTitle("Eintrag ist korrumpiert und wird verworfen");
            } else {
                const obj: DecryptedData = JSON.parse(decryptedData);
                const date: Date = new Date(row.created);
                console.log(decryptedData, date);
                revenue.createEntry(obj.description, obj.value, obj.tag, date);
            }
        } finally {
            await makeRequest(`https://hexa-studio.de:8443/api/update/revenue.entry/${row.id}`, token, {
                data: {
                    seen: true
                }
            });
        }
    }

    return true;
}

export default function Preload({
                                    onFinish
                                }: PreloadMetadata) {
    const [title, setTitle] = useState("");
    update(setTitle).then(r => {
        if (r) {
            started = false;
            onFinish();
        }
    });

    return (
        <div
            className="position-fixed top-0 start-0 h-100 w-100 d-flex justify-content-center align-items-center flex-column">
            <Spinner/>
            <h2>{title}</h2>
        </div>
    );
}