import {revenue} from "../revenue";
import React, {useState} from "react";

interface EntryAddFormMetadata {
    onSubmit(description: string, value: number, tag: number, date: Date): void;
}

export default function EntryAddForm({
                                         onSubmit
                                     }: EntryAddFormMetadata) {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState(0);
    const [tag, setTag] = useState(revenue.getTags()[0]?.id || -1);

    const newEntry = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (tag == -1) {
            return;
        }

        onSubmit(description, value, tag, new Date());
        setDescription("");
        setValue(0);
        setTag(-1);
    };

    return (
        <form className="d-flex justify-content-center flex-column align-items-center entry-add" onSubmit={newEntry}
              style={{
                  maxWidth: 400
              }}>
            <div className="mb-4 w-100">
                <input className="form-control" type="text" value={description} required={true}
                       placeholder="Beschreibung" onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div className="mb-4 w-100">
                <input className="form-control" type="number" placeholder="Wert" value={value} required={true}
                       step="0.01" onChange={(e) => setValue(parseFloat(e.target.value))}/>
            </div>
            <div className="mb-4 w-100">
                <select className="form-select" value={tag} required={true}
                        onChange={(e) => setTag(parseInt(e.target.value))}>
                    {revenue.getTags().map(tag => (
                        <option value={tag.id}>{tag.name}</option>
                    ))}
                </select>
            </div>
            <button className="btn btn-primary text-light px-5" type="submit">Hinzufügen</button>
        </form>
    );
}