import Board from "./Board";
import TileInfo from "./TileInfo";
import TypeToTilePair from "./TypeToTilePair";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    

    public DrawBoard(board: Board): void {

    }

}
