import {Account} from "../../src-app/preload/preload";
import React from "react";
import CreateAccountForm from "../components/CreateAccountForm";
import LoginForm from "../components/LoginForm";

export interface LoginMetadata {
    onSuccess(account: Account): void
}

export default function Login({
                                  onSuccess
                              }: LoginMetadata) {

    document.body.setAttribute("data-bs-theme", "dark");
    document.body.setAttribute("style", "");

    return (
        <div className="page justify-content-center align-items-center" data-bs-theme="dark">
            <div className="bg-dark p-4 shadow rounded-2 text-center">
                <h1 className="text-primary mb-5">Revenue</h1>
                <div className="d-flex">
                    <CreateAccountForm onSubmit={onSuccess}/>
                    <div className="border-left mx-5"></div>
                    <LoginForm onSubmit={onSuccess}/>
                </div>
            </div>
        </div>
    );
}