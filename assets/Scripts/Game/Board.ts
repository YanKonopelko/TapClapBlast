import { RandomWithSeedGenerator } from "../Utills/Random";
import Grid from "./Grid";
import TileInfo from "./TileInfo";

export default class Board{

    private _seed: number = 0;
    private _generatorStepCount: number = 0;
    private _tiles: TileInfo[][] = [];
    private _grid: Grid|null = null;
    
    private _generator: () => number;

    public get Tiles(): TileInfo[][] {
        return this._tiles;
    }

    constructor(seed: number,grid: Grid ,tiles: TileInfo[][], generatorStepCount: number = 0) {
        this._seed = seed;
        this._generator = RandomWithSeedGenerator(seed);
        this._tiles = tiles;
        this._grid = grid;
        this._generatorStepCount = generatorStepCount;
    }


    private BoardUpdate(): void {

    }

    public FromJson(){

    }

    public AsJson():cc.Object{
        const obj = new cc.Object() as any;
        obj["SEED"] = this._seed;
        obj["GENERATOR_STEP_COUNT"] = this._generatorStepCount;
        obj["TILES"] = this._tiles;
        obj["GRID"] = this._grid;
        return obj;
    }
}
