import {useState} from "react";
import {revenue} from "../revenue";

interface NavigationMetadata {
    activeItem: number;

    onChange(i: number): void;

    onLogout(): void;
}

interface NavigationItem {
    svg: string;
    title: string;
}

export default function Navigation({
                                       activeItem,
                                       onLogout,
                                       onChange
                                   }: NavigationMetadata) {
    const [active, setActive] = useState(activeItem);

    const items: NavigationItem[] = [
        {
            svg: "#home",
            title: "Home"
        },
        {
            svg: "#speedometer2",
            title: "Dashboard"
        },
        {
            svg: "#grid",
            title: "Tags"
        }
    ];
    const contextItems: NavigationItem[] = [
        {
            svg: "",
            title: "Einstellungen"
        },
        {
            svg: "",
            title: "Profil"
        }
    ];

    return (
        <div className="d-flex flex-column flex-shrink-0 bg-dark" style={{
            width: "4.5rem"
        }} data-bs-theme="dark">
            <a className="d-block p-3 link-light text-decoration-none">
                <img className="user-select-none" src="./assets/icons/icon.svg" height={32} width={40}/>
            </a>
            <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
                {items.map((item, index) => (
                    <li className="nav-item">
                        <a className={"nav-link py-3 border-bottom rounded-0 sidebar-link" + (active == index ? " active" : "")}
                           aria-current="page" title="" href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                           data-bs-original-title={item.title} onClick={() => {
                            setActive(index);
                            onChange(index);
                        }}>
                            <svg className="bi" width="40" height="32">
                                <use xlinkHref={item.svg}></use>
                            </svg>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="dropdown border-top">
                <a id="dropdownUser3"
                   className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle text-light"
                   data-bs-toggle="dropdown" aria-expanded="false" style={{
                    height: 60
                }}>
                    <img className="rounded-circle" width="24" height="24"
                         src={revenue.getAttribute("profile_picture")}/>
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                    {contextItems.map((item, index) => (
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => {
                                setActive(items.length + index);
                                onChange(items.length + index);
                            }}>
                                {item.title}
                            </a>
                        </li>
                    ))}
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li>
                        <a className="dropdown-item pointer" onClick={() => onLogout()}>Abmelden</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}