import Profile from "../Profile";
import BoardFabric from "../Utills/BoardFabric";
import { CustomAction } from "../Utills/CustomActions";
import Board from "./Board";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { EGameResultType } from "./EGameResultType";
import TileInfo from "./TileInfo";
import TileView from "./TileView";
import TypeToTilePair from "./TypeToTilePair";

const { ccclass, property } = cc._decorator;
const TILE_SIZE = 100;
const TILE_MOVE_DURATION = 0.2;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    @property({ type: cc.JsonAsset }) private boardJson: cc.JsonAsset | null = null;
    @property({ type: cc.Node }) private tilesParent: cc.Node | null = null;


    
    private _tiles: (TileView | null)[][] = [];
    private board: Board | null = null;

    private interactable: boolean = true;
    private onBoardUpdate: CustomAction = new CustomAction();

    public get AttachedBoard(): Board | null {
        return this.board;
    }
    public get OnBoardUpdate(): CustomAction {
        return this.onBoardUpdate;
    }

    public Init(Board:Board){
        this.board = Board;
        this.DrawBoard();
    }

    public DrawBoard(): void {
        if (!this.board) return;
        this._tiles = [];
        for (let i = 0; i < this.board.Tiles.length; i++) {
            this._tiles[i] = [];
            for (let j = 0; j < this.board.Tiles[i].length; j++) {
                const tileInfo = this.board.Tiles[i][j];
                const pos = new cc.Vec2(j, i);
                const tileView = this.CreateTile(tileInfo, pos);
                if (!tileView) continue;
                this.tilesParent?.addChild(tileView.node);
                this.PlaceTile(tileView.node, pos);
            }
        }
    }

    private CreateTile(tileInfo: TileInfo, index: cc.Vec2): TileView | null {
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
        if (!this.interactable) return;
        let actions = this.board.OnTileClick(index);
        this.interactable = false;
        if (actions.length > 0) {

            let lastAction: BoardAction = actions[0];
            let lastPack: BoardAction[] = [];
            let actionPacks = [lastPack];
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                if (action.Type == lastAction.Type) {
                    lastPack.push(action);
                }
                else {
                    lastPack = [action];
                    lastAction = action;
                    actionPacks.push(lastPack);
                }
            }

            for (let i = 0; i < actionPacks.length; i++) {
                const pack = actionPacks[i];
                await Promise.all(pack.map(action => this.PerformAction(action)));
            }
        }
        this.interactable = true;
        this.onBoardUpdate.Invoke();
    }


    private async PerformAction(boardAction: BoardAction): Promise<void> {

        let pos = boardAction.Position;
        let oldPos = boardAction.OldPosition;
        switch (boardAction.Type) {
            case EBoardActionType.AddTile:
                const tileView = this.CreateTile(boardAction.TileInfo, pos);
                if (!tileView) return;
                this.tilesParent?.addChild(tileView.node);
                if (oldPos) {
                    this._tiles[oldPos.y][oldPos.x] = tileView
                    await this.MoveTile(oldPos, pos);
                }
                else {
                    this.PlaceTile(tileView.node, pos);
                }
                break;
            case EBoardActionType.TileMatch:
                await this.DestroyTile(pos);
                break;
            case EBoardActionType.MoveTile:
                await this.MoveTile(oldPos!, pos);
                break;
        }
    }


    private async DestroyTile(pos: cc.Vec2): Promise<void> {
        const tileView = this._tiles[pos.y]?.[pos.x];
        if (!tileView) return;
        this._tiles[pos.y][pos.x] = null;
        await tileView.Destroy();
    }

    private PlaceTile(tileView: cc.Node, pos: cc.Vec2): void {
        tileView.setPosition(this.GetTilePosition(pos));
    }

    private async MoveTile(from: cc.Vec2, to: cc.Vec2): Promise<void> {
        const tileView = this._tiles[from.y]?.[from.x];
        if (!tileView) return;

        this._tiles[from.y][from.x] = null;
        this._tiles[to.y][to.x] = tileView;
        tileView.Init(() => { this.OnTileClick(to); });
        tileView.node.position = new cc.Vec3(this.GetTilePosition(from).x, this.GetTilePosition(from).y, 0);
        const targetPosition = this.GetTilePosition(to);
        await new Promise<void>((resolve) => {
            cc.tween(tileView.node)
                .to(TILE_MOVE_DURATION, { x: targetPosition.x, y: targetPosition.y }, { easing: "quadIn" })
                .call(resolve)
                .start();
        });
    }

    private GetTilePosition(pos: cc.Vec2): cc.Vec2 {
        return new cc.Vec2(pos.x * TILE_SIZE, -pos.y * TILE_SIZE);
    }
   
    public SetInteractable(value:boolean){
        this.interactable = value;
    }
}
