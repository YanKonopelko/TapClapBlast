import BoardFabric from "../Utills/BoardFabric";
import Board from "./Board";
import TileView from "./TileView";
import TypeToTilePair from "./TypeToTilePair";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardDrawer extends cc.Component {

    @property({ type: [TypeToTilePair] }) private tilePrefabs: TypeToTilePair[] = [];
    @property({ type: cc.JsonAsset }) private boardJson: cc.JsonAsset|null = null;
    @property({ type: cc.Node }) private tilesParent: cc.Node|null = null;

    private board: Board | null = null;
    start() {

        this.board = BoardFabric.CreateRandomBoard(cc.size(8, 8));
        this.DrawBoard();
    }

    public DrawBoard(): void {
        if (!this.board) return;
        for (let i = 0; i < this.board.Tiles.length; i++) {
            for (let j = 0; j < this.board.Tiles[i].length; j++) {
                const tileInfo = this.board.Tiles[i][j];
                if (tileInfo.Type === 0) continue;
                const prefabs = this.tilePrefabs.find(p => p.Type === tileInfo.Type);
                if (!prefabs) continue;
                const prefab = prefabs.GetPrefabByColor(tileInfo.Color);
                if (!prefab) continue;
                const tileNode = cc.instantiate(prefab);
                this.tilesParent?.addChild(tileNode);
                tileNode.getComponent(TileView)?.Init(()=>{ this.OnTileClick(new cc.Vec2(j, i)); });
                tileNode.setPosition(j * 100, -i * 100);
            }
        }   
    }

    private OnTileClick(index:cc.Vec2): void {
        console.log("Tile clicked at: " + index);
    }

}