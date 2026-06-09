import { RandomWithSeedGenerator } from "../Utills/Random";
import { BoardAction, EBoardActionType } from "./BoardAction";
import { BoardInfo } from "./BoardInfo";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

export default class Board{

    private BoardInfo: BoardInfo|null = null;
    
    private _generator: () => number;

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

    private GenereratorPrepare(){
        for(let i = 0; i < this.BoardInfo!.GeneratorStepCount; i++) {
            this._generator();
        }
    }

    private FillBoard(): void {
        if(!this.BoardInfo) return;
        for(let i = 0; i < this.BoardInfo.Grid!.Rows; i++) {
            for(let j = 0; j < this.BoardInfo.Grid!.Columns; j++) {
                if(!this.BoardInfo.Grid?.Grid[i][j]) continue;
                const tileInfo = new TileInfo(this.GetRandomTileColor(), ETileType.Tile);
                this.BoardInfo!.Tiles[i][j] = tileInfo;
                this.actionQueue.push({TileInfo: tileInfo, Type: EBoardActionType.AddTile});
            }
        }
    }

    private GetRandomTileColor(): number {
        return Math.floor(this._generator() * 5) + 1;
    }

    private OnTileClick():BoardAction[]{


        return [];
    }




}

