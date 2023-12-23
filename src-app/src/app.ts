import {app, BrowserWindow, ipcMain} from "electron";
import * as path from "node:path";
import * as fs from "fs";
import {updateElectronApp} from "update-electron-app";

let mainWindow: BrowserWindow | null;

function handleSquirrelEvent(): boolean {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {
        }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent: string = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        icon: path.join(__dirname, "assets", "icons", "icon.png")
    });

    let version: string;
    if (!app.isPackaged) {
        app.setName("revenue");
        version = "2.0.0";
    } else {
        version = app.getVersion();
    }

    const appData: string = path.join(app.getPath("appData"), app.getName() + "-" + version.split(".")[0] + ".0.0");
    if (!fs.existsSync(appData) || !fs.statSync(appData).isDirectory()) {
        fs.mkdirSync(appData);
    }


    mainWindow.setMenu(null);

    const url: URL = new URL(path.join(__dirname, "index.html"));
    url.searchParams.set("appData", appData);
    url.searchParams.set("version", version);

    mainWindow.loadURL(url.toString()).then(() => {
        mainWindow.show();
        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });

    mainWindow.on("close", () => {
        mainWindow = null;
    });
}

if (!handleSquirrelEvent()) {
    if (app.isPackaged) {
        updateElectronApp();
    }

    app.on("ready", () => {
        ipcMain.on("alert", (event, args) => {
            let window: BrowserWindow = new BrowserWindow({
                modal: true,
                width: 500,
                height: 200,
                parent: mainWindow,
                resizable: false,
                show: false,
                icon: path.join(__dirname, "assets", "icons", "icon.png")
            });

            window.setMenu(null);

            window.loadURL(path.join(__dirname, "alert.html?message=" + args.message)).then(() => {
                window.show();
                window.on("closed", () => {
                    mainWindow.webContents.send("alert");
                });
            });
        });
        ipcMain.on("confirm", (event, args) => {
            let window: BrowserWindow = new BrowserWindow({
                modal: true,
                width: 500,
                height: 200,
                parent: mainWindow,
                resizable: false,
                show: false,
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true
                },
                icon: path.join(__dirname, "assets", "icons", "icon.png")
            });

            window.setMenu(null);

            window.loadURL(path.join(__dirname, `confirm.html?message=${args.message}&btn1=${args.btn1}&btn2=${args.btn2}`)).then(() => {
                window.show();
                let sent: boolean = false;
                window.on("closed", () => {
                    if (!sent) {
                        mainWindow.webContents.send("alert", {status: false});
                    }
                });
                window.webContents.ipc.on("confirm-res", (event, args) => {
                    window.close();
                    sent = true;
                    mainWindow.webContents.send("confirm", {status: args});
                });
            });
        });

        createWindow();
    });

    process.on("uncaughtException", () => {
        app.quit();
    });

    app.on("window-all-closed", () => {
        app.quit();
    });

    app.on("activate", () => {
        if (!mainWindow) {
            createWindow();
        }
    });
}
