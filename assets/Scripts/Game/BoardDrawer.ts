import BoardFabric from "../Utills/BoardFabric";
import Board from "./Board";
import TypeToTilePair from "./TypeToTilePair";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    @property({ type: cc.JsonAsset }) private boardJson: cc.JsonAsset|null = null;

    private board: Board | null = null;
    start() {

        this.board = BoardFabric.CreateRandomBoard(cc.size(8, 8));
        this.DrawBoard();
    }

    public DrawBoard(): void {

    }
}