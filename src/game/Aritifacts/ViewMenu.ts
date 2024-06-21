import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import GoButton from "./GoButton";
import GameObject from "../Abstracts/GameObject";
import GoImage from "./GoImage";
import Manager from "../Abstracts/Manager";

// display menu graphics
export default class ViewMenu extends Manager {
    // constants
    private readonly _titleOffsetY: number = -100;
    private readonly _buttonOffsetY: number = 276;
    private readonly _buttonWidth: number = 512;
    private readonly _buttonHeight: number = 128;
    private readonly _titleSize: number = 512;
    private readonly _titleSpeed: number = 0.1;

    // private members
    private readonly _title: GoImage;
    private readonly _playButton: GameObject;

    // initialization
    public constructor(config: IConfig, renderer: IRenderer, playHandler: () => void) {
        super(config, renderer);
        this._playButton = new GoButton(this.Renderer, this.Config.SpriteButtonPlay, this.Config.SpriteButtonPlay, playHandler);
        this._title = new GoImage(this.Renderer, this.Config.SpriteTitle, this.Config.SpriteTitle, this._titleSpeed);
    }
    
    // abstract implementations
    public DisableInteraction(): void {
        this._playButton.Disabled = true;
    }
    
    public EnableInteraction(): void {
        this._playButton.Disabled = false;
    }

    public Update(deltaTime: number): void {
        this._playButton.Update(deltaTime);
        this._title.Update(deltaTime);
    }

    public Dispose(): void {
        this._playButton.Dispose();
        this._title.Dispose();
    }

    public UpdateLayout(scaleX: number, scaleY: number, canvasWidth: number, canvasHeight: number, portrait: boolean): void {
        const scale: number = portrait ? scaleY : scaleX;
        let xywh: [x: number, y: number, w: number, h: number];
        
        xywh = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, this._buttonWidth, this._buttonHeight, scale, 0, this._buttonOffsetY);
        this._playButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
        
        xywh = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, this._titleSize, this._titleSize, scale, 0, this._titleOffsetY);
        this._title.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
    }
}
