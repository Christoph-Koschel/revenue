import {useState} from "react";

export interface HSNLoginMetadata {
    onSuccess(token: string): void;

    onFail(): void;
}

export default function HSNLogin({
                                     onSuccess,
                                     onFail
                                 }: HSNLoginMetadata) {
    const iframeURL: URL = new URL(`https://hexa-studio.de:8443/act/auth/visual?type=iframe&origin=${window.location.origin}&app=revenue`);
    const [show, setShow] = useState(false);

    window.onmessage = ev => {
        if (ev.origin == iframeURL.origin) {
            onSuccess(ev.data);
        }
    }

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
             style={{
                 background: "rgba(0,0,0,0.25)"
             }}>
            <div className="position-absolute top-0 end-0 m-3">
                <i className="fa fa-times text-white" style={{
                    fontSize: 25
                }} onClick={() => onFail()}></i>
            </div>
            <iframe src={iframeURL.toString()} style={{
                height: 500,
                width: 300,
                display: show ? "" : "none"
            }} onLoad={() => setShow(true)}/>
        </div>
    );
}