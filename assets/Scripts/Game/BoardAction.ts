import { TileInfo } from "./TileInfo";

export enum EBoardActionType {
    AddTile,
    TileMatch,
    MoveTile,
    SwapTile,
}

export type BoardAction =
{
    Type: EBoardActionType;
    TileInfo: TileInfo;
    Position: cc.Vec2;
    OldPosition?: cc.Vec2;
}
