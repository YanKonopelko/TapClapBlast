import Board from "../Game/Board";
import { BoardInfo } from "../Game/BoardInfo";
import { TileInfo } from "../Game/TileInfo";

export default class BoardFabric {

    public static CreateBoardFromConfig(BoardInfo: BoardInfo): Board {
        let board: Board = new Board(this.NormalizeBoardInfo(BoardInfo));
        return board;
    }

    private static NormalizeBoardInfo(boardInfo: BoardInfo): BoardInfo {
        const serializedGrid = boardInfo.Grid as any;
        boardInfo.Grid = Array.isArray(serializedGrid) ? serializedGrid : serializedGrid?._grid ?? [];
        return boardInfo;
    }

    public static CreateRandomBoard(size: cc.Size): Board {
        var grid: boolean[][] = [];
        var tiles: (TileInfo | null)[][] = [];
        for (let i = 0; i < size.height; i++) {
            grid[i] = [];
            for (let j = 0; j < size.width; j++) {
                grid[i][j] = true;
            }
            tiles[i] = [];
        }
        let seed = Math.random()*100;
        let board: Board = new Board(
            {
                Seed: seed,
                Grid: grid,
                Tiles: tiles,
                GeneratorStepCount: 0,
                TargetScore: 500,
                CurrentScore: 0,
                MaxTurns: 10,
                Turns: 0
            });
        return board;
    }
    public static CreateRandomBoardWithSeed(size: cc.Size, seed: number): Board {
        var grid: boolean[][] = [];
        var tiles: (TileInfo | null)[][] = [];
        for (let i = 0; i < size.height; i++) {
            grid[i] = [];
            for (let j = 0; j < size.width; j++) {
                grid[i][j] = true;
            }
            tiles[i] = [];
        }
        let board: Board = new Board({ Seed: seed, 
            Grid: grid, 
            Tiles: tiles, 
            GeneratorStepCount: 0, 
            TargetScore: 500, 
            CurrentScore: 0, 
            MaxTurns: 10, 
            Turns: 0 });
        return board;
    }
}
