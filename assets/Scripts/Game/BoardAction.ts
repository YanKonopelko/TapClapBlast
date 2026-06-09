import TileInfo from "./TileInfo";

export enum EBoardActionType {
    AddTile,
    TileMatch,
    
}

export type BoardAction =
{
    Type: EBoardActionType;
    TileInfo: TileInfo;
}