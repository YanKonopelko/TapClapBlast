import { TimeUtils } from "../Utills/TimeUtils";
import { ETileColor } from "./ETileColor";
import { ETileType } from "./ETileType";
import TileInfo from "./TileInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TileView extends cc.Component {

    @property({type: TileInfo}) private tileInfo: TileInfo = new TileInfo(ETileColor.Red,ETileType.Tile);
    @property({type: cc.Animation}) private tileAnimation: cc.Animation | null = null;
    @property({type: cc.String}) private tileName: string = "";

    private onClickAction: Function = () => {};

    public Init(onClickAction: Function ):void{
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClickAction, this);
        this.onClickAction = onClickAction;
        this.node.on(cc.Node.EventType.TOUCH_END, onClickAction, this);
    } 
    

    public async Destroy(): Promise<void> {
        let duration = this.tileAnimation?.getClips().find(c => c.name === this.tileName)?.duration ?? 0;
        this.tileAnimation?.play(this.tileName);
        await TimeUtils.TimeoutSeconds(duration);
        this.node.destroy();
    }
}
