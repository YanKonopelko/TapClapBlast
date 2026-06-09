
export default class Grid{

    private _grid: boolean[][] = [];
    
    public get Rows(): number {
        return this._grid.length;
    }

    public get Columns(): number {
        return this._grid.sort((a, b) => b.length - a.length)[0].length;
    }
    public get Grid(): boolean[][] {
        return this._grid;
    }

    constructor(grid: boolean[][]) {
        this._grid = grid;
    }
}
