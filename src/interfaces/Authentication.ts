import Ininal from ".."
import ConnectionHandler from "../utilities/ConnectionHandler"

interface AccessObject {
    accessToken: string;
    tokenType: string;
    expiresIn: string;
}

class Authentication extends ConnectionHandler {
    private client: Ininal;
    constructor(client: Ininal) {
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/" : "https://api.ininal.com/v2/"));
        this.client = client;
    }

    authenticate(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.client.isAuthenticated()) return resolve(true);
                let req: AccessObject = await this.sendRequest("POST", "/oauth/accesstoken", { authType: "basic", api_key: this.client.APIKEY, secret_key: this.client.SECRETKEY });
                this.client.ACCESSTOKEN = req.accessToken;
                this.client.TOKENEXPIRY = (Date.now() + parseInt(req.expiresIn, undefined));
                return resolve(req);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Authentication;