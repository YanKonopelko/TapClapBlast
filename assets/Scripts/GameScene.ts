// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BoardDrawer from "./Game/BoardDrawer";
import { EGameResultType } from "./Game/EGameResultType";
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

    private isGameFinished: boolean = false;
    

    start() {
        // if (Profile.Instance.Board) {
        //     this.board = Profile.Instance.Board;
        // } else {
        // }
        const board = BoardFabric.CreateRandomBoardWithSeed(cc.size(9, 10), 200);
        this.boardDrawer?.Init(board);
        this.boardDrawer?.OnBoardUpdate.Subscribe(this.UpdateVisual, this);
        this.UpdateVisual();
    }

    private UpdateVisual() {
        this.scoreLabel?.string = `Очки:\n${this.boardDrawer?.AttachedBoard?.BoardInfo?.CurrentScore}/${this.boardDrawer?.AttachedBoard?.BoardInfo?.TargetScore}`;
        this.turnCountLabel?.string = `${this.boardDrawer?.AttachedBoard?.BoardInfo?.MaxTurns-this.boardDrawer?.AttachedBoard?.BoardInfo?.Turns}`;
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
        this.boardDrawer?.SetInteractable(false);
    }
    private Lose(): void {
        this.isGameFinished = true;
        window.alert("Поражение!");
        this.boardDrawer?.SetInteractable(false);
    }
}
