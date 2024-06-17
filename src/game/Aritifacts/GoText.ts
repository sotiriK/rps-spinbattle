import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";

// display text on screen 
export default class GoText extends GameObject {
    // constants
    private readonly _fade: number = 0.2;

    // private members
    private _textHeight: number;
    private _textWidth: number;
    private _hide: boolean;

    // public properties
    public get TextHeight(): number { 
        return this._textHeight; 
    }
    public get TextWidth(): number { 
        return this._textWidth; 
    }
    public set Text(value: string) { 
        this.Renderer.UpdateText(this._id, value); 
    }

    // initialization
    public constructor(renderer: IRenderer, id: string, text: string, fonts: Array<string>, size:number, color:number, strokeColor:number, strokeSize:number) {
        super(renderer, id);
        this._container = this.Renderer.StageText(this._id, text, fonts, size, color, strokeColor, strokeSize, true);
        this._textWidth = this._container.width;
        this._textHeight = this._container.height;
        this._hide = false;
    }

    // abstract implementations
    public Update(deltaTime: number): void {
        if (!this._container) return;
        if (!this._container.visible) return;
        if (!this._hide) return;

        const alpha = this._container.alpha - this._fade * deltaTime;
        this._container.alpha = alpha > 0 ? alpha : 0;
        if (this._container.alpha === 0) {
            this._container.visible = false;
        }
    }

    // base overrides
    public Hide(): void {
        this._hide = true;
    }

    public Show(): void {
        this._hide = false;
        if (!this._container) return;
        this._container.alpha = 1;
        this._container.visible = true;
    }
}