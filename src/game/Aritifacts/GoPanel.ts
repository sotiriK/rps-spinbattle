import IGoContainer from "../Interfaces/IGoContainer";
import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";

// display a ui panel
export default class GoPanel extends GameObject {
    // constants
    private readonly _alphaStart: number = 0.95;
    private readonly _alphaMin: number = 0.75;
    private readonly _alphaMax: number = 1.0;
    private readonly _alphaChange: number = 0.00125;

    // private members
    private _alphaDir: number;

    // initialization
    public constructor(renderer: IRenderer, id: string, width: number, height: number, color: number, alpha: number, lineSize: number, lineColor: number, lineAlpha: number) {
        super(renderer, id);
        this._alphaDir = -1;

        this._container = this.Renderer.StageRectangle(this._id, width, height, color, alpha); 
        this._container.alpha = this._alphaStart;

        let lines: IGoContainer | undefined = this.Renderer.NestRectangle(this._id, width, lineSize, lineColor, lineAlpha);
        if (lines) lines.y = width - lineSize; 
        this.Renderer.NestRectangle(this._id, width, lineSize, lineColor, lineAlpha);
    }

    // abstract implementations
    public Update(deltaTime: number): void {
        if (!this._container) return;
        this._container.alpha += this._alphaChange * deltaTime * this._alphaDir;
        if (this._container.alpha <= this._alphaMin) {
            this._container.alpha = this._alphaMin;
            this._alphaDir = 1;
        }
        else if(this._container.alpha >= this._alphaMax) {
            this._container.alpha = this._alphaMax;
            this._alphaDir = -1;
        }
    }
}
