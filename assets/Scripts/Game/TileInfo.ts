import { ETileColor } from "./ETileColor";
import { ETileType } from "./ETileType";

const {ccclass, property} = cc._decorator;

@ccclass("TileInfo")
export default class TileInfo {

    @property({type: cc.Enum(ETileColor)}) private color: ETileColor = ETileColor.None;
    @property({type: cc.Enum(ETileType)}) private type: ETileType = ETileType.None;

    public get Color(): ETileColor {
        return this.color;
    }

    public get Type(): ETileType {
        return this.type;
    }
    
    constructor(color: ETileColor, type: ETileType) {
        this.color = color;
        this.type = type;
    }
}
