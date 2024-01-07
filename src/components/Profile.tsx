import {PageMetadata} from "./metadata";
import {AccountReq, makeRequest, RegistryReq, revenue, UnknownReq} from "../revenue";
import ChangePasswordForm from "./ChangePasswordForm";
import {useState} from "react";
import QRCode from "react-qr-code";
import HSNLogin from "./HSNLogin";

interface ProfileMetadata extends PageMetadata {
    onLogout(): void
}

async function uploadData(token: string): Promise<boolean> {
    const info: AccountReq = await makeRequest("https://hexa-studio.de:8443/act/info", token);
    console.log(info);
    if (info.code != 200) {
        return false;
    }
    const registry: RegistryReq = await makeRequest("https://hexa-studio.de:8443/api/select/revenue.registry", token, {
        where: {
            account: info.id,
        }
    });
    if (registry.code != 200) {
        return false;
    }
    revenue.setAttribute("hsnRegistry", registry.data[0].id);
    let req: UnknownReq = await makeRequest(`https://hexa-studio.de:8443/api/update/revenue.registry.detail/${registry.data[0].detail}`, token, {
        data: {
            publicPEM: revenue.getAttribute("public_key"),
            tags: revenue.getTags()
        }
    });
    if (req.code != 200) {
        return false;
    }
    req = await makeRequest(`https://hexa-studio.de:8443/api/update/revenue.registry/${registry.data[0].id}`, token, {
        data: {
            revision: registry.data[0].revision + 1
        }
    });
    if (req.code != 200) {
        return false;
    }
    req = await makeRequest(`https://hexa-studio.de:8443/api/select/revenue.registry/${registry.data[0].id}`, token);
    return req.code == 200;
}

export default function Profile({
                                    onLogout
                                }: ProfileMetadata) {
    const [showHSN, setShowHSN] = useState(false);
    const [reloadState, setReloadState] = useState(0);

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
                    <div className="mb-5">
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
                    <div>
                        <h4 style={{
                            fontWeight: 100
                        }}>Account mit HSN Verbinden</h4>
                        <h5>Features</h5>
                        <ul className="list-unstyled">
                            <li><b>API Gateway:</b> Benutzen sie die Möglichkeit das volle Potenzial der App durch
                                weitere App wie z.B. Revenue Mobile zu erweitern und voll auszuschöpfen
                            </li>
                            <li>
                                <b>Mehr kommt demnächst...</b>
                            </li>
                        </ul>
                        <h5 className="mt-3">Sicherheit</h5>
                        <ul className="list-unstyled">
                            <li><b>End zu End:</b> Alle Daten die über das Internet transportiert werden sind
                                Verschlüsselt dafür werden die RSA-Zertifikate die unten gelistet sind benutzt.
                            </li>
                            <li><b>Lebenszeit (TTL):</b> Alle Daten werden nach dem Sie abgerufen wurden unwiderruflich
                                gelöscht.
                            </li>
                        </ul>
                        {revenue.hasAttribute("hsnToken") ?
                            <>
                                <span className="text-primary">Account ist bereits verknüpft</span>
                                <br/>
                                <button className="btn btn-primary mt-4" onClick={() => {
                                    revenue.confirm("Wirklich die Verknüpfung löschen?").then(r => {
                                        if (r) {
                                            revenue.removeAttribute("hsnToken");
                                            revenue.removeAttribute("hsnRegistry");
                                            setReloadState(reloadState + 1);
                                        }
                                    });
                                }}>
                                    Verknüpfung aufheben
                                </button>
                            </> :
                            <>
                                <button className="btn btn-primary mt-4" onClick={() => {
                                    if (!window.navigator.onLine) {
                                        revenue.alert("Sie benötigen eine Internet Verbindung zum Verknüpfen");
                                        return;
                                    }
                                    setShowHSN(true);
                                }}>
                                    HSN Verknüpfen
                                </button>
                                {showHSN ? <HSNLogin
                                    onSuccess={async (token) => {
                                        let successful = await uploadData(token);
                                        revenue.setAttribute("hsnToken", token);
                                        if (successful) {
                                            revenue.alert("Erfolgreich mit HSN Verbunden");
                                        } else {
                                            revenue.removeAttribute("hsnToken");
                                            revenue.removeAttribute("hsnRegistry");
                                            revenue.alert("Fehler beim verbinden mit HSN. Versuchen Sie es später wieder.");
                                        }
                                        setShowHSN(false);
                                    }}
                                    onFail={() => {
                                        revenue.alert("Fehler beim verbinden mit HSN. Versuchen Sie es später wieder.");
                                        setShowHSN(false);
                                    }}
                                /> : null}
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Security</h3>
                    </div>
                    <p className="border p-1 bg-dark rounded-1 mb-5">
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
                    {revenue.hasAttribute("hsnToken") && revenue.hasAttribute("hsnRegistry") ?
                        <>
                            <div>
                                <h4 style={{
                                    fontWeight: 100
                                }}>Connection QR Code
                                </h4>
                            </div>
                            <div className="p-2 bg-dark rounded-2 mb-5">
                                <QRCode
                                    className="bg-white rounded-4 p-2"
                                    level="L"
                                    fgColor="#000000"
                                    bgColor="#FFFFFF"
                                    value={revenue.getAttribute("hsnToken") + "\n" + revenue.getAttribute("hsnRegistry")}
                                />
                            </div>
                        </>
                        : null
                    }
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