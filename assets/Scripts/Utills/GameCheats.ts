import Board from "../Game/Board/Board";
import { EBoosterType } from "../Game/EBoosterType";
import GameScene from "../GameScene";
import Profile from "../Profile";
import BoardFabric from "./BoardFabric";

const {ccclass, property} = cc._decorator;

@ccclass("GameCheats")
export default class GameCheats extends cc.Component {
   
    @property(GameScene) private scene:GameScene|null = null;

    public AddBoosters(){
        Profile.Instance.AddBooster(EBoosterType.Bomb,5);
        Profile.Instance.AddBooster(EBoosterType.Teleport,5);
        Profile.Instance.Save();
    }

    public ResetBoard(){
        Profile.Instance.Board = null;
        this.scene?.Load();
    }

    public RandomBoard(){
        let board: Board = BoardFabric.CreateRandomBoard(cc.size(9, 10));
        Profile.Instance.Board = board;
        this.scene?.Load();
    }

}
