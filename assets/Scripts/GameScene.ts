// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Board from "./Game/Board";
import BoardDrawer from "./Game/BoardDrawer";
import BoosterView from "./Game/BoosterView";
import { EBoosterType } from "./Game/EBoosterType";
import { EGameResultType } from "./Game/EGameResultType";
import Profile from "./Profile";
import BoardFabric from "./Utills/BoardFabric";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Label)
    turnCountLabel: cc.Label | null = null;

    @property(cc.Label)
    scoreLabel: cc.Label | null = null;

    @property(BoardDrawer)
    boardDrawer: BoardDrawer | null = null;

    @property([BoosterView])
    boosters: BoosterView[] = [];

    private isGameFinished: boolean = false;
    private currentBooster:EBoosterType = EBoosterType.None;

    start() {
        let board:Board = BoardFabric.CreateRandomBoardWithSeed(cc.size(9, 10), 200);
        if (Profile.Instance.Board) {
            board = Profile.Instance.Board;
        } else {
            Profile.Instance.Board = board;
            Profile.Instance.Save();
        }
        for(let i = 0; i < this.boosters.length;i++){
            this.boosters[i].Init(()=>{this.SelectBooster(this.boosters[i])},i+1);
        }
        this.boardDrawer?.Init(board);
        this.boardDrawer?.OnBoardUpdate.Subscribe(this.UpdateVisual, this);
        this.boardDrawer?.OnBoosterUse.Subscribe(this.ResetBooster, this);
        this.UpdateVisual();
    }

    private UpdateVisual() {
        Profile.Instance.Board = this.boardDrawer?.AttachedBoard;
        Profile.Instance.Save();
        this.scoreLabel?.string = `Очки:\n${this.boardDrawer?.AttachedBoard?.CurrentScore}/${this.boardDrawer?.AttachedBoard?.TargetScore}`;
        this.turnCountLabel?.string = `${this.boardDrawer?.AttachedBoard?.MaxTurns-this.boardDrawer?.AttachedBoard?.Turns}`;
        this.CheckFinish();
    }
    private CheckFinish(): void {
        if (!this.boardDrawer?.AttachedBoard) return;
        if (this.isGameFinished) return;
        const result = this.boardDrawer.AttachedBoard.CheckFinish();
        switch (result) {
            case EGameResultType.None: {

                break;
            }
            case EGameResultType.Win: {
                this.Win();
                break;
            }
            case EGameResultType.Lose: {
                this.Lose();
                break;
            }
        }
    }
    private Win(): void {
        this.isGameFinished = true;
        window.alert("Победа!");
        Profile.Instance.Board = null;
        Profile.Instance.Save();
        this.boardDrawer?.SetInteractable(false);
    }
    private Lose(): void {
        this.isGameFinished = true;
        window.alert("Поражение!");
        Profile.Instance.Board = null;
        Profile.Instance.Save();
        this.boardDrawer?.SetInteractable(false);
    }
    public SelectBooster(view:BoosterView){
        if(view.Type == this.currentBooster){
            this.ResetBooster();
        }
        else{
            this.ResetBooster();
            this.currentBooster = view.Type;
            view.Select();
        }
        this.boardDrawer?.UseBooster(this.currentBooster);
    }

    private ResetBooster():void{
        this.currentBooster = EBoosterType.None;
        this.boardDrawer?.UseBooster(this.currentBooster);
        for(let i = 0; i < this.boosters.length; i++){
            this.boosters[i].Deselect();
        }
    }

}
