import { EBoosterType } from "../Game/EBoosterType";
import Profile from "../Profile";

const {ccclass, property} = cc._decorator;

@ccclass("GameCheats")
export default class GameCheats extends cc.Component {
   
    public AddBoosters(){
        Profile.Instance.AddBooster(EBoosterType.Bomb,5);
        Profile.Instance.AddBooster(EBoosterType.Teleport,5);
        Profile.Instance.Save();
    }

    // public 

}
