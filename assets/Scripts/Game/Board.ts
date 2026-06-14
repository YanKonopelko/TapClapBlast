import { RandomWithSeedGenerator } from "../Utills/Random";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { BoardInfo } from "./BoardInfo";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

export default class Board {

    private BoardInfo: BoardInfo | null = null;

    private _generator: () => number;
    private checkedTiles: cc.Vec2[] = [];
    private needCheckTiles: cc.Vec2[] = [];

    public get Tiles(): TileInfo[][] {
        return this.BoardInfo!.Tiles;
    }

    private actionQueue: BoardAction[] = [];

    constructor(BoardInfo: BoardInfo) {
        this.BoardInfo = BoardInfo;
        this._generator = RandomWithSeedGenerator(BoardInfo.Seed);
        this.GenereratorPrepare();
        this.FillBoard();
    }

    private GenereratorPrepare() {
        for (let i = 0; i < this.BoardInfo!.GeneratorStepCount; i++) {
            this._generator();
        }
    }

    private FillBoard(): void {
        if (!this.BoardInfo) return;
        for (let i = 0; i < this.BoardInfo.Grid!.Rows; i++) {
            for (let j = 0; j < this.BoardInfo.Grid!.Columns; j++) {
                if (!this.BoardInfo.Grid?.Grid[i][j]) continue;
                const tileInfo = new TileInfo(this.GetRandomTileColor(), ETileType.Tile);
                this.BoardInfo!.Tiles[i][j] = tileInfo;
                this.actionQueue.push({ TileInfo: tileInfo, Type: EBoardActionType.AddTile, Position: new cc.Vec2(j, i) });
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
        this.CheckTiles();
        if (this.actionQueue.length > 0) {
            this.actionQueue = [{ TileInfo: this.BoardInfo!.Tiles[index.y][index.x], Type: EBoardActionType.TileMatch, Position: index }, ...this.actionQueue];
        }
        return this.actionQueue;
    }

    private CheckTiles(): void {
        if (this.needCheckTiles.length === 0) return;
        const index = this.needCheckTiles.shift();
        if (!index) return;
        this.checkedTiles.push(index);
        var tileInfo = this.GetTileInfo(index);
        if (!tileInfo) return;
        var tilesAround = this.GetAdjacentTiles(index);
        for (const tile of tilesAround) {
            var tileInfoAround = this.GetTileInfo(tile);
            if (!tileInfoAround) continue;
            if (tileInfoAround.Type == tileInfo.Type && tileInfoAround.Color == tileInfo.Color) {
                this.needCheckTiles.push(tile);
                this.actionQueue.push({ TileInfo: tileInfoAround, Type: EBoardActionType.TileMatch, Position: tile });
            }
        }
        this.CheckTiles();
    }

    private GetTileInfo(index: cc.Vec2): TileInfo | null {
        if (!this.BoardInfo) return null;
        if (index.y < 0 || index.y >= this.BoardInfo.Tiles.length) return null;
        if (index.x < 0 || index.x >= this.BoardInfo.Tiles[index.y].length) return null;
        return this.BoardInfo.Tiles[index.y][index.x];
    }

    private GetAdjacentTiles(index: cc.Vec2): cc.Vec2[] {
        const adjacentTiles: cc.Vec2[] = [];
        var directions = [new cc.Vec2(0, 1), new cc.Vec2(1, 0), new cc.Vec2(0, -1), new cc.Vec2(-1, 0)];
        for (const adjacentIndex of directions) {
            adjacentTiles.push(adjacentIndex.add(index));
        }
        return adjacentTiles;
    }
}

