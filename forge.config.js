const ini = require("ini");
const fs = require("fs");
const path = require("path");
const {utils: {fromBuildIdentifier}} = require('@electron-forge/core');

const config = ini.parse(fs.readFileSync(path.join(__dirname, "config.ini"), "utf-8"));

module.exports = {
    packagerConfig: {
        asar: true,
        root: "build",
        appBundleId: "com.koschel.revenue",
        win32metadata: {
            FileDescription: "Personalisierte Finanz-App"
        },
        executableName: "Revenue",
        name: "Revenue",
        appCopyright: config.build.copyright,
        icon: path.join(__dirname, "public", "assets", "icons", "icon")
    },
    rebuildConfig: {},
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: config.github.username,
                    name: config.github.repo
                },
                prerelease: false,
                authToken: config.github.token,
                setupIcon: path.join(__dirname, "public", "assets", "icons", "icon.ico"),
                iconUrl: path.join(__dirname, "public", "assets", "icons", "icon.ico")
            }
        }
    ],
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        // {
        //     name: '@electron-forge/maker-zip',
        //     platforms: ['darwin'],
        // },
        // {
        //     name: '@electron-forge/maker-deb',
        //     config: {},
        // },
        // {
        //     name: '@electron-forge/maker-rpm',
        //     config: {},
        // },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
    ],
    buildIdentifier: "prod"
};
