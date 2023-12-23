import {revenue} from "../revenue";
import EntryAddForm from "./EntryAddForm";
import {useState} from "react";
import {Doughnut, Line} from "react-chartjs-2";
import {ArcElement, CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip} from "chart.js";

interface DashboardPanelMetadata {
    year: number,
    active: boolean
}

export default function DashboardPanel({
                                           year,
                                           active
                                       }: DashboardPanelMetadata) {
    const [updateCount, updateState] = useState(0);

    Chart.register(
        CategoryScale,
        LinearScale,
        PointElement,
        ArcElement,
        LineElement,
        Title,
        Tooltip
    );

    return (
        <div className={"container-fluid" + (active ? " show" : "")}
             style={{
                 width: "calc(100% - 2rem)"
             }}>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>JAHR {year}</h3>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h6>Monats</h6>
                        <h3>Einkommen</h3>
                    </div>
                    <div style={{
                        height: 300,
                        width: "100%"
                    }}>
                        <Line
                            data={{
                                labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Julie", "August", "September", "Oktober", "November", "Dezember"],
                                datasets: [
                                    {
                                        data: revenue.charts.getYear(year, true, false),
                                        tension: 0.1,
                                        fill: false,
                                        borderColor: revenue.getAttribute("themeColor")
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h6>Monats</h6>
                        <h3>Umsatz</h3>
                    </div>
                    <div style={{
                        height: 300,
                        width: "100%"
                    }}>
                        <Line
                            data={{
                                labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Julie", "August", "September", "Oktober", "November", "Dezember"],
                                datasets: [
                                    {
                                        data: revenue.charts.getYear(year, true, true),
                                        tension: 0.1,
                                        fill: false,
                                        borderColor: revenue.getAttribute("themeColor")
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h6>Monats</h6>
                        <h3>Ausgaben</h3>
                    </div>
                    <div style={{
                        height: 300,
                        width: "100%"
                    }}>
                        <Line
                            data={{
                                labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Julie", "August", "September", "Oktober", "November", "Dezember"],
                                datasets: [
                                    {
                                        data: revenue.charts.getYear(year, false, true),
                                        tension: 0.1,
                                        fill: false,
                                        borderColor: revenue.getAttribute("themeColor")
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="table-responsive bg-gray-dark">
                        <table className="table transparent">
                            <thead>
                            <tr>
                                <th>TAG</th>
                                <th>TOTAL&nbsp;VALUE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {revenue.getTags().map(tag => (
                                <tr>
                                    <td>{tag.name}</td>
                                    <td>{revenue.sumTag(tag.id) * (tag.income ? 1 : -1)}€</td>
                                </tr>
                            ))}
                            <tr className="pt-2">
                                <td><b>TOTAL</b></td>
                                <td>
                                    {((): number => {
                                        let total = 0;
                                        revenue.getTags().forEach(tag => {
                                            if (tag.income) {
                                                total += revenue.sumTag(tag.id);
                                            } else {
                                                total += -revenue.sumTag(tag.id);
                                            }
                                        });

                                        return total;
                                    })()}
                                    €
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div>
                        <ul className="nav nav-tabs" role="tablist">
                            {revenue.getTags().map((tag, index) => (
                                <li className="nav-item" role="presentation">
                                    <a className={"nav-link" + (index == 0 ? " active" : "")} role="tab"
                                       data-bs-toggle="tab" href={"#tags-details-" + tag.id}>
                                        {tag.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-content" style={{
                            backgroundColor: "var(--bs-body-bg)"
                        }}>
                            {revenue.getTags().map((tag, index) => (
                                <div className={"tab-pane p-3" + (index == 0 ? " active show" : "")}
                                     role="tabpanel"
                                     id={"tags-details-" + tag.id}>
                                    <div className="table-responsive">
                                        <table className="table transparent">
                                            <thead>
                                            <tr>
                                                <th>Beschreibung</th>
                                                <th>Wert</th>
                                                <th>Datum</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {revenue.getEntriesByTag(tag.id, year).map(entry => (
                                                <tr>
                                                    <td>{entry.description}</td>
                                                    <td>{entry.value}€</td>
                                                    <td>{entry.day.toString().padStart(2, "0") + "." + entry.month.toString().padStart(2, "0") + "." + entry.year}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Neuer Eintrag</h3>
                    </div>
                    <EntryAddForm
                        onSubmit={(description: string, value: number, tag: number, date: Date): void => {
                            revenue.createEntry(description, value, tag, date);
                            updateState(updateCount + 1);
                        }}/>
                </div>
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h3>Zusammensetzung</h3>
                    </div>
                    <div style={{
                        maxHeight: 500
                    }}>
                        <Doughnut
                            data={{
                                labels: revenue.getTags().map(tag => tag.name),
                                datasets: [
                                    {
                                        data: revenue.getTags().map(tag => (tag.income ? 1 : -1) * revenue.getEntriesByTag(tag.id, year).map(entry => entry.value).reduce((a, b) => a + b, 0)),
                                        backgroundColor: revenue.getAttribute("themeColor")
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}