import Authentication from "./interfaces/Authentication"
import Cards from "./interfaces/Cards"
import Transactions from "./interfaces/Transactions"
import Users from "./interfaces/Users"

/**
 * Initial class of the ininal API.
 */
class Ininal {
    public APIKEY: string;
    public SECRETKEY: string;
    public SANDBOX: boolean;

    public TOKENEXPIRY!: number;
    public ACCESSTOKEN!: string;

    public authentication: Authentication;
    public cards: Cards;
    public transactions: Transactions;
    public users: Users;

    /**
     * ininal API constructor.
     * @param apiKey API Key provided by ininal.
     * @param secretKey Secret Key provided by ininal.
     * @param sandbox Use the sandbox, if enabled.
     */
    constructor(apiKey: string, secretKey: string, sandbox = false) {
        if (!apiKey) throw new Error("API key is not provided.");
        if (!secretKey) throw new Error("Secret key is not provided.");

        this.APIKEY = apiKey;
        this.SECRETKEY = secretKey;
        this.SANDBOX = sandbox;

        this.authentication = new Authentication(this);
        this.cards = new Cards(this);
        this.transactions = new Transactions(this);
        this.users = new Users(this);

    }

    public isAuthenticated(): boolean {
        if (!this.TOKENEXPIRY) return false;
        return (Date.now() < this.TOKENEXPIRY);
    }
}

export default Ininal;

export const Client = Ininal;