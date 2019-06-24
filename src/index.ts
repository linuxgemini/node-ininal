import Authentication from "./interfaces/Authentication"
import Cards from "./interfaces/Cards"
import Transactions from "./interfaces/Transactions"
import Users from "./interfaces/Users"

/**
 * Initial class of the ininal API.
 */
class ininal {
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
     * @param api_key API Key provided by ininal.
     * @param secret_key Secret Key provided by ininal.
     * @param sandbox Use the sandbox, if enabled.
     */
    constructor(api_key: string, secret_key: string, sandbox = false) {
        if (!api_key) throw new Error("API key is not provided.");
        if (!secret_key) throw new Error("Secret key is not provided.");

        this.APIKEY = api_key;
        this.SECRETKEY = secret_key;
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

export default ininal;

export const Client = ininal;