import Board from "../Game/Board";
import Grid from "../Game/Grid";
import TileInfo from "../Game/TileInfo";

export default class BoardFabric {

    public static CreateBoardFromConfig(grid: boolean[][],_tiles: TileInfo[][],seed: number, generatorStepCount: number = 0): Board {
        let board: Board = new Board(seed, new Grid(grid), _tiles, generatorStepCount);
        return board;
    }
    public static CreateRandomBoard(size:cc.Size): Board {
        var greed: boolean[][] = [];
        for (let i = 0; i < size.height; i++) {
            greed[i] = [];
            for (let j = 0; j < size.width; j++) {
                greed[i][j] = true;
            }
        }
        let board: Board = new Board(Math.random(), new Grid(greed), []);
        return board;
    }
}
