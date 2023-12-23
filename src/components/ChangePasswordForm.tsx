import React, {useState} from "react";
import {revenue} from "../revenue";

export default function ChangePasswordForm() {
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const changePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password != passwordRepeat) {
            revenue.alert("Passwörter stimmen nicht überein")
            return;
        }

        revenue.changePassword(password);
        setPassword("");
        setPasswordRepeat("");
    };

    return (
        <form onSubmit={changePassword}>
            <div className="mb-4" style={{
                width: 400
            }}>
                <input name="password" type="password" className="form-control" required={true} value={password}
                       placeholder="Passwort" onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-4" style={{
                width: 400
            }}>
                <input name="passwordRepeat" type="password" className="form-control" required={true}
                       value={passwordRepeat} placeholder="Passwort wiederholen"
                       onChange={(e) => setPasswordRepeat(e.target.value)}
                />
            </div>
            <button className="btn btn-primary text-light" type="submit">Ändern</button>
        </form>
    );
}