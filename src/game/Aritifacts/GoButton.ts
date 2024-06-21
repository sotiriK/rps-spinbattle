import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";

// display an interactive button 
export default class GoButton extends GameObject {
    // constants
    private readonly _pressedSize: number = 0.9;
    private readonly _pressedFrames: number = 3;

    // private members 
    private _pressed: number = 0;
    private _transform?: [x: number, y: number, w: number, h:number];
    private _pressedHandler?: () => void;

    // initialization
    public constructor(renderer: IRenderer, id: string, asset: string, pressHandler: () => void) {
        super(renderer, id);
        this._container = renderer.StageSpriteButton(this._id, asset, () =>  { 
            if (!this._container) return; 
            if (this._pressed !== 0) return;
            if (this._disabled) return;
            this._transform = [this._container.x, this._container.y, this._container.width, this._container.height];
            this._pressed = this._pressedFrames; 
            this._pressedHandler = pressHandler;
        });
    }
    
    // abstract implementations
    public Update(deltaTime: number): void {
        if (!this._container) return;
        if (this._pressed !== 0) {
            if (this._pressed === 1) {
                this._pressed = 0;
                if (this._transform) {
                    this.Transform(this._transform[0], this._transform[1], this._transform[2], this._transform[3]);
                    if (this._pressedHandler) {
                        this._pressedHandler(); 
                    }
                }
                return;
            }
            const w: number = this._container.width * this._pressedSize * deltaTime;
            const h: number = this._container.height * this._pressedSize * deltaTime;
            const x: number = this._container.x + (this._container.width - w) / 2;
            const y: number = this._container.y + (this._container.height - h) / 2;
            this.Transform(x, y, w, h);
            this._pressed--;
        }
    }
}