import ininal from ".."
import ConnectionHandler from "../utilities/ConnectionHandler";

class Transactions extends ConnectionHandler {
    private client: ininal;
    constructor(client: ininal) {
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/transactions/" : "https://api.ininal.com/v2/transactions/"));
        this.client = client;
    }

    private _reqconfig(): Promise<{ authType: "bearer", bearerToken: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.client.isAuthenticated()) await this.client.authentication.authenticate();
                return resolve({
                    authType: "bearer",
                    bearerToken: this.client.ACCESSTOKEN
                });
            } catch (error) {
                return reject(error);
            }
        });
    }
}

export default Transactions;