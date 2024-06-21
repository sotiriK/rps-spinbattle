import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import Manager from "../Abstracts/Manager";
import IGoContainer from "../Interfaces/IGoContainer";

// display and animate a game background
export default class ViewBack extends Manager {
    // constants
    private readonly _alpha: number = 0.5;
    private readonly _alphaVariation: number = 0.1;
    private readonly _tileSize: number = 256;
    private readonly _maxFlashFrames: number = 30;

    // private members
    private _tileContainer?: IGoContainer;
    private _flashFrames: number;

    // initialization
    public constructor(config: IConfig, renderer: IRenderer) {
        super(config, renderer);
        this._tileContainer = renderer.StageSpriteRepeat(this.Config.SpriteBackTile, this.Config.SpriteBackTile, this.Config.ReferenceWidth, this.Config.ReferenceHeight);
        this._tileContainer.alpha = this._alpha;
        this._flashFrames = 0;
    }

    // abstract implementations
    public DisableInteraction(): void {
        if (!this._tileContainer) return;
        this._flashFrames = 0;
    }
    
    public EnableInteraction(): void {
        if (!this._tileContainer) return;
        this._flashFrames = this._maxFlashFrames;
    }

    public UpdateLayout(scaleX: number, scaleY: number, canvasWidth: number, canvasHeight: number, portrait: boolean): void {
        if (!this._tileContainer) return;
        const scale = portrait ? scaleY : scaleX;
        const xywh = Manager.AnchorTiledCenterMiddle(canvasWidth, canvasHeight, this._tileSize, scale);
        this._tileContainer = this.Renderer.RestageSpriteRepeat(this.Config.SpriteBackTile, xywh[2], xywh[3], scale);
        this._tileContainer.x = xywh[0];
        this._tileContainer.y = xywh[1];
        this._tileContainer.alpha = this._alpha;
    }

    public Update(deltaTime: number): void {
        if (!this._tileContainer) return; 
        if (this._flashFrames === 0) return;
        const sign = Math.random() >= 0.5 ? -1 : 1;
        this._tileContainer.alpha = this._alpha + Math.random() * this._alphaVariation * deltaTime * sign;
        this._flashFrames--;
    }

    public Dispose(): void {
        if (!this._tileContainer) return;
        this.Renderer.Remove(this.Config.SpriteBackTile);
        this._tileContainer = undefined;
    }
}