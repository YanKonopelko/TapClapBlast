import Board from "./Game/Board";


export default class Profile {

    private _board:Board|null = null;

    private static _instance: Profile | null = null;

    public static get Instance(): Profile {
        if (this._instance === null) {
            this._instance = new Profile();
        }
        return this._instance;
    }

    public get Board(): Board | null {
        return this._board;
    }

    
    public Load(): void {
        const profileData = window.localStorage.getItem("profile");
        if (profileData) {
            const profile = JSON.parse(profileData);
            this._board = profile._board;
        }
    }

    public Save(): void {
        window.localStorage.setItem("profile", this.GetString());
    }

    private GetString(): string {
        return JSON.stringify(this);
    }

}
