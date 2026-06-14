import Board from "./Game/Board";
import { BoardInfo } from "./Game/BoardInfo";
import BoardFabric from "./Utills/BoardFabric";


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

      public set Board(board: Board | null) {
        this._board = board;
      }

    public Load(): void {
        const profileData = window.localStorage.getItem("profile");
        if (profileData) {
            const profile = JSON.parse(profileData);
            if(profile.board){
                let boardInfo = profile.board as BoardInfo;
                this._board = BoardFabric.CreateBoardFromConfig(boardInfo);
            }
        }
    }

    public Save(): void {
        window.localStorage.setItem("profile", this.GetString());
    }

    private GetString(): string {
        const jsonObject = new Object() as any;
        jsonObject.board = this._board?.BoardInfo;
        return JSON.stringify(jsonObject);
    }

}
