import React, {useState} from "react";
import {Account} from "../../src-app/preload/preload";
import {revenue} from "../revenue";

interface LoginFormMetadata {
    onSubmit(account: Account): void
}

export default function LoginForm({
                                      onSubmit
                                  }: LoginFormMetadata) {
    const accounts: readonly Account[] = revenue.getAccounts();
    const [email, setEmail] = useState(accounts.length > 0 ? accounts[0].data.email : "");
    const [password, setPassword] = useState("");

    const login = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const acc: Account | string = revenue.login(email, password);
        if (typeof acc == "string") {
            revenue.alert(acc);
            return;
        }

        onSubmit(acc);
    }

    return (
        <form style={{
            width: 350
        }} onSubmit={login}>
            <h3 className="mb-3">Login</h3>
            <div className="mb-4">
                <select className="form-select" onChange={(e) => setEmail(e.target.value)}>
                    {accounts.map((row, index) =>
                        <option selected={row.data.email == email}
                                value={row.data.email}
                                key={index}>
                            {row.data.name}
                        </option>
                    )}
                </select>
            </div>
            <div className="mb-4">
                <input className="form-control" type="password" placeholder="Passwort"
                       onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
        </form>
    )
}