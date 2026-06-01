import Board from "../Game/Board";
import TileInfo from "../Game/TileInfo";

export default class BoardFabric {

    public static CreateBoardFromConfig(_tiles: TileInfo[][]): Board {
        let board: Board = new Board();
        return board;
    }
    public static CreateRandomBoard(): Board {
        let board: Board = new Board();
        return board;
    }
}
