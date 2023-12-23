import React, {useState} from 'react';
import Login from "./page/Login";
import Home from "./page/Home";
import {Account} from "../src-app/preload/preload";
import {revenue} from "./revenue";

function App() {
    return (
        <PageHandler/>
    );
}

function PageHandler() {
    const [account, setAccount] = useState<Account | null>(null);
    const onSuccess = (account: Account) => {
        setAccount(account);
    }

    return (
        <>
            {account ? <Home account={account} onLogout={() => {
                revenue.logout();
                setAccount(null);
            }}/> : <Login onSuccess={onSuccess}/>}
        </>
    )
}

export default App;
