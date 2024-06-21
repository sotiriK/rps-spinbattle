import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";
import IGoContainer from "../Interfaces/IGoContainer";

// display a slot machine win box
export default class GoWinBox extends GameObject {
    // constants
    private readonly _fillId: string = "Fill";
    private readonly _fadeMinFactor: number = 0.5;
    private readonly _fadeSpeed: number = 0.025;
    private readonly _lineAlphaMultiplier: number = 3;

    // private members
    private readonly _fillAlpha: number;
    private readonly _flash: boolean;
    private _fill?: IGoContainer;
    private _cell: [x: number, y: number];

    // properties
    public set Cell(value: [x: number, y: number]) {
        this._cell = value;
    }
    public get Cell(): [x: number, y: number] {
        return this._cell;
    }

    // initialization
    public constructor(renderer: IRenderer, id: string, size: number, lineSize: number, lineColor: number, fillColor: number, fillAlpha: number, flash: boolean) {
        super(renderer, id);

        this._fillAlpha = fillAlpha;
        this._flash = flash;
        this._fill = this.Renderer.StageRectangle(this.GetFillId(), size, size, fillColor, this._fillAlpha);
        
        const lineAlpha: number = this._fillAlpha * this._lineAlphaMultiplier;
        this._container = this.Renderer.StageFrame(this._id, size, size, lineSize, lineColor, lineAlpha > 1 ? 1 : lineAlpha);
        this._cell = [0, 0]; 
    }

    // public methods
    public SetPosition(x: number, y: number): void {
        if(this._container) {
            this._container.x = x;
            this._container.y = y;
        }
        if (this._fill && this._fill) {
            this._fill.x = x;
            this._fill.y = y;
        }
    }

    // abstract implementations
    public Update(deltaTime: number): void {
        if (!this._flash) return;
        if (!this._fill) return;
        this._fill.alpha -= this._fadeSpeed * deltaTime;
        
        const min = this._fillAlpha * this._fadeMinFactor;
        if (this._fill.alpha <= min) {
            this._fill.alpha = this._fillAlpha; 
        }
    }

    // base overrides
    public Transform(x: number, y: number, width: number, height: number): void {
        super.Transform(x, y, width, height);
        if (this._fill) {
            this._fill.x = x;
            this._fill.y = y;
            this._fill.width = width;
            this._fill.height = height;
        }
    }

    public Dispose(): void {
        super.Dispose();
        if (this._fill) {
            this.Renderer.Remove(this.GetFillId());
            this._fill = undefined;
        }
    }

    // helpers
    private GetFillId() {
        return this._id + this._fillId;
    }
}
