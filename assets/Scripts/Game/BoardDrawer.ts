import { CustomAction, CustomActionWithParam } from "../Utills/CustomActions";
import { TimeUtils } from "../Utills/TimeUtils";
import Board from "./Board";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { EBoosterType } from "./EBoosterType";
import { TileInfo } from "./TileInfo";
import TileView from "./TileView";
import TypeToTilePair from "./TypeToTilePair";

const { ccclass, property } = cc._decorator;
const TILE_SIZE = 100;
const TILE_MOVE_DURATION = 0.2;
const TILE_FALL_LAYER_DELAY = 0.12;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    @property({ type: cc.JsonAsset }) private boardJson: cc.JsonAsset | null = null;
    @property({ type: cc.Node }) private tilesParent: cc.Node | null = null;


    
    private _tiles: (TileView | null)[][] = [];
    private board: Board | null = null;

    private interactable: boolean = true;
    private onBoardUpdate: CustomAction = new CustomAction();
    private onBoosterUse: CustomActionWithParam<EBoosterType> = new CustomActionWithParam<EBoosterType>();
    private activeBooster:EBoosterType = EBoosterType.None;
    private selectedBoosterTile: cc.Vec2 | null = null;
    public get AttachedBoard(): Board | null {
        return this.board;
    }
    public get OnBoardUpdate(): CustomAction {
        return this.onBoardUpdate;
    }
    public get OnBoosterUse(): CustomActionWithParam<EBoosterType> {
        return this.onBoosterUse;
    }

    public Init(Board:Board){
        this.board = Board;
        this.DrawBoard();
    }

    public DrawBoard(): void {
        if (!this.board) return;
        this._tiles = [];
        this.tilesParent?.destroyAllChildren();
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

    private CreateTile(tileInfo: TileInfo | null, index: cc.Vec2): TileView | null {
        if (!tileInfo) return null;
        if (tileInfo.type === 0) return null;
        const prefabs = this.tilePrefabs.find(p => p.Type === tileInfo.type);
        if (!prefabs) return null;
        const prefab = prefabs.GetPrefabByColor(tileInfo.color);
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

        if(this.activeBooster){
            await this.OnBoosterTileClick(index);
            return;
        }

        let actions = this.board.OnTileClick(index);
        this.interactable = false;
        if (actions.length > 0) {
            await this.PerformActions(actions);
        }
        this.interactable = true;
        this.onBoardUpdate.Invoke();
    }

    private async OnBoosterTileClick(index: cc.Vec2): Promise<void> {
        if (!this.board) return;

        if (this.activeBooster === EBoosterType.Teleport && !this.selectedBoosterTile) {
            this.selectedBoosterTile = new cc.Vec2(index.x, index.y);
            return;
        }

        if (this.activeBooster === EBoosterType.Teleport && this.selectedBoosterTile && this.selectedBoosterTile.x === index.x && this.selectedBoosterTile.y === index.y) {
            this.selectedBoosterTile = null;
            return;
        }

        const usedBooster = this.activeBooster;
        const firstTile = this.selectedBoosterTile ?? index;
        const actions = this.board.UseBooster(usedBooster, firstTile, usedBooster === EBoosterType.Teleport ? index : null);
        this.selectedBoosterTile = null;
        this.activeBooster = EBoosterType.None;

        this.interactable = false;
        if (actions.length > 0) {
            await this.PerformActions(actions);
            this.onBoosterUse.Invoke(usedBooster);
        }
        this.interactable = true;
        this.onBoardUpdate.Invoke();
    }

    private async PerformActions(actions: BoardAction[]): Promise<void> {
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
            const fallingActions = pack.filter(action => this.IsFallingAction(action));
            const instantActions = pack.filter(action => !this.IsFallingAction(action));

            if (fallingActions.length > 0) {
                await Promise.all(instantActions.map(action => this.PerformAction(action)));
                await this.PerformFallingActions(fallingActions);
            }
            else {
                await Promise.all(instantActions.map(action => this.PerformAction(action)));
            }
        }
    }

    private async PerformFallingActions(actions: BoardAction[]): Promise<void> {
        const layers = this.GetFallingActionLayers(actions);
        await Promise.all(layers.map((layer, index) => this.PerformActionLayerWithDelay(layer, index * TILE_FALL_LAYER_DELAY)));
    }

    private async PerformActionLayerWithDelay(actions: BoardAction[], delay: number): Promise<void> {
        await TimeUtils.TimeoutSeconds(delay);
        await Promise.all(actions.map(action => this.PerformAction(action)));
    }

    private GetFallingActionLayers(actions: BoardAction[]): BoardAction[][] {
        const sortedActions = actions.slice().sort((a, b) => b.Position.y - a.Position.y);
        const layers: BoardAction[][] = [];

        for (const action of sortedActions) {
            const lastLayer = layers[layers.length - 1];
            if (!lastLayer || lastLayer[0].Position.y !== action.Position.y) {
                layers.push([action]);
            }
            else {
                lastLayer.push(action);
            }
        }

        return layers;
    }

    private IsFallingAction(action: BoardAction): boolean {
        return (action.Type === EBoardActionType.AddTile && !!action.OldPosition);
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
            case EBoardActionType.SwapTile:
                await this.SwapTiles(pos, oldPos!);
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

    private async SwapTiles(firstPos: cc.Vec2, secondPos: cc.Vec2): Promise<void> {
        const firstTile = this._tiles[firstPos.y]?.[firstPos.x];
        const secondTile = this._tiles[secondPos.y]?.[secondPos.x];
        if (!firstTile || !secondTile) return;

        const firstTarget = this.GetTilePosition(secondPos);
        const secondTarget = this.GetTilePosition(firstPos);

        await Promise.all([
            this.TweenTileTo(firstTile.node, firstTarget),
            this.TweenTileTo(secondTile.node, secondTarget),
        ]);

        this._tiles[firstPos.y][firstPos.x] = secondTile;
        this._tiles[secondPos.y][secondPos.x] = firstTile;
        firstTile.Init(() => { this.OnTileClick(secondPos); });
        secondTile.Init(() => { this.OnTileClick(firstPos); });
    }

    private async TweenTileTo(tileNode: cc.Node, targetPosition: cc.Vec2): Promise<void> {
        await new Promise<void>((resolve) => {
            cc.tween(tileNode)
                .to(TILE_MOVE_DURATION, { x: targetPosition.x, y: targetPosition.y }, { easing: "quadIn" })
                .call(resolve)
                .start();
        });
    }

    private GetTilePosition(pos: cc.Vec2): cc.Vec2 {
        return new cc.Vec2(pos.x * TILE_SIZE, -pos.y * TILE_SIZE);
    }
   
    public SetInteractable(value:boolean):void{
        this.interactable = value;
    }

    public UseBooster(booster:EBoosterType):void{
        this.activeBooster = booster;
        this.selectedBoosterTile = null;
    }
}
