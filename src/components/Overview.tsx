import {PageMetadata} from "./metadata";
import {Line} from "react-chartjs-2";
import {
    Chart,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from "chart.js";
import {revenue} from "../revenue";


interface OverviewMetadata extends PageMetadata {

}

export default function Overview({
                                     account
                                 }: OverviewMetadata) {
    Chart.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip
    );
    return (
        <div id="page-home" className={"container-fluid show"}
             style={{
                 width: "calc(100% - 2rem)"
             }}>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header" style={{
                        margin: 0
                    }}>
                        <h6>Hallo</h6>
                        <h3>{account.data.name}</h3>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col shadow rounded-2 db-card">
                    <div className="db-card-header">
                        <h6>Jahres</h6>
                        <h3>Umsatz</h3>
                    </div>
                    <div
                        style={{
                            height: 600,
                            width: "100%"
                        }}>
                        <Line data={{
                            datasets: [
                                {
                                    data: revenue.charts.getYears(true, true),
                                    fill: false,
                                    tension: 0.1,
                                    borderColor: revenue.getAttribute("themeColor"),
                                }
                            ],
                            labels: revenue.charts.getYearsNames()
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
                    <div className="db-card-header">
                        <h6>Jahres</h6>
                        <h3>Einnahmen</h3>
                    </div>
                    <div className="chart years-graph" data-chart=""
                         style={{
                             height: 600,
                             width: "100%"
                         }}>
                        <Line data={{
                            datasets: [
                                {
                                    data: revenue.charts.getYears(true, false),
                                    fill: false,
                                    tension: 0.1,
                                    borderColor: revenue.getAttribute("themeColor"),
                                }
                            ],
                            labels: revenue.charts.getYearsNames()
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
                    <div className="db-card-header">
                        <h6>Jahres</h6>
                        <h3>Ausgaben</h3>
                    </div>
                    <div className="chart years-graph" data-chart=""
                         style={{
                             height: 600,
                             width: "100%"
                         }}>
                        <Line data={{
                            datasets: [
                                {
                                    data: revenue.charts.getYears(false, true),
                                    fill: false,
                                    tension: 0.1,
                                    borderColor: revenue.getAttribute("themeColor"),
                                }
                            ],
                            labels: revenue.charts.getYearsNames()
                        }}
                              options={{
                                  responsive: true,
                                  maintainAspectRatio: false
                              }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
