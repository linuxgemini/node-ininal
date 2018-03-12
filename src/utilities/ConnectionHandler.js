/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const request = require("request-promise-native");
const ininalAPIError = require("./ininalAPIError");
const Package = require("../../package.json");

/**
 * @typedef {Object} KeyType
 * @property {"basic" | "bearer"} authType
 * @property {string} bearerToken
 * @property {string} api_key
 * @property {string} secret_key
 */

/**
 * @typedef {Object} Endpoint
 * @property {string} endpoint
 */

class ConnectionHandler {
    constructor(/** @type {Endpoint} */{
        endpoint
    }) {
        this.endpoint = endpoint;
    }
  
    /**
     * Creates the request config for the "request" package.
     * @param {"GET" | "POST" | "PUT"} method 
     * @param {string} path 
     * @param {Object} postputObj 
     * @private
     */
    _createConfig(method, path, /** @type {KeyType} */ {
        authType,
        bearerToken,
        api_key,
        secret_key
    }, postputObj) {
        var base = {
            method: method,
            baseUrl: this.endpoint,
            uri: path,
            headers: {
                "User-Agent": `node-ininal Application (${Package.homepage.split("#")[0]}, ${Package.version}) Node.js/${process.version}`,
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
        
        if (postputObj && typeof(postputObj) === "object" && method.toLowerCase() !== "GET") {
            base.body = postputObj;
        }

        return base;
    }

    /**
     * Sends requests to the given path on the endpoint.
     * @param {"GET" | "POST" | "PUT"} method 
     * @param {string} path 
     * @param {Object?} postputObj 
     * @returns {Promise<Object>}
     */
    sendRequest(method, path, /** @type {KeyType} */{
        authType = null,
        bearerToken = null,
        api_key = null,
        secret_key = null,
    }, postputObj = null) {
        return new Promise(async (resolve, reject) => {
            var requestConfig = this._createConfig(method, path, { authType, bearerToken, api_key, secret_key }, postputObj);
            try {
                var req = await request(requestConfig);
                if (req.response) return resolve(req.response);
                return reject("Endpoint returned nothing");
            } catch (error) {
                if (error.response && error.response.body.response) return reject(new ininalAPIError(error.response.body.response.errorCode, error.response.body.response.errorDescription));
                return reject(error);
            }
        });
    }
}

module.exports = ConnectionHandler;