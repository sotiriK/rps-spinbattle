import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import GoButton from "./GoButton";
import GameObject from "../Abstracts/GameObject";
import Manager from "../Abstracts/Manager";
import IGoContainer from "../Interfaces/IGoContainer";
import GoText from "./GoText";
import GoPanel from "./GoPanel";

// display info page graphics
export default class ViewInfo extends Manager {
    // constants
    private readonly _closeId: string = "ViewInfoExitButton";
    private readonly _logoId: string = "ViewInfoLogo";
    private readonly _coverId: string = "ViewInfoBackCover";
    private readonly _descId: string = "ViewInfoDescText";
    private readonly _headerId: string = "ViewInfoHeaderPanel";
    private readonly _reelId: string = "ViewInfoReel";
    private readonly _nextId: string = "ViewInfoNextButton";
    private readonly _prevId: string = "ViewInfoPrevButton";
    private readonly _upId: string = "ViewInfoUpButton";
    private readonly _downId: string = "ViewInfoDownButton";
    private readonly _selectId: string = "ViewInfoSelect";
    private readonly _nextStopsId: string = "ViewInfoNextStops";
    private readonly _zeroStopsId: string = "ViewInfoZeroStops";
    private readonly _randomStopsId: string = "ViewInfoRandomStops";
    private readonly _nextStopsInfo: string = "NEXT: ";
    private readonly _logoSize: number = 384;
    private readonly _edgeOffset: number = 12;
    private readonly _exitSize: number = 96;
    private readonly _navSize: number = 48;
    private readonly _coverColor: number = 0xdddddd;
    private readonly _coverAlpha: number = 0.95;
    private readonly _panelSize: number = 640;
    private readonly _portraitDescFactor: number = 0.7;
    private readonly _stopsTextFactor: number = 0.7;

    // private members
    private readonly _exitButton: GameObject;
    private readonly _prevButton: GameObject;
    private readonly _nextButton: GameObject;
    private readonly _upButton: GameObject;
    private readonly _downButton: GameObject;
    private readonly _zeroButton: GameObject;
    private readonly _randButton: GameObject;
    private readonly _selectBox: IGoContainer;
    private readonly _descText: GoText;
    private readonly _stopsText: GoText;
    private readonly _reels: Array<IGoContainer>;
    private readonly _reelset: Array<Array<string>>;
    private readonly _cover: IGoContainer;
    private readonly _logo: IGoContainer;
    private readonly _header: GameObject;
    private readonly _descTextWidth: number;
    private readonly _descTextHeight: number;
    private readonly _stopsTextWidth: number;
    private readonly _stopsTextHeight: number;
    private readonly _reelTextWidth: number;
    private readonly _reelTextHeight: number;
    private readonly _stops: Array<number>;
    private readonly _gaffeHandler: (stops: Array<number>) => void;
    private _selectedReel: number;

    // initialization
    public constructor(config: IConfig, renderer: IRenderer, gaffeHandler: (stops: Array<number>) => void, returnHandler: () => void) {
        super(config, renderer);
        this._gaffeHandler = gaffeHandler;

        // back cover and header panel
        this._cover = this.Renderer.StageRectangle(this._coverId, this.Config.ReferenceWidth, this.Config.ReferenceHeight, this._coverColor, this._coverAlpha);        
        this._header = new GoPanel(this.Renderer, this._headerId, this._panelSize, this._panelSize, this.Config.ColorSlotPanelFill, this.Config.AlphaSlotPanelFill, this.Config.SizeSlotPanelLine, this.Config.ColorSlotPanelLine, this.Config.AlphaSlotPanelLine);
        
        // logo 
        this._logo = this.Renderer.StageSprite(this._logoId, this.Config.SpriteTitle);

        // description text
        this._descText = new GoText(this.Renderer, this._descId, this.Config.GameDescription, this.Config.DescTextFonts, this.Config.DescTextSize, this.Config.DescTextColor, this.Config.DescTextStrokeColor, this.Config.DescTextStrokeSize);
        this._descTextWidth = this._descText.TextWidth;
        this._descTextHeight = this._descText.TextHeight;

        // reels (for setting gaffes)
        this._reelTextWidth = 0;
        this._reelTextHeight = 0;
        this._stops = new Array<number>();
        this._reels = new Array<IGoContainer>();
        this._reelset = this.Config.Reelset.concat(this.Config.Reelset);
        for (let index = 0; index < this._reelset.length; index++) {
            const reelString: string = this.GetReelString(this._reelset[index], index, 0);
            this._stops.push(0);
            const text: IGoContainer = this.Renderer.StageText(this.GetReelId(index), reelString, this.Config.DescTextFonts, this.Config.DescTextSize, this.Config.DescTextColor, this.Config.DescTextStrokeColor, this.Config.DescTextStrokeSize, false);
            this._reels.push(text);
        };
        this._reelTextWidth = this._reels[0].width;
        this._reelTextHeight = this._reels[0].height;

        // selection indicator
        this._selectBox = this.Renderer.StageRectangle(this._selectId, this._reelTextWidth, this._reelTextHeight, this.Config.ColorSlotPanelFill, this.Config.AlphaSlotPanelFill);
        this._selectedReel = 0;

        // stops text
        this._stopsText = new GoText(this.Renderer, this._nextStopsId, this.GetStopsText(), this.Config.DescTextFonts, this.Config.DescTextSize * this._stopsTextFactor, this.Config.DescTextColor, this.Config.DescTextStrokeColor, this.Config.DescTextStrokeSize);
        this._stopsTextWidth = this._stopsText.TextWidth;
        this._stopsTextHeight = this._stopsText.TextHeight;

        // edit gaffe buttons
        this._nextButton = new GoButton(this.Renderer, this._nextId, this.Config.SpriteButtonRight, () => { 
            this._selectedReel = (this._selectedReel + 1) % this._reels.length; 
            this.UpdateSelectionIndicator();
        });
        this._prevButton = new GoButton(this.Renderer, this._prevId, this.Config.SpriteButtonLeft, () => {
            this._selectedReel = this._selectedReel - 1 < 0 ? this._reels.length - 1 : this._selectedReel - 1; 
            this.UpdateSelectionIndicator();
        });
        this._upButton = new GoButton(this.Renderer, this._upId, this.Config.SpriteButtonUp, () => {
            this.MoveStop(1);
        });
        this._downButton = new GoButton(this.Renderer, this._downId, this.Config.SpriteButtonDown, () => {
            this.MoveStop(-1);
        });
        this._zeroButton = new GoButton(this.Renderer, this._zeroStopsId, this.Config.SpriteButtonZero, () => {
            this.ZeroAllStops();
        });
        this._randButton = new GoButton(this.Renderer, this._randomStopsId, this.Config.SpriteButtonRandom, () => {
            this.RandomAllStops();
        });

        // exit button
        this._exitButton = new GoButton(this.Renderer, this._closeId, this.Config.SpriteButtonClose, () => {
            this._gaffeHandler(this._stops);
            returnHandler();
        });
    }
    
    // abstract implementations
    public DisableInteraction(): void {
        this._exitButton.Disabled = true;
        this._descText.Disabled = true;
        this._stopsText.Disabled = true;
        this._header.Disabled = true;
        this._nextButton.Disabled = true;
        this._prevButton.Disabled = true;
        this._upButton.Disabled = true;
        this._downButton.Disabled = true;
        this._zeroButton.Disabled = true;
        this._randButton.Disabled = true;
    }
    
    public EnableInteraction(): void {
        this._exitButton.Disabled = false;
        this._descText.Disabled = false;
        this._stopsText.Disabled = false;
        this._header.Disabled = false;
        this._nextButton.Disabled = false;
        this._prevButton.Disabled = false;
        this._upButton.Disabled = false;
        this._downButton.Disabled = false;
        this._zeroButton.Disabled = false;
        this._randButton.Disabled = false;
    }

    public Update(deltaTime: number): void {
        this._exitButton.Update(deltaTime);
        this._descText.Update(deltaTime);
        this._stopsText.Update(deltaTime);
        this._header.Update(deltaTime);
        this._nextButton.Update(deltaTime);
        this._prevButton.Update(deltaTime);
        this._upButton.Update(deltaTime);
        this._downButton.Update(deltaTime);
        this._zeroButton.Update(deltaTime);
        this._randButton.Update(deltaTime);
    }

    public Dispose(): void {
        this._exitButton.Dispose();
        this._descText.Dispose();
        this._stopsText.Dispose();
        this._header.Dispose();
        this._nextButton.Dispose();
        this._prevButton.Dispose();
        this._upButton.Dispose();
        this._downButton.Dispose();
        this._zeroButton.Dispose();
        this._randButton.Dispose();

        for (let i: number = 0; i < this._reels.length; i++) { 
            this.Renderer.Remove(this.GetReelId(i)); 
        }
        this.Renderer.Remove(this._logoId);
        this.Renderer.Remove(this._coverId);
        this.Renderer.Remove(this._selectId);
    }

    public UpdateLayout(scaleX: number, scaleY: number, canvasWidth: number, canvasHeight: number, portrait: boolean): void {
        const scale = portrait ? scaleY : scaleX;

        // exit button
        let xywh = Manager.AnchorObjectRightBottom(canvasWidth, canvasHeight, this._exitSize, this._exitSize, scale, -this._edgeOffset, -this._edgeOffset);
        this._exitButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

        let stopsTextY;
        if (!portrait) {
            // logo
            xywh = Manager.AnchorObjectLeftTop(this._logoSize, this._logoSize, scale, this._edgeOffset, (this._descTextHeight-this._logoSize)/2);
            this._logo.width = xywh[2];
            this._logo.height = xywh[3];
            this._logo.x = xywh[0];
            this._logo.y = xywh[1];

            // description
            xywh = Manager.AnchorObjectLeftTop(this._descTextWidth, this._descTextHeight, scale, this._logoSize+this._edgeOffset, this._edgeOffset);
            this._descText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // next stops text
            xywh = Manager.AnchorObjectLeftBottom(canvasHeight, this._stopsTextWidth, this._stopsTextHeight, scale, this._edgeOffset, -this._edgeOffset);
            this._stopsText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
            stopsTextY = xywh[1];
        }
        else {
            // logo
            const ls = this._logoSize;
            xywh = Manager.AnchorObjectCenterTop(canvasWidth, ls, ls, scale, 0, this._edgeOffset);
            this._logo.width = xywh[2];
            this._logo.height = xywh[3];
            this._logo.x = xywh[0];
            this._logo.y = xywh[1];

            // description
            const h = this._descTextHeight * this._portraitDescFactor;
            const w = this._descTextWidth * this._portraitDescFactor;
            xywh = Manager.AnchorObjectCenterTop(canvasWidth, w, h, scale, 0, ls + this._edgeOffset + this._edgeOffset);
            this._descText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // next stops text
            xywh = Manager.AnchorObjectLeftBottom(canvasHeight, this._stopsTextWidth, this._stopsTextHeight, scale, this._edgeOffset, -this._edgeOffset);
            this._stopsText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
            stopsTextY = xywh[1];
        }

        // selection buttons
        const s = this._navSize * scale;
        const y = stopsTextY - s;
        this._prevButton.Transform(xywh[0], y, s, s);
        this._upButton.Transform(xywh[0] + s, y, s, s);
        this._downButton.Transform(xywh[0] + s * 2, y, s, s);
        this._nextButton.Transform(xywh[0] + s * 3, y, s, s);
        this._zeroButton.Transform(xywh[0] + s * 4, y, s, s);
        this._randButton.Transform(xywh[0] + s * 5, y, s, s);

        // panel
        const edgeOffsetScaled = this._edgeOffset * scale;
        const b = this._descText.GoContainer!.y + this._descText.GoContainer!.height;
        this._header.Transform(0, 0, canvasWidth, b + edgeOffsetScaled + edgeOffsetScaled);

        // reels
        const reelsOffsetY = portrait ? edgeOffsetScaled + edgeOffsetScaled : 0;
        this._reels.forEach((reel: IGoContainer, index: number) => {
            xywh = Manager.AnchorObjectCenterBottom(canvasWidth, canvasHeight, this._reelTextWidth, this._reelTextHeight, scale, 0, 0);
            reel.x = xywh[0] - (xywh[2] * this._reels.length) / 2 + xywh[2] * index + xywh[2] / 2;
            reel.y = this._header.GoContainer!.height + (canvasHeight - this._header.GoContainer!.height) / 2 - xywh[3] / 2 - reelsOffsetY;
            reel.width = xywh[2];
            reel.height = xywh[3];
        });
        this.UpdateSelectionIndicator();
        
        // back cover
        this._cover.x = 0;
        this._cover.y = 0;
        this._cover.width = canvasWidth;
        this._cover.height = canvasHeight;
    }

    // helpers
    private GetReelId(index: number): string {
        return `${this._reelId}_${index}`;
    }

    private GetStopsText(): string {
        return `${this._nextStopsInfo}${this._stops}`;
    }

    private MoveStop(sign: number) {
        const reel = this._reelset[this._selectedReel];
        
        let inputStop: number = this._stops[this._selectedReel] + sign;
        if (inputStop < 0) {
            inputStop = reel.length + inputStop;
        }

        const stop: number = inputStop % reel.length;
        const reelString: string = this.GetReelString(reel, this._selectedReel, stop);
        
        this._stops[this._selectedReel] = stop;
        this.Renderer.UpdateText(this.GetReelId(this._selectedReel), reelString);
        this.Renderer.UpdateText(this._nextStopsId, this.GetStopsText());
    }

    private ZeroAllStops() {
        this._reelset.forEach((reel: Array<string>, index) => {
            const reelString = this.GetReelString(reel, index, 0);

            this._stops[index] = 0;
            this.Renderer.UpdateText(this.GetReelId(index), reelString);
            this.Renderer.UpdateText(this._nextStopsId, this.GetStopsText());
        });
    }

    private RandomAllStops() {
        this._reelset.forEach((reel: Array<string>, index) => {
            const stop: number = Math.floor(Math.random() * reel.length);
            const reelString: string = this.GetReelString(reel, index, stop);

            this._stops[index] = stop;
            this.Renderer.UpdateText(this.GetReelId(index), reelString);
            this.Renderer.UpdateText(this._nextStopsId, this.GetStopsText());
        });
    }

    private GetReelString(reel: Array<string>, reelIndex: number, stop: number): string {
        let text: string = reel[stop];
        for (let i = 1; i < this.Config.MachineRows; i++) { 
            const next = (stop + i) % reel.length;
            text += `\n${reel[next]}`;
        }
        return `${reelIndex}\n-\n${text}`;
    }

    private UpdateSelectionIndicator() {
        const selReel = this._reels[this._selectedReel];
        this._selectBox.x = selReel.x;
        this._selectBox.y = selReel.y;
        this._selectBox.width = selReel.width;
        this._selectBox.height = selReel.height;
    }
}
