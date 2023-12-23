import React, {useState} from "react";

interface NewTagFormMetadata {
    onSubmit(name: string, income: boolean): void
}

export default function NewTagForm({
                                       onSubmit
                                   }: NewTagFormMetadata) {
    const [name, setName] = useState("");
    const [income, setIncome] = useState(true);

    const ev = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit(name, income);
        setName("");
        setIncome(true);
    }

    return (
        <form onSubmit={ev}>
            <div className="mb-4" style={{
                maxWidth: 400
            }}>
                <input className="form-control" type="text" required={true} placeholder="Name" value={name}
                       onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" id="formCheck-1" name="type" value="1"
                       onChange={(e) => setIncome(e.target.value == "1")}
                       checked={income}/>
                <label className="form-check-label" htmlFor="formCheck-1">Einnahme</label>
            </div>
            <div className="form-check mb-4">
                <input className="form-check-input" type="radio" id="formCheck-2" name="type" value="0"
                       onChange={(e) => setIncome(e.target.value == "1")}
                       checked={!income}/>
                <label className="form-check-label" htmlFor="formCheck-2">Ausgabe</label>
            </div>
            <input type="hidden" name="action" value="new_tag"/>
            <button className="btn btn-primary text-light" type="submit">Erstellen</button>
        </form>
    );
}