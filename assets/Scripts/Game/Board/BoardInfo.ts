import { TileInfo } from "./TileInfo";

export type BoardInfo = {
    Seed: number;
    GeneratorStepCount: number;
    Tiles: (TileInfo | null)[][];
    Grid: boolean[][];
    TargetScore: number;
    CurrentScore: number;
    MaxTurns: number;
    Turns: number;
}
