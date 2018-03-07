/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const request = require("request-promise-native");
const ininalAPIError = require("./ininalAPIError");
const Package = require("../../package.json");

class ConnectionHandler {
    constructor({
        endpoint
    }) {
        this.endpoint = endpoint;
    }

    createConfig(method, path, {
        authType = null,
        bearerToken = null,
        api_key = null,
        secret_key = null,
    }, ...data) {
        var base = {
            method: method,
            baseUrl: this.endpoint,
            uri: path,
            headers: {
                "User-Agent": `node-ininal Client (${Package.homepage.split("#")[0]}, ${Package.version}) Node.js/${process.version}`,
                "Content-Type": "application/json",
                "Language": "TR",
                "Date": new Date().toUTCString()
            },
            auth: {},
            json: true
        };

        switch (authType.toLowerCase()) {
            case "bearer":
                base.auth.bearer = bearerToken;
                break;
            case "basic":
                base.auth.user = api_key;
                base.auth.pass = secret_key;
                break;
            default:
                break;
        }
        
        if (data && typeof(data[0]) === "object" && method.toLowerCase() !== "GET") {
            base.body = data[0];
        }

        return base;
    }

    sendRequest(method, path, {
        authType = null,
        bearerToken = null,
        api_key = null,
        secret_key = null,
    }, ...args) {
        return new Promise(async (resolve, reject) => {
            var requestConfig = this.createConfig(method, path, { authType, bearerToken, api_key, secret_key }, ...args);
            try {
                var req = await request(requestConfig);
                if (req.response) return resolve(req.response);
                return reject("Endpoint returned nothing");
            } catch (error) {
                var remoteErr = error.response.body;
                if (remoteErr.response) return reject(new ininalAPIError(remoteErr.response.errorCode, remoteErr.response.errorDescription, remoteErr.response.errorDescription));
                return reject(error);
            }
        });
    }
}

module.exports = ConnectionHandler;