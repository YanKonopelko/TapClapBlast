import { EBoosterType } from "../EBoosterType";

const {ccclass, property} = cc._decorator;

@ccclass("BoosterView")
export default class BoosterView extends cc.Component {
    @property({type: cc.Label}) private counterLabel: cc.Label | null = null;
    @property({type: cc.Sprite}) private iconSprite: cc.Sprite| null = null;
    @property({type: cc.Button}) private button: cc.Button| null = null;
    @property({type: cc.Animation}) private anim: cc.Animation| null = null;

    private readonly IconsPath = "Boosters/";
    private onClickAction: Function = () => {};
    private type:EBoosterType = EBoosterType.None;
    public get Type():EBoosterType{
        return this.type;
    }

    public Init(onClickAction: Function,type:EBoosterType ):void{
        this.type = type;
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
    }

    public SetCount(count: number): void {
        if (this.counterLabel) {
            this.counterLabel.string = `${count}`;
        }
        if (this.button) {
            this.button.interactable = count > 0;
        }
        if (count <= 0) {
            this.Deselect();
        }
    }

    public Select(){
        this.anim?.stop();
        this.anim?.play("BoosterAnimPulse");
    }
    public Deselect(){
        this.anim?.stop();
        this.anim?.play("BoosterAnimStop");
    }

}
