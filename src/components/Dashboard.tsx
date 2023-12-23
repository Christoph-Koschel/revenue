import {PageMetadata} from "./metadata";
import {revenue} from "../revenue";
import {useState} from "react";

import DashboardPanel from "./DashboardPanel";

interface DashboardMetadata extends PageMetadata {

}

export default function Dashboard({
                                  }: DashboardMetadata) {
    const [active, setActive] = useState(0);

    return (
        <div className="m-0 d-flex show" style={{
            height: "100vh"
        }}>
            <div className="d-flex flex-column flex-shrink-0 bg-dark border-left overflow-y-auto" style={{
                width: "6rem"
            }} data-bs-theme="dark">
                <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
                    {revenue.charts.getYearsNames().map((year, index) => (
                        <li className="nav-item">
                            <a className={"nav-link p-3 border-bottom text-decoration-none text-light rounded-0 sidebar-link pointer" + (index == active ? " active" : "")}
                               onClick={() => setActive(index)}>
                                {year}
                            </a>
                        </li>
                    ))}
                </ul>
                <a className="text-decoration-none text-white text-center border-top py-3 primary-text-hover pointer"
                   onClick={() => setActive(revenue.createYear())}
                   style={{
                       height: 60
                   }}>
                    <i className="fas fa-plus" style={{
                        fontSize: "1.5rem"
                    }}/>
                </a>
            </div>
            <div className="pn-wrapper" style={{
                width: "calc(100% - 4.5rem)"
            }}>
                {revenue.charts.getYearsNames().map((year, index) => (
                    <DashboardPanel year={parseInt(year)} active={index == active}/>
                ))}
            </div>
        </div>
    );
}