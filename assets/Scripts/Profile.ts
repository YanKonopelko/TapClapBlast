import Board from "./Game/Board/Board";
import { BoardInfo } from "./Game/Board/BoardInfo";
import { EBoosterType } from "./Game/EBoosterType";
import BoardFabric from "./Utills/BoardFabric";
import { CustomAction } from "./Utills/CustomActions";


export default class Profile {

    private _board:Board|null = null;
    private _boosters: Map<EBoosterType, number> = new Map<EBoosterType, number>();

    private onBoostersCountChange:CustomAction = new CustomAction();

    private static _instance: Profile | null = null;

    public static get Instance(): Profile {
        if (this._instance === null) {
            this._instance = new Profile();
        }
        return this._instance;
    }
    public get OnBoostersCountChange():CustomAction{
        return this.onBoostersCountChange;
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
            if(profile.boosters){
                this._boosters = this.ParseBoosters(profile.boosters);
            }
        }
    }

    public Save(): void {
        window.localStorage.setItem("profile", this.GetString());
    }

    private GetString(): string {
        const jsonObject = new Object() as any;
        jsonObject.board = this._board?.BoardInfo;
        jsonObject.boosters = this.GetBoostersObject();
        return JSON.stringify(jsonObject);
    }

    public GetBoosterCount(type:EBoosterType):number{
        if(this._boosters.has(type)){
            return this._boosters.get(type);
        }
        return 0;
    }

    public SpendBooster(type:EBoosterType):boolean{
        let count = this.GetBoosterCount(type);
        if(count>0){
            count -=1;
            this._boosters.set(type,count);
            this.onBoostersCountChange.Invoke();
            return true;
        }
            return false;
    }
    public AddBooster(type:EBoosterType,count:number){
        if(!this._boosters.has(type)){
            this._boosters.set(type,0);
        }
        let curCount = this.GetBoosterCount(type);
        curCount += count;
        this._boosters.set(type,curCount);
        this.onBoostersCountChange.Invoke();
    }

    private GetBoostersObject(): any {
        const boosters = new Object() as any;
        this._boosters.forEach((count, type) => {
            boosters[type] = count;
        });
        return boosters;
    }

    private ParseBoosters(boostersData: any): Map<EBoosterType, number> {
        const boosters = new Map<EBoosterType, number>();
        if (!boostersData) return boosters;

        for (const key in boostersData) {
            if (!boostersData.hasOwnProperty(key)) continue;
            boosters.set(Number(key) as EBoosterType, Number(boostersData[key]));
        }
        return boosters;
    }
}
