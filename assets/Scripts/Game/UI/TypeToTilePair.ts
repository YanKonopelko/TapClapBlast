import ColorToPrefabPair from "./ColorToPrefabPair";
import { ETileColor } from "../Board/ETileColor";
import { ETileType } from "../Board/ETileType";

const { ccclass, property } = cc._decorator;

@ccclass("TypeToTilePair")
export default class TypeToTilePair {

    @property({ type: cc.Enum(ETileType) }) private type: ETileType = ETileType.None;
    @property({ type: [ColorToPrefabPair] }) private colors: ColorToPrefabPair[] = [];
    @property({ type: cc.Prefab }) private basePrefab: cc.Prefab | null = null;

    public get Type(): ETileType {
        return this.type;
    }
    public get Colors(): ColorToPrefabPair[] {
        return this.colors;
    }   
    public get BasePrefab(): cc.Prefab | null {
        return this.basePrefab;
    }

    public GetPrefabByColor(color: ETileColor): cc.Prefab | null {
        for (let i = 0; i < this.colors.length; i++) {
            if (this.colors[i].Color === color) {
                return this.colors[i].Prefab;
            }
        }
        return this.basePrefab;
    }

}
