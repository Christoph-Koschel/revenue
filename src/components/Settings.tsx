import {PageMetadata} from "./metadata";
import {revenue} from "../revenue";
import {Sketch} from "@uiw/react-color";
import React, {useState} from "react";

interface ProfileMetadata extends PageMetadata {

}

export default function Settings({
                                     account
                                 }: ProfileMetadata) {

    const [color, setColor] = useState(revenue.getAttribute("themeColor"));
    const [mode, setMode] = useState(revenue.getAttribute("themeMode"));

    const changeMode = (m: string) => {
        setMode(m);
        revenue.setAttribute("themeMode", m);
        document.body.setAttribute("data-bs-theme", m);
    }

    return (
        <div id="page-settings" className="container-fluid show" style={{
            width: "calc(100% - 2rem)"
        }}>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Settings</h3>
                    </div>
                    <div>
                        <h4 style={{
                            fontWeight: 100
                        }}>Theme</h4>
                        <div className="mb-2">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="formCheck-3"
                                       name="theme" checked={mode == "light"} onClick={() => changeMode("light")}/>
                                <label className="form-check-label" htmlFor="formCheck-3">Light</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="formCheck-4"
                                       name="theme" checked={mode == "dark"} onClick={() => changeMode("dark")}/>
                                <label className="form-check-label" htmlFor="formCheck-4">Dark</label>
                            </div>
                        </div>
                        <div>
                            <h4 style={{
                                fontWeight: 100
                            }}>Primär Farbe</h4>
                            <div className="mb-4">
                                <Sketch style={{
                                    "--sketch-background": "unset",
                                    "--sketch-swatch-border-top": "unset"
                                } as React.CSSProperties} color={color}
                                        onChange={(e) => {
                                            setColor(e.hexa);
                                        }}/>
                                <button className="btn btn-primary mt-2"
                                        onClick={() => {
                                            revenue.setAttribute("themeColor", color);
                                            document.body.setAttribute("style", `--rv-primary: ${revenue.getAttribute("themeColor")}; --rv-hover: ${revenue.getAttribute("themeHoverColor")}; --rv-active: ${revenue.getAttribute("themeActiveColor")}`);
                                        }}>
                                    Ändern
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Informationen</h3>
                    </div>
                    <div>
                        <ul className="list-unstyled">
                            <li><strong>Version</strong>: {revenue.information.getVersion()}</li>
                            <li><strong>Type</strong>: {revenue.information.getVersionType()}</li>
                            <li className="mb-4"><strong>System</strong>: {revenue.information.getPlatform()}</li>
                            <li className="small text-muted">Christoph Koschel (c) {new Date().getFullYear()}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}