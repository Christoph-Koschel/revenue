import {Account} from "../../src-app/preload/preload";
import React, {useState} from "react";
import {revenue} from "../revenue";

interface CreateAccountFormMetadata {
    onSubmit(account: Account): void
}

export default function CreateAccountForm({
                                              onSubmit
                                          }: CreateAccountFormMetadata) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const createAccount = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (password != passwordRepeat) {
            revenue.alert("Passwörter stimmen nicht überein")
            return;
        }

        if (!!revenue.getAccounts().find((acc) => acc.data.email == email)) {
            revenue.alert(`Account mit der Email '${email}' existiert bereits`);
            return;
        }

        const account = revenue.createAccount({
            email: email,
            name: name,
            password: password
        });

        onSubmit(account);
    }

    return (
        <form style={{
            width: 350
        }} onSubmit={createAccount}>
            <h3 className="mb-3">Account erstellen</h3>
            <div className="mb-4">
                <input className="form-control" type="text" placeholder="Name" value={name}
                       onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <input className="form-control" type="email" placeholder="Email" value={email}
                       onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <input className="form-control" type="password" placeholder="Passwort" value={password}
                       onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <input className="form-control" type="password" placeholder="Passwort wiederholen"
                       value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" type="submit">
                Anlegen
            </button>
        </form>
    );
}