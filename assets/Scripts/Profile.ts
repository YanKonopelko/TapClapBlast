import Board from "./Game/Board";


export default class Profile {

    private _board:Board|null = null;

    private _instance: Profile | null = null;

    public get Instance(): Profile {
        if (this._instance === null) {
            this._instance = new Profile();
        }
        return this._instance;
    }

    
    public Load(): void {

    }

    public Save(): void {

    }

}
