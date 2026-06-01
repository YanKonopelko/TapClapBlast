import { ETileColor } from "./ETileColor";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tile extends cc.Component {

    @property({type: TileInfo}) private tileInfo: TileInfo = new TileInfo();
    @property({type: cc.Sprite}) private sprite: cc.Sprite|null = null;

    public get Color(): ETileColor {
        return this.tileInfo.Color;
    }

    public get Type(): ETileType {
        return this.tileInfo.Type;
    }
    
}
