import { RandomWithSeedGenerator } from "../Utills/Random";
import Grid from "./Grid";
import TileInfo from "./TileInfo";

export type BoardInfo = {
    Seed: number;
    GeneratorStepCount: number;
    Tiles: TileInfo[][];
    Grid: Grid | null;
}
