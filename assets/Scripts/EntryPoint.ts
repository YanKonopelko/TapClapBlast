import Profile from "./Profile";
const { ccclass, property } = cc._decorator;

@ccclass
export default class EntryPoint extends cc.Component {
    
    start() {
        Profile.Instance.Load();
        cc.director.loadScene("Game");
    }

}