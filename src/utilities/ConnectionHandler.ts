import request from "request-promise-native"
import ininalAPIError from "./ininalAPIError"

interface configAuthObject {
    authType: "basic" | "bearer";
    bearerToken?: string;
    api_key?: string;
    secret_key?: string;
}

interface requestConfigObject {
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

    private _createConfig(method: "GET" | "POST" | "PUT", path: string, { authType, bearerToken, api_key, secret_key }: configAuthObject, postputObj?: object) {
        let base: requestConfigObject = {
            method: method,
            baseUrl: this.ENDPOINT,
            uri: path,
            headers: {
                "User-Agent": `node-ininal Application, Node.js/${process.version}`,
                "Language": "TR",
                "Date": new Date().toUTCString()
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

        if (postputObj && typeof (postputObj) === "object" && method.toLowerCase() !== "GET") {
            base.body = postputObj;
        }

        return base;
    }

    public sendRequest(method: "GET" | "POST" | "PUT", path: string, { authType, bearerToken, api_key, secret_key }: configAuthObject, postputObj?: object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let requestConfig = this._createConfig(method, path, { authType, bearerToken, api_key, secret_key }, postputObj);
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

export default ConnectionHandler;