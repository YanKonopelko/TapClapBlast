import Profile from "../Profile";
import { EBoosterType } from "./EBoosterType";

const {ccclass, property} = cc._decorator;

@ccclass("BoosterView")
export default class BoosterView extends cc.Component {
    @property({type: cc.Label}) private counterLabel: cc.Label | null = null;
    @property({type: cc.Sprite}) private iconSprite: cc.Sprite| null = null;
    @property({type: cc.Button}) private button: cc.Button| null = null;

    private readonly IconsPath = "Boosters/";

    private onClickAction: Function = () => {};

    private count:number = 5;

    public Init(onClickAction: Function,type:EBoosterType ):void{
        this.counterLabel?.string = this.count.toString();
        this.button?.node.off(cc.Node.EventType.TOUCH_END, this.OnClick, this);
        this.onClickAction = onClickAction;
        this.button?.node.on(cc.Node.EventType.TOUCH_END, this.OnClick, this);
        const name = this.IconsPath + EBoosterType[type] ;
        cc.resources.load(name, cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
                cc.error(error);
                return;
            }

            if (this.iconSprite) {
                this.iconSprite.spriteFrame = spriteFrame;
            }
        });
    } 

    private OnClick(){
        if(this.onClickAction)
            this.onClickAction();
        // this.count --;
        this.counterLabel?.string = this.count.toString();
        // Profile.Instance.
    }

}
