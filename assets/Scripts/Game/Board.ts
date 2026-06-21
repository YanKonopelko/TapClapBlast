import { RandomWithSeedGenerator } from "../Utills/Random";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { BoardInfo } from "./BoardInfo";
import { EBoosterType } from "./EBoosterType";
import { EGameResultType } from "./EGameResultType";
import { ETileColor } from "./ETileColor";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

const SUPER_TILE_MATCH_THRESHOLD = 3;
const BOMB_RADIUS = 1;

export default class Board {

    private boardInfo: BoardInfo | null = null;

    private _generator: () => number;
    private checkedTiles: string[] = [];
    private needCheckTiles: cc.Vec2[] = [];

    public get Tiles(): TileInfo[][] {
        return this.boardInfo!.Tiles;
    }
    public get BoardInfo(): BoardInfo | null {
        return this.boardInfo;
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
        const tileInfo = this.GetTileInfo(index);
        if (!tileInfo) return this.actionQueue;

        if (tileInfo.Type !== ETileType.Tile) {
            this.ProcessSuperTile(index, tileInfo.Type);
            return this.actionQueue;
        }

        this.needCheckTiles = [index];
        this.checkedTiles = [];
        this.actionQueue.push({ TileInfo: tileInfo, Type: EBoardActionType.TileMatch, Position: index });
        this.CheckTiles();
        if (this.actionQueue.length == 1) {
            this.actionQueue = [];
        }
        else {
            let matchCount = 0;
            for (const action of this.actionQueue) {
                if (action.Type == EBoardActionType.TileMatch) {
                    this.boardInfo!.Tiles[action.Position.y][action.Position.x] = null;
                    this.boardInfo!.CurrentScore += 10;
                    matchCount++;
                }
            }
            if (matchCount > SUPER_TILE_MATCH_THRESHOLD) {
                let tileInfo = new TileInfo(ETileColor.Red, ETileType.Tile);
                switch (matchCount) {
                    case 4: {
                        tileInfo = new TileInfo(ETileColor.None, this._generator() > 0.5 ? ETileType.Fireworks_Horizontal : ETileType.Fireworks_Vertical);
                        break;
                    }
                    case 5:
                    case 6: {
                        tileInfo = new TileInfo(ETileColor.None, ETileType.Bomb);
                        break
                    }
                    default: {
                        tileInfo = new TileInfo(ETileColor.None, ETileType.BIG_BOMB);
                        break;
                    }
                }

                this.boardInfo!.Tiles[index.y][index.x] = tileInfo;
                this.actionQueue.push({ TileInfo: tileInfo, Type: EBoardActionType.AddTile, Position: index })

            }


            this.ApplyGravity();
            this.FillBoard();
            this.boardInfo!.Turns++;
        }
        return this.actionQueue;
    }

