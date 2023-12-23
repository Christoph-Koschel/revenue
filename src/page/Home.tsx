import SVG from "../components/utils/SVG";
import Navigation from "../components/Navigation";
import Overview from "../components/Overview";
import {Account} from "../../src-app/preload/preload";
import {useState} from "react";
import Dashboard from "../components/Dashboard";
import Tags from "../components/Tags";
import Profile from "../components/Profile";
import Settings from "../components/Settings";
import {revenue} from "../revenue";

interface HomeMetadata {
    account: Account;

    onLogout(): void;
}

function RenderPage(index: number, account: Account, onLogout:() => void) {
    switch (index) {
        case 0:
            return <Overview account={account}/>
        case 1:
            return <Dashboard account={account}/>
        case 2:
            return <Tags account={account}/>
        case 3:
            return <Settings account={account}/>
        case 4:
            return <Profile onLogout={onLogout} account={account}/>
        default:
            return <h1>Not exists</h1>

    }
}

export default function Home({
                                 account,
                                 onLogout
                             }: HomeMetadata) {
    const [page, setPage] = useState(0);

    document.body.setAttribute("data-bs-theme", revenue.getAttribute("themeMode"));
    document.body.setAttribute("style", `--rv-primary: ${revenue.getAttribute("themeColor")}; --rv-hover: ${revenue.getAttribute("themeHoverColor")}; --rv-active: ${revenue.getAttribute("themeActiveColor")}`);


    return (
        <>
            <SVG/>
            <div className="page">
                <Navigation onLogout={onLogout} onChange={(i) => setPage(i)} activeItem={0}/>
                <div className="pn-wrapper" style={{
                    width: "calc(100% - 4.5rem)"
                }}>
                    {RenderPage(page, account, onLogout)}
                </div>
            </div>
        </>
    );
}