import { ETileColor } from "./ETileColor";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TileView extends cc.Component {

    @property({type: TileInfo}) private tileInfo: TileInfo = new TileInfo(ETileColor.Red,ETileType.Tile);

    private onClickAction: Function = () => {};

    public Init(onClickAction: Function ):void{
        this.onClickAction = onClickAction;
        this.node.on(cc.Node.EventType.TOUCH_END, onClickAction, this);
    } 
    
}
