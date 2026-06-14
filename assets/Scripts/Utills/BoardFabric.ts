import Board from "../Game/Board";
import { BoardInfo } from "../Game/BoardInfo";
import Grid from "../Game/Grid";
import TileInfo from "../Game/TileInfo";

export default class BoardFabric {

    public static CreateBoardFromConfig(BoardInfo: BoardInfo): Board {
        let board: Board = new Board(BoardInfo);
        return board;
    }
    public static CreateRandomBoard(size:cc.Size): Board {
        var greed: boolean[][] = [];
        var tiles: TileInfo[][] = [];
        for (let i = 0; i < size.height; i++) {
            greed[i] = [];
            for (let j = 0; j < size.width; j++) {
                greed[i][j] = true;
            }
            tiles[i] = [];
        }
        let board: Board = new Board({Seed: Math.random(), Grid: new Grid(greed), Tiles: tiles, GeneratorStepCount: 0});
        return board;
    }
     public static CreateRandomBoardWithSeed(size:cc.Size, seed: number): Board {
        var greed: boolean[][] = [];
        var tiles: TileInfo[][] = [];
        for (let i = 0; i < size.height; i++) {
            greed[i] = [];
            for (let j = 0; j < size.width; j++) {
                greed[i][j] = true;
            }
            tiles[i] = [];
        }
        let board: Board = new Board({Seed: seed, Grid: new Grid(greed), Tiles: tiles, GeneratorStepCount: 0});
        return board;
    }
}
