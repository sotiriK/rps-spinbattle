import Component from "../Abstracts/Component";
import IGoContainer from "../Interfaces/IGoContainer";
import IRenderer from "../Interfaces/IRenderer";
import CompReel from "./CompReel";
import GoWinBox from "./GoWinBox";

// display the slot machine
export default class CompSlot extends Component {
    // constants
    private readonly _borderId: string = "Border";
    private readonly _coverId: string = "Cover";
    private readonly _reelId: string = "Reel";
    private readonly _winBoxId: string = "WinBox";
    private readonly _symbolSize: number = 128;
    private readonly _colorCover: number = 0xffffff;
    private readonly _colorBorder: number = 0x000000;
    private readonly _alphaCover: number = 0.5
    private readonly _alphaBorder: number = 1;
    private readonly _sizeBorderLine: number = 6;

    // private members
    private readonly _border: IGoContainer;
    private readonly _cover: IGoContainer;
    private readonly _reels: Array<CompReel>;
    private _machineHeight: number;
    private _machineWidth: number;
    private _machineRows: number;
    private _borderWidth: number;
    private _stops: Array<number>;
    private _winBoxes: Array<GoWinBox>;
    private _x: number;
    private _y: number;

    // public properties
    public get MachineHeight(): number { 
        return this._machineHeight; 
    }
    public get MachineWidth(): number { 
        return this._machineWidth; 
    }
    public get IsSpinning(): boolean { 
        return this._reels.some(reel => reel.IsSpinning); 
    }
    public get BorderWidthOriginal() { 
        return this._sizeBorderLine; 
    }
    public set BorderWidth(value: number) { 
        this._borderWidth = value; 
    }

    // initialization
    public constructor(renderer: IRenderer, id: string, reelData: Array<Array<string>>, symbolsData: Map<string, string>, stops: Array<number>, rows: number) {
        super(renderer, id);
        this._machineRows = rows;
        this._machineHeight = this._machineRows * this._symbolSize;
        this._machineWidth = reelData.length * this._symbolSize;
        this._borderWidth = this._sizeBorderLine;
        this._stops = stops;
        this._x = 0;
        this._y = 0;
        this._winBoxes = new Array<GoWinBox>();
        
        // reels
        this._reels = new Array<CompReel>();
        for (let i = 0; i < reelData.length; i++) {
            const width = this._symbolSize;
            const height = this._machineHeight;
            const reelId = `${this._id}${this._reelId}${i}`;
            const reel = new CompReel(this.Renderer, reelId, reelData[i], symbolsData, this._stops[i], width, height);
            this._reels.push(reel);
        }

        // frame
        this._cover = this.Renderer.StageRectangle(this._id + this._coverId, this._machineWidth, this._machineHeight, this._colorCover, this._alphaCover);
        this._border = this.Renderer.StageFrame(this._id + this._borderId, this._machineWidth, this._machineHeight, this._borderWidth, this._colorBorder, this._alphaBorder);
    }
    
    // abstract implementations
    public Update(deltaTime: number): void {
        this._reels.forEach(reel => { reel.Update(deltaTime); });
        this._winBoxes.forEach((box) => { box.Update(deltaTime); });
    }
    
    public Transform(x: number, y: number, width: number, height: number): void {
        this._machineWidth = width;
        this._machineHeight = height;
        this._reels.forEach((reel, i) => {
            const w = Math.floor(this._machineHeight / this._machineRows);
            const h = this._machineHeight;
            reel.Transform(x + w * i, y, w, h); 
        });
        this._winBoxes.forEach((box) => {
            const size = Math.floor(this._machineHeight / this._machineRows);
            const cell = box.Cell;
            box.Transform(x + size * cell[0], y + size * cell[1], size, size); 
        });

        this._x = x;
        this._y = y;

        this._border.x = x
        this._border.y = y; 
        this._border.width = width + this._borderWidth; 
        this._border.height = height + this._borderWidth;
        
        this._cover.x = x;
        this._cover.y = y;
        this._cover.width = width;
        this._cover.height = height;
    }

    public Dispose(): void {
        this.Renderer.Remove(this._id);
        this.Renderer.Remove(this._id + this._coverId);
        this.Renderer.Remove(this._id + this._borderId);
        this._winBoxes.forEach((box) => { box.Dispose(); });
        this._winBoxes.length = 0;
        this._reels.forEach(reel => { reel.Dispose(); });
        this._reels.length = 0;
    }

    // public methods 
    public StartSpin(): void {
        this._cover.visible = false;
        this._winBoxes.forEach((box) => { box.Dispose(); });
        this._winBoxes.length = 0;
        this._reels.forEach(reel => { reel.StartSpin(); });
    }

    public EndSpin(stops: Array<number>, callbackPerReel: (reel: number) => void): void { 
        this._stops = stops;
        this.EndReelSpin(0, this._stops[0], callbackPerReel);
    }

    public ShowWinBoxes(winMatches: Array<[x:number, y:number]>, lineSize: number, lineColor: number, color: number, alpha: number, flash: boolean) {
        const symSize: number = Math.floor(this._machineHeight / this._machineRows);
        winMatches.forEach((match) => {
            const id: string = `${this._id}_${this._winBoxId}${match[0]}_${match[1]}`; 
            const box: GoWinBox = new GoWinBox(this.Renderer, id, symSize, lineSize, lineColor, color, alpha, flash);
            box.Cell = match;
            box.SetPosition(this._x + symSize * match[0], this._y + symSize * match[1]);
            this._winBoxes.push(box);
        });
    }

    // helpers
    private EndReelSpin(reel: number, stop: number, callbackPerReel: (reel: number) => void) {
        if (reel >= this._reels.length) return;
        this._reels[reel].EndSpin(stop, () => {
            callbackPerReel(reel);
            this.EndReelSpin(reel+1, this._stops[reel+1], callbackPerReel);
        });
    }
}
