import Board from "../Game/Board";
import Grid from "../Game/Grid";
import TileInfo from "../Game/TileInfo";

export default class BoardFabric {

    public static CreateBoardFromConfig(grid: boolean[][],_tiles: TileInfo[][],seed: number, generatorStepCount: number = 0): Board {
        let board: Board = new Board({Seed: seed, Grid: new Grid(grid), Tiles: _tiles, GeneratorStepCount: generatorStepCount});
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
        let board: Board = new Board({Seed: 200, Grid: new Grid(greed), Tiles: tiles, GeneratorStepCount: 0});
        return board;
    }
}
