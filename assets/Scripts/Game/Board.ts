import { RandomWithSeedGenerator } from "../Utills/Random";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { BoardInfo } from "./BoardInfo";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

export default class Board {

    private boardInfo: BoardInfo | null = null;

    private _generator: () => number;
    private checkedTiles: string[] = [];
    private needCheckTiles: cc.Vec2[] = [];

    public get Tiles(): TileInfo[][] {
        return this.boardInfo!.Tiles;
    }
    public get BoardInfo(): TileInfo[][] {
        return this.boardInfo!.Tiles;
    }

    private actionQueue: BoardAction[] = [];

    constructor(BoardInfo: BoardInfo) {
        this.boardInfo = BoardInfo;
        this._generator = RandomWithSeedGenerator(BoardInfo.Seed);
        this.GenereratorPrepare();
        this.FillBoard();
    }

    private GenereratorPrepare() {
        for (let i = 0; i < this.boardInfo!.GeneratorStepCount; i++) {
            this._generator();
        }
    }

    private FillBoard(): void {
        if (!this.boardInfo) return;
        for (let i = this.boardInfo.Grid!.Rows - 1; i >= 0; i--) {
            for (let j = 0; j < this.boardInfo.Grid!.Columns; j++) {
                if (!this.boardInfo.Grid?.Grid[i][j]) continue;
                if (this.boardInfo.Tiles[i][j]) continue;
                const tileInfo = new TileInfo(this.GetRandomTileColor(), ETileType.Tile);
                this.boardInfo.Tiles[i][j] = tileInfo;
                this.actionQueue.push({ TileInfo: tileInfo, Type: EBoardActionType.AddTile, Position: new cc.Vec2(j, i), OldPosition: new cc.Vec2(j, 0) });
            }
        }
    }

    private GetRandomTileColor(): number {
        return Math.floor(this._generator() * 5) + 1;
    }


    public OnTileClick(index: cc.Vec2): BoardAction[] {

        this.actionQueue = [];
        this.needCheckTiles = [index];
        this.checkedTiles = [];
        this.actionQueue.push({ TileInfo: this.boardInfo!.Tiles[index.y][index.x], Type: EBoardActionType.TileMatch, Position: index });
        this.CheckTiles();
        if (this.actionQueue.length == 1 && this.boardInfo!.Tiles[index.y][index.x].Type == ETileType.Tile) {
            this.actionQueue = [];
        }
        else {
            for (const action of this.actionQueue) {
                if (action.Type == EBoardActionType.TileMatch) {
                    this.boardInfo!.Tiles[action.Position.y][action.Position.x] = null;
                }
            }
            this.ApplyGravity();
            this.FillBoard();
        }
        return this.actionQueue;
    }

    private ApplyGravity() {
        if (!this.boardInfo) return;
        for (let i = this.boardInfo.Grid!.Rows - 1; i >= 0; i--) {
            for (let j = 0; j < this.boardInfo.Grid!.Columns; j++) {
                if (!this.boardInfo.Grid?.Grid[i][j]) continue;
                if (this.boardInfo.Tiles[i][j]) continue;
                for(let k = i; k >= 0; k --){
                    if (this.boardInfo.Tiles[k][j]){
                        this.boardInfo.Tiles[i][j] = this.boardInfo.Tiles[k][j];
                        this.boardInfo.Tiles[k][j] = null;
                        this.actionQueue.push({ TileInfo: this.boardInfo.Tiles[i][j], Type: EBoardActionType.MoveTile, Position: new cc.Vec2(j, i),OldPosition:new cc.Vec2(j, k) });
                        break;
                    }
                }
            }
        }
    }

    private CheckTiles(): void {
        if (this.needCheckTiles.length === 0) return;
        const index = this.needCheckTiles.shift();
        if (!index) return;
        this.checkedTiles.push(this.GetPosString(index));
        var tileInfo = this.GetTileInfo(index);
        if (!tileInfo) return;
        var tilesAround = this.GetAdjacentTiles(index);
        for (const tile of tilesAround) {
            var tileInfoAround = this.GetTileInfo(tile);
            if (!tileInfoAround) continue;
            if (!this.checkedTiles.includes(this.GetPosString(tile)) && tileInfoAround.Type == tileInfo.Type && tileInfoAround.Color == tileInfo.Color) {
                this.needCheckTiles.push(tile);
                this.actionQueue.push({ TileInfo: this.boardInfo!.Tiles[tile.y][tile.x], Type: EBoardActionType.TileMatch, Position: tile });

            }
        }
        this.CheckTiles();
    }

    private GetTileInfo(index: cc.Vec2): TileInfo | null {
        if (!this.boardInfo) return null;
        if (index.y < 0 || index.y >= this.boardInfo.Tiles.length) return null;
        if (index.x < 0 || index.x >= this.boardInfo.Tiles[index.y].length) return null;
        return this.boardInfo.Tiles[index.y][index.x];
    }

    private GetAdjacentTiles(index: cc.Vec2): cc.Vec2[] {
        const adjacentTiles: cc.Vec2[] = [];
        var directions = [new cc.Vec2(0, 1), new cc.Vec2(1, 0), new cc.Vec2(0, -1), new cc.Vec2(-1, 0)];
        for (const adjacentIndex of directions) {
            adjacentTiles.push(adjacentIndex.add(index));
        }
        return adjacentTiles;
    }

    private GetPosString(index: cc.Vec2): string {
        return `${index.x},${index.y}`;
    }
}

