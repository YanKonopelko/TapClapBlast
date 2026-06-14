import Profile from "./Profile";
const { ccclass, property } = cc._decorator;

@ccclass
export default class EntryPoint extends cc.Component {
    
    start() {
        console.log("Game Started");
        Profile.Instance.Load();
        cc.director.loadScene("Game");
    }

}