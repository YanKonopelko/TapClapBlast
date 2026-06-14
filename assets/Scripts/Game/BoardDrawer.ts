import Profile from "../Profile";
import BoardFabric from "../Utills/BoardFabric";
import Board from "./Board";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";
import TileView from "./TileView";
import TypeToTilePair from "./TypeToTilePair";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    @property({ type: cc.JsonAsset }) private boardJson: cc.JsonAsset | null = null;
    @property({ type: cc.Node }) private tilesParent: cc.Node | null = null;


    private _tiles: TileView[][] = [];
    private board: Board | null = null;
    start() {

        // if (Profile.Instance.Board) {
        //     this.board = Profile.Instance.Board;
        // } else {
        this.board = BoardFabric.CreateRandomBoardWithSeed(cc.size(8, 8), 200);
        // }

        this.DrawBoard();
    }

    public DrawBoard(): void {
        if (!this.board) return;
        this._tiles = [];
        for (let i = 0; i < this.board.Tiles.length; i++) {
            this._tiles[i] = [];
            for (let j = 0; j < this.board.Tiles[i].length; j++) {
                const tileInfo = this.board.Tiles[i][j];
                const pos = new cc.Vec2(j,i);
                const tileView = this.CreateTile(tileInfo,pos);
                if (!tileView) continue;
                this.tilesParent?.addChild(tileView.node);
                this.PlaceTile(tileView.node, pos);
            }
        }
    }

    private CreateTile(tileInfo: TileInfo,index:cc.Vec2): TileView | null {
        if (tileInfo.Type === 0) return null;
        const prefabs = this.tilePrefabs.find(p => p.Type === tileInfo.Type);
        if (!prefabs) return null;
        const prefab = prefabs.GetPrefabByColor(tileInfo.Color);
        if (!prefab) return null;
        const tileNode = cc.instantiate(prefab);
        let tileView = tileNode.getComponent(TileView);
        tileView?.Init(() => { this.OnTileClick(index); });
        this._tiles[index.y][index.x] = tileView;
        return tileView;

    }
    private async OnTileClick(index: cc.Vec2): Promise<void> {
        if (!this.board) return;
        let actions = this.board.OnTileClick(index);
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.PerformAction(action);
        }
        console.log("Tile clicked at: " + index);
        console.log("Actions: ", actions);
    }

    private async PerformAction(boardAction: BoardAction): Promise<void> {

        let pos = boardAction.Position;
        let oldPos = boardAction.OldPosition;
        switch (boardAction.Type) {
            case EBoardActionType.AddTile:
                const tileView = this.CreateTile(boardAction.TileInfo,pos);
                if (!tileView) return;
                this.tilesParent?.addChild(tileView.node);
                // if (oldPos) {
                //     this.MoveTile(oldPos, pos);
                // }
                // else {
                this.PlaceTile(tileView.node, pos);
                // }
                break;
            case EBoardActionType.TileMatch:
                await this.DestroyTile(pos);

                // switch (boardAction.TileInfo.Type) {
                //     case ETileType.Tile:
                //         break;
                //     case ETileType.Bomb:
                //         break;
                //     case ETileType.BIG_BOMB:
                //         break;
                //     case ETileType.Fireworks_Horizontal:
                //         break;
                //     case ETileType.Fireworks_Vertical:
                //         break;
                // }

                break;
            case EBoardActionType.MoveTile:
                this.MoveTile(oldPos!, pos);
                break;
        }
    }


    private async DestroyTile(pos: cc.Vec2): Promise<void> {
        await this._tiles[pos.y][pos.x].Destroy();
    }

    private PlaceTile(tileView: cc.Node, pos: cc.Vec2): void {
        tileView.setPosition(pos.x * 100, -pos.y * 100);
    }

    private async MoveTile(from: cc.Vec2, to: cc.Vec2): Promise<void> {
        if (from) {

        }
        else {

        }
    }
}