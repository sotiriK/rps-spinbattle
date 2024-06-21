import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";

// display an animating sprite
export default class GoImage extends GameObject {
    // constants
    private readonly _maxSize: number = 1.05;
    private readonly _minSize: number = 0.95;
    private readonly _velocityStart: number = 0.01;
    private readonly _fade: number = 0.1;

    // private members
    private _velocity: number;
    private _speed: number;
    private _orgWidth: number;
    private _orgHeight: number;
    private _pivotX: number;
    private _pivotY: number;
    private _hide: boolean;
    private _factor: number;

    // initialization
    public constructor(renderer: IRenderer, id: string, asset: string, speed: number) {
        super(renderer, id);
        this._container = renderer.StageSprite(this._id, asset);

        this._orgWidth = this._container.width;
        this._orgHeight = this._container.height;
        this._pivotX = this._container.x + this._orgWidth / 2;
        this._pivotY = this._container.y + this._orgHeight / 2;
        this._velocity = this._velocityStart;
        this._speed = speed;
        this._hide = false;
        this._factor = 1;
    }

    // abstract implementations
    public Update(deltaTime: number): void {
        if (!this._container) return;
        if (!this._container.visible) return;

        this._container.width = this._orgWidth * this._factor;
        this._container.height = this._orgHeight * this._factor;
        this._container.x = this._pivotX - this._container.width / 2;
        this._container.y = this._pivotY - this._container.height / 2;

        this._factor += this._velocity * this._speed * deltaTime;
        if (this._factor > this._maxSize) {
            this._factor = this._maxSize;
            this._velocity = -this._velocity;
        }
        else if(this._factor < this._minSize) {
            this._factor = this._minSize;
            this._velocity = -this._velocity;
        }

        if (this._hide) {
            const alpha = this._container.alpha - this._fade * deltaTime;
            this._container.alpha = alpha > 0 ? alpha : 0;
            if (this._container.alpha === 0) {
                this._container.visible = false;
            }
        }
    }

    // base overrides
    public Transform(x: number, y: number, width: number, height: number): void {
        super.Transform(x, y, width, height);
        this._orgWidth = width;
        this._orgHeight = height;
        this._pivotX = x + width / 2;
        this._pivotY = y + height / 2;
    }

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
