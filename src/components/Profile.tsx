import {PageMetadata} from "./metadata";
import {revenue} from "../revenue";
import ChangePasswordForm from "./ChangePasswordForm";

interface ProfileMetadata extends PageMetadata {
    onLogout(): void
}

export default function Profile({
                                    onLogout
                                }: ProfileMetadata) {
    return (
        <div className="container-fluid show" style={{
            width: "calc(100% - 2rem)"
        }}>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Profile</h3>
                    </div>
                    <div className="mb-5">
                        <h4 style={{
                            fontWeight: 100
                        }}>Details</h4>
                        <ul className="list-unstyled">
                            <li><strong>Name: </strong>{revenue.information.getUserName()}</li>
                            <li><strong>Anzahl Jahre: </strong>{revenue.charts.getYearsNames().length}</li>
                            <li><strong>Einträge: </strong>{revenue.charts.countEntries()}</li>
                        </ul>
                    </div>
                    <div className="mb-5">
                        <h4 style={{
                            fontWeight: 100
                        }}>Passwort ändern</h4>
                        <ChangePasswordForm/>
                    </div>
                    <div>
                        <h4 style={{
                            fontWeight: 100
                        }}>Account löschen</h4>
                        <button className="btn btn-primary" type="button" onClick={() => {
                            revenue.confirm("Wollen sie wirklich ihr account löschen?").then(e => {
                                if (e) {
                                    revenue.deleteCurrentAccount();
                                    onLogout();
                                }
                            });
                        }}>Löschen
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Security</h3>
                    </div>
                    <p className="border p-1 bg-dark rounded-1">
                        Hi<br/><br/>
                        Es ist wichtig, RSA-Zertifikate wie geheime Schlüssel zu behandeln, um die Sicherheit der App zu
                        gewährleisten. Das Teilen dieser Zertifikate sollte nur erfolgen, wenn Sie dem API, der App
                        oder
                        anderen externen Anwendungen vollständig vertrauen. Das versehentliche oder absichtliche Teilen
                        könnte zu Sicherheitsrisiken führen. Halten Sie Ihre Zertifikate daher supergeheim, ähnlich wie
                        Ihre persönlichen Passwörter, um Ihre Daten in der App sicher zu halten.<br/><br/>

                        Zusätzlich sollten Sie beachten, dass die RSA-Zertifikate ausschließlich für den sicheren
                        Datentransport über das Internet bestimmt sind. Diese Zertifikate spielen eine entscheidende
                        Rolle bei der Verschlüsselung und Gewährleistung der Vertraulichkeit Ihrer Daten während der
                        Übertragung.
                        <br/><br/>
                        Vielen Dank für die Beachtung dieser Sicherheitsmaßnahme!
                    </p>
                    <div>
                        <h4 style={{
                            fontWeight: 100
                        }}>Public Key</h4>
                    </div>
                    <div className="mb-5 p-1 bg-dark rounded-2">
                        <pre><code>{revenue.getAttribute("public_key")}</code></pre>
                    </div>
                    <div>
                        <h4 style={{
                            fontWeight: 100
                        }}>Private Key</h4>
                    </div>
                    <div className="p-1 bg-dark rounded-2">
                        <pre><code>{revenue.getAttribute("private_key")}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    );
}