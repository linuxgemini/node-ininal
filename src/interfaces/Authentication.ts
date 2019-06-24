import ConnectionHandler from "../utilities/ConnectionHandler"

interface accessObject {
    accessToken: string;
    tokenType: string;
    expiresIn: string;
}

class Authentication extends ConnectionHandler {
    private client: ininal;
    constructor(client: this) {
        if (!client) throw new Error("Non-client call");
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/" : "https://api.ininal.com/v2/"));
        this.client = client;
    }

    authenticate() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.client.isAuthenticated()) return resolve(true);
                let req: accessObject = await this.sendRequest("POST", "/oauth/accesstoken", { authType: "basic", api_key: this.client.APIKEY, secret_key: this.client.SECRETKEY });
                this.client.ACCESSTOKEN = req.accessToken;
                this.client.TOKENEXPIRY = (Date.now() + parseInt(req.expiresIn));
                return resolve(req);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Authentication;