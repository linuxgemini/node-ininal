import request from "request-promise-native"
import IninalAPIError from "./IninalAPIError"

interface ConfigAuthObject {
    authType: "basic" | "bearer";
    bearerToken?: string;
    api_key?: string;
    secret_key?: string;
}

interface RequestConfigObject {
    method: string;
    baseUrl: string;
    uri: string;
    headers: object;
    json: boolean;
    auth?: object;
    body?: any;
}

class ConnectionHandler {
    private ENDPOINT: string;

    constructor(endpoint: string) {
        this.ENDPOINT = endpoint;
    }

    private _createConfig(method: "GET" | "POST" | "PUT", path: string, { authType, bearerToken, api_key, secret_key }: ConfigAuthObject, postputObj?: object) {
        let base: RequestConfigObject = {
            method: method,
            baseUrl: this.ENDPOINT,
            uri: path,
            headers: {
                "User-Agent": `node-ininal Application, Node.js/${process.version}`,
                "Language": "TR",
                "Date": new Date().toUTCString(),
                "Content-Type": "application/json"
            },
            json: true
        };

        switch (authType.toLowerCase()) {
            case "bearer":
                base.auth = {
                    bearer: bearerToken
                };
                break;
            case "basic":
                base.auth = {
                    user: api_key,
                    pass: secret_key
                };
                break;
            default:
                break;
        }

        if (postputObj && method.toLowerCase() !== "GET") {
            base.body = postputObj;
        }

        return base;
    }

    public sendRequest(method: "GET" | "POST" | "PUT", path: string, { authType, bearerToken, api_key, secret_key }: ConfigAuthObject, postputObj?: object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let requestConfig = this._createConfig(method, path, { authType, bearerToken, api_key, secret_key }, postputObj);
            try {
                let req = await request(requestConfig); // tslint:disable-line
                if (req.response) return resolve(req.response);
                return resolve("");
            } catch (error) {
                if (error.response && error.response.body && error.response.body.response) return reject(new IninalAPIError(error.response.body.response.errorCode, error.response.body.response.errorDescription));
                return reject(error);
            }
        });
    }
}

export default ConnectionHandler;
