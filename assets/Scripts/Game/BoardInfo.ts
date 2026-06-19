import Grid from "./Grid";
import TileInfo from "./TileInfo";

export type BoardInfo = {
    Seed: number;
    GeneratorStepCount: number;
    Tiles: TileInfo[][];
    Grid: Grid | null;
    TargetScore: number;
    CurrentScore: number;
    MaxTurns: number;
    Turns: number;
}