    private ApplyGravity() {
        if (!this.boardInfo) return;
        for (let i = this.boardInfo.Grid!.Rows - 1; i >= 0; i--) {
            for (let j = 0; j < this.boardInfo.Grid!.Columns; j++) {
                if (!this.boardInfo.Grid?.Grid[i][j]) continue;
                if (this.boardInfo.Tiles[i][j]) continue;
                for (let k = i; k >= 0; k--) {
                    if (this.boardInfo.Tiles[k][j]) {
                        this.boardInfo.Tiles[i][j] = this.boardInfo.Tiles[k][j];
                        this.boardInfo.Tiles[k][j] = null;
                        this.actionQueue.push({ TileInfo: this.boardInfo.Tiles[i][j], Type: EBoardActionType.MoveTile, Position: new cc.Vec2(j, i), OldPosition: new cc.Vec2(j, k) });
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

    public CheckFinish(): EGameResultType {
        if (!this.boardInfo) return EGameResultType.None;
        if (this.boardInfo.CurrentScore >= this.boardInfo.TargetScore) return EGameResultType.Win;
        if (this.boardInfo.Turns >= this.boardInfo.MaxTurns) return EGameResultType.Lose;
        return EGameResultType.None;
    }

    private ProcessSuperTile(index: cc.Vec2, tileType: ETileType): void {
        let affectedTiles: cc.Vec2[] = [];

        switch (tileType) {
            case ETileType.Fireworks_Horizontal:
                affectedTiles = this.GetRowTiles(index.y);
                break;
            case ETileType.Fireworks_Vertical:
                affectedTiles = this.GetColumnTiles(index.x);
                break;
            case ETileType.Bomb:
                affectedTiles = this.GetRadiusTiles(index, BOMB_RADIUS);
                break;
            case ETileType.BIG_BOMB:
                affectedTiles = this.GetAllBoardTiles();
                break;
            default:
                return;
        }

        this.MatchTiles(affectedTiles);
        this.ApplyGravity();
        this.FillBoard();
        this.boardInfo!.Turns++;
    }

    private MatchTiles(tiles: cc.Vec2[]): void {
        const matchedTiles: string[] = [];

        for (const tile of tiles) {
            const tileInfo = this.GetTileInfo(tile);
            const posKey = this.GetPosString(tile);
            if (!tileInfo || matchedTiles.includes(posKey)) continue;

            matchedTiles.push(posKey);
            this.boardInfo!.Tiles[tile.y][tile.x] = null;
            this.boardInfo!.CurrentScore += 10;
            this.actionQueue.push({ TileInfo: tileInfo, Type: EBoardActionType.TileMatch, Position: tile });
        }
    }

    private GetRowTiles(row: number): cc.Vec2[] {
        const tiles: cc.Vec2[] = [];
        if (!this.boardInfo) return tiles;

        for (let x = 0; x < this.boardInfo.Grid!.Columns; x++) {
            const pos = new cc.Vec2(x, row);
            if (this.IsPlayableCell(pos)) tiles.push(pos);
        }

        return tiles;
    }

    private GetColumnTiles(column: number): cc.Vec2[] {
        const tiles: cc.Vec2[] = [];
        if (!this.boardInfo) return tiles;

        for (let y = 0; y < this.boardInfo.Grid!.Rows; y++) {
            const pos = new cc.Vec2(column, y);
            if (this.IsPlayableCell(pos)) tiles.push(pos);
        }

        return tiles;
    }

    private GetRadiusTiles(center: cc.Vec2, radius: number): cc.Vec2[] {
        const tiles: cc.Vec2[] = [];
        if (!this.boardInfo) return tiles;

        for (let y = center.y - radius; y <= center.y + radius; y++) {
            for (let x = center.x - radius; x <= center.x + radius; x++) {
                const pos = new cc.Vec2(x, y);
                if (this.IsPlayableCell(pos)) tiles.push(pos);
            }
        }

        return tiles;
    }

    private GetAllBoardTiles(): cc.Vec2[] {
        const tiles: cc.Vec2[] = [];
        if (!this.boardInfo) return tiles;

        for (let y = 0; y < this.boardInfo.Grid!.Rows; y++) {
            for (let x = 0; x < this.boardInfo.Grid!.Columns; x++) {
                const pos = new cc.Vec2(x, y);
                if (this.IsPlayableCell(pos)) tiles.push(pos);
            }
        }

        return tiles;
    }

    private IsPlayableCell(index: cc.Vec2): boolean {
        if (!this.boardInfo?.Grid) return false;
        if (index.y < 0 || index.y >= this.boardInfo.Grid.Rows) return false;
        if (index.x < 0 || index.x >= this.boardInfo.Grid.Columns) return false;
        return this.boardInfo.Grid.Grid[index.y][index.x];
    }

    public UseBooster(booster: EBoosterType, pos_1: cc.Vec2, pos_2: cc.Vec2 | null = null): BoardAction[] {
        this.actionQueue = [];

        switch (booster) {
            case EBoosterType.None: {
                break;
            }
            case EBoosterType.Teleport: {
                if (!pos_2) return this.actionQueue;
                const firstTile = this.GetTileInfo(pos_1);
                const secondTile = this.GetTileInfo(pos_2);
                if (!firstTile || !secondTile) break;

                this.boardInfo!.Tiles[pos_1.y][pos_1.x] = secondTile;
                this.boardInfo!.Tiles[pos_2.y][pos_2.x] = firstTile;
                this.actionQueue.push({ TileInfo: firstTile, Type: EBoardActionType.SwapTile, Position: pos_1, OldPosition: pos_2 });
                break;
            }
            case EBoosterType.Bomb: {
                const affectedTiles = this.GetRadiusTiles(pos_1, BOMB_RADIUS);
                this.MatchTiles(affectedTiles);
                this.ApplyGravity();
                this.FillBoard();
                break;
            }
        }

        return this.actionQueue;
    }
}
