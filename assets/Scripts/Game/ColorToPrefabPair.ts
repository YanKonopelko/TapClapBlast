import { ETileColor } from "./ETileColor";

const { ccclass, property } = cc._decorator;

@ccclass("ColorToPrefabPair")
export default class ColorToPrefabPair {

    @property({ type: cc.Enum(ETileColor) }) private color: ETileColor = ETileColor.None;
    @property({ type: cc.Prefab }) private prefab: cc.Prefab | null = null;

    public get Color(): ETileColor {
        return this.color;
    }
    public get Prefab(): cc.Prefab| null {
        return this.prefab;
    }

}
