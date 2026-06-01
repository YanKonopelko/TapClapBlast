import TileInfo from "./TileInfo";

export default class Board{

    private _tiles: TileInfo[][] = [];
    
    public get Tiles(): TileInfo[][] {
        return this._tiles;
    }
}
