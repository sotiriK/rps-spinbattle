import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import GoButton from "./GoButton";
import GoText from "./GoText";
import GameObject from "../Abstracts/GameObject";
import CompSlot from "./CompSlot";
import GoPanel from "./GoPanel";
import GoImage from "./GoImage";
import Manager from "../Abstracts/Manager";

// display slot game graphics
export default class ViewGame extends Manager {
    // constants
    private readonly _betId: string = "BetText";
    private readonly _playerId: string = "PLAYER";
    private readonly _houseId: string = "HOUSE";
    private readonly _balanceId: string = "BalanceText";
    private readonly _winningsId: string = "WinningsText";
    private readonly _machinePlayerId: string = "MachinePlayer";
    private readonly _machineHouseId: string = "MachineHouse";
    private readonly _headerId: string = "SlotHeader";
    private readonly _footerId: string = "SlotFooter";
    private readonly _machineOffsetPortrait: number = 16;
    private readonly _machineOffsetLandscape: number = 48;
    private readonly _buttonSize: number = 96;
    private readonly _spinButtonWidth: number = 384;
    private readonly _panelSize: number = 120;
    private readonly _VersusSize: number = 256;
    private readonly _VersusSpeed: number = 0.9;

    // private members
    private readonly _machineWidth: number;
    private readonly _machineHeight: number;
    private readonly _balanceTextWidth: number;
    private readonly _balanceTextHeight: number;
    private readonly _betTextWidth: number;
    private readonly _betTextHeight: number;
    private readonly _winningsTextWidth: number;
    private readonly _winningsTextHeight: number;
    private readonly _machinePlayer: CompSlot;
    private readonly _machineHouse: CompSlot;
    private readonly _balanceText: GoText;
    private readonly _betText: GoText;
    private readonly _winningsText: GoText;
    private readonly _playerText: GoText;
    private readonly _houseText: GoText;
    private readonly _versus: GoImage;
    private readonly _spinButton: GameObject;
    private readonly _exitButton: GameObject;
    private readonly _infoButton: GameObject;
    private readonly _plusButton: GameObject;
    private readonly _minusButton: GameObject;
    private readonly _header: GameObject;
    private readonly _footer: GameObject; 
    private _portrait: boolean;  
    private _gameOver: boolean;  
    private _spinCallback?: () => void;

    // properties
    public get IsSpinning(): boolean { 
        return this._machinePlayer.IsSpinning || this._machineHouse.IsSpinning; 
    }

    // initialization
    public constructor(config: IConfig, renderer: IRenderer, spinHandler: () => void, exitHandler: () => void, infoHandler: () => void, betHandler: (direction: number) => [bet: number, balance: number]) {
        super(config, renderer);
        this._spinCallback = undefined;
        this._portrait = false;
        this._gameOver = false; 
        
        // slot machines
        this._machinePlayer = new CompSlot(this.Renderer, this._machinePlayerId, this.Config.Reelset, this.Config.SymbolAssets, this.Config.InitialPlayerStops, this.Config.MachineRows); 
        this._machineHouse = new CompSlot(this.Renderer, this._machineHouseId, this.Config.Reelset, this.Config.SymbolAssets, this.Config.InitialHouseStops, this.Config.MachineRows); 
        this._machineWidth = this._machinePlayer.MachineWidth;
        this._machineHeight = this._machinePlayer.MachineHeight;

        // images 
        this._versus = new GoImage(this.Renderer, this.Config.SpriteVersus, this.Config.SpriteVersus, this._VersusSpeed);

        // ui panels 
        this._header = new GoPanel(this.Renderer, this._headerId, this._panelSize, this._panelSize, this.Config.ColorSlotPanelFill, this.Config.AlphaSlotPanelFill, this.Config.SizeSlotPanelLine, this.Config.ColorSlotPanelLine, this.Config.AlphaSlotPanelLine);
        this._footer = new GoPanel(this.Renderer, this._footerId, this._panelSize, this._panelSize, this.Config.ColorSlotPanelFill, this.Config.AlphaSlotPanelFill, this.Config.SizeSlotPanelLine, this.Config.ColorSlotPanelLine, this.Config.AlphaSlotPanelLine);

        // balance text
        this._balanceText = new GoText(this.Renderer, this._balanceId, this.GetBalanceText(this.Config.BalanceStart-this.Config.BetMin), this.Config.TextFonts, this.Config.SizeSlotText, this.Config.ColorSlotText, this.Config.ColorSlotTextStroke, this.Config.SizeSlotTextStroke);
        this._balanceTextWidth = this._balanceText.TextWidth;
        this._balanceTextHeight = this._balanceText.TextHeight;

        // bet text
        this._betText = new GoText(this.Renderer, this._betId, this.GetBetText(this.Config.BetMin), this.Config.TextFonts, this.Config.SizeSlotText, this.Config.ColorSlotText, this.Config.ColorSlotTextStroke, this.Config.SizeSlotTextStroke);
        this._betTextWidth = this._betText.TextWidth;
        this._betTextHeight = this._betText.TextHeight;

        // winnings text
        this._winningsText = new GoText(this.Renderer, this._winningsId, this.GetWinningsText(0), this.Config.TextFonts, this.Config.SizeSlotText, this.Config.ColorSlotText, this.Config.ColorSlotTextStroke, this.Config.SizeSlotTextStroke);
        this._winningsTextWidth = this._winningsText.TextWidth;
        this._winningsTextHeight = this._winningsText.TextHeight;
        if (this._winningsText.GoContainer) this._winningsText.GoContainer.renderable = false;

        // labels
        this._playerText = new GoText(this.Renderer, this._playerId, this._playerId, this.Config.LabelFonts, this.Config.SizeLabelText, this.Config.ColorLabelText, this.Config.ColorLabelTextStroke, this.Config.SizeLabelTextStroke);
        this._houseText = new GoText(this.Renderer, this._houseId, this._houseId, this.Config.LabelFonts, this.Config.SizeLabelText, this.Config.ColorLabelText, this.Config.ColorLabelTextStroke, this.Config.SizeLabelTextStroke);

        // buttons
        this._spinButton = new GoButton(this.Renderer, this.Config.SpriteButtonSpin, this.Config.SpriteButtonSpin, spinHandler);
        this._exitButton = new GoButton(this.Renderer, this.Config.SpriteButtonClose, this.Config.SpriteButtonClose, exitHandler);
        this._infoButton = new GoButton(this.Renderer, this.Config.SpriteButtonInfo, this.Config.SpriteButtonInfo, infoHandler);
        this._plusButton = new GoButton(this.Renderer, this.Config.SpriteButtonPlus, this.Config.SpriteButtonPlus, () => { this.BetChangeHandler.apply(this, [1, betHandler]); });
        this._minusButton = new GoButton(this.Renderer, this.Config.SpriteButtonMinus, this.Config.SpriteButtonMinus, () => { this.BetChangeHandler.apply(this, [-1, betHandler]); });      
    }

    // public methods
    public StartSpin(): void {
        this._machinePlayer.StartSpin();
        this._machineHouse.StartSpin();
        this._versus.Hide();
        this._playerText.Hide();
        this._houseText.Hide();
        if (this._winningsText.GoContainer) {
            this._winningsText.GoContainer.renderable = false;
        }
    }

    public EndSpin(stopsPlayer: Array<number>, stopsHouse: Array<number>, callbackPerReel: (reel: number) => void, callback: () => void) {
        this._machinePlayer.EndSpin(stopsPlayer, callbackPerReel);
        this._machineHouse.EndSpin(stopsHouse, callbackPerReel);
        this._spinCallback = callback;
    }

    public SpinResults(winnings: number, winMatches: Array<[x: number, y: number]>, balance: number, bet: number): void {
        this._balanceText.Text = this.GetBalanceText(balance);
        this._betText.Text = this.GetBetText(bet);
        this._winningsText.Text = this.GetWinningsText(winnings);
        
        this._machinePlayer.ShowWinBoxes(winMatches, this.Config.SizeWinBoxLine, this.Config.ColorWinBoxLine, this.Config.ColorWinBox, this.Config.AlphaWinBox, true);
        this._machineHouse.ShowWinBoxes(winMatches, this.Config.SizeWinBoxLine, this.Config.ColorFailWinBoxLine, this.Config.ColorFailWinBox, this.Config.AlphaFailWinBox, false);
        if (this._winningsText.GoContainer) {
            this._winningsText.GoContainer.renderable = winnings > 0;
        }
        
        this.PositionBalanceText();
        if (balance <= 0 && bet <= 0) {
            this._spinButton.Disabled = true;
            this._plusButton.Disabled = true;
            this._minusButton.Disabled = true;
            this._gameOver = true;
        }
    }

    // abstract implementations
    public DisableInteraction(): void {
        this._infoButton.Disabled = true;
        this._exitButton.Disabled = true;
        this._spinButton.Disabled = true;
        this._plusButton.Disabled = true;
        this._minusButton.Disabled = true;
    }
    
    public EnableInteraction(): void {
        this._infoButton.Disabled = false;
        this._exitButton.Disabled = false;
        if (this._gameOver) return;
        this._spinButton.Disabled = false;
        this._plusButton.Disabled = false;
        this._minusButton.Disabled = false;
    }

    public UpdateLayout(scaleX: number, scaleY: number, canvasWidth: number, canvasHeight: number, portrait: boolean): void {
        const scale: number = portrait ? scaleY : scaleX;

        let offset: number;
        let xywh: [x: number, y:number, w:number, h:number];
        this._portrait = portrait;

        // info button
        offset = (this._panelSize - this._buttonSize) / 2;
        xywh = Manager.AnchorObjectRightBottom(canvasWidth, canvasHeight, this._buttonSize, this._buttonSize, scale, -offset, -offset);
        this._infoButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

        // minus button 
        xywh = Manager.AnchorObjectLeftTop(this._buttonSize, this._buttonSize, scale, offset, offset);
        this._minusButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

        // plus button
        const playOffsetX: number = offset + this._buttonSize + offset;
        xywh = Manager.AnchorObjectLeftTop(this._buttonSize, this._buttonSize, scale, playOffsetX, offset);
        this._plusButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

        // exit button
        xywh = Manager.AnchorObjectRightTop(canvasWidth, this._buttonSize, this._buttonSize, scale, -offset, offset);
        this._exitButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
        const exitButtonX = xywh[0];
        const exitButtonOffset = offset;

        // slot machines, spin button, panels, and text
        const w: number = this._machineWidth;
        const h: number = this._machineHeight;
        let xywhPlayer: [x: number, y:number, w:number, h:number];
        let xywhHouse: [x: number, y:number, w:number, h:number];

        if (portrait) {
            // spin button
            xywh = Manager.AnchorObjectLeftBottom(canvasHeight, this._spinButtonWidth, this._buttonSize, scale, offset, -offset);
            this._spinButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // panels
            const portraitPanelSize: number = (this._panelSize + this._balanceTextHeight + exitButtonOffset);
            const panelSizeScaled: number = portraitPanelSize * scale;
            this._header.Transform(0, 0, canvasWidth, panelSizeScaled);
            this._footer.Transform(0, canvasHeight - panelSizeScaled, canvasWidth, panelSizeScaled);

            // balance text
            offset = this._panelSize;
            xywh = Manager.AnchorObjectRightTop(canvasWidth, this._balanceTextWidth, this._balanceTextHeight, scale, -exitButtonOffset, offset);
            this._balanceText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // bet text
            xywh = Manager.AnchorObjectLeftTop(this._betTextWidth, this._betTextHeight, scale, exitButtonOffset, offset);
            this._betText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // winnings text
            const wVis: boolean = this.GetRenderable(this._winningsText);
            this.SetRenderable(this._winningsText, true);

            xywh = Manager.AnchorObjectLeftBottom(canvasHeight, this._winningsTextWidth, this._winningsTextHeight, scale, 0, -offset); 
            this._winningsText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
            this.SetRenderable(this._winningsText, wVis);
            
            // slot machines
            offset = h / 2 + this._machineOffsetPortrait;
            xywhPlayer = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, w, h, scale, 0, -offset);
            xywhHouse = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, w, h, scale, 0, offset);
        }
        else {
            // spin button
            offset = (this._panelSize - this._buttonSize) / 2;
            xywh = Manager.AnchorObjectCenterBottom(canvasWidth, canvasHeight, this._spinButtonWidth, this._buttonSize, scale, 0, -offset);
            this._spinButton.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // panels
            const panelSizeScaled: number = this._panelSize * scale;
            this._header.Transform(0, 0, canvasWidth, panelSizeScaled);
            this._footer.Transform(0, canvasHeight - panelSizeScaled, canvasWidth, panelSizeScaled);

            // balance text
            offset = (this._panelSize - this._balanceTextHeight) / 2;
            xywh = Manager.AnchorObjectRightTop(canvasWidth, this._balanceTextWidth, this._balanceTextHeight, scale, 0, offset);
            this._balanceText.Transform(exitButtonX-xywh[2], xywh[1], xywh[2], xywh[3]);

            // bet text
            const betOffsetX = offset + this._buttonSize + offset + this._buttonSize;
            offset = (this._panelSize - this._betTextHeight) / 2;
            xywh = Manager.AnchorObjectLeftTop(this._betTextWidth, this._betTextHeight, scale, betOffsetX, offset);
            this._betText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);

            // winnings text
            const wVis: boolean = this.GetRenderable(this._winningsText);
            this.SetRenderable(this._winningsText, true);

            offset = (this._panelSize - this._winningsTextHeight) / 2;
            xywh = Manager.AnchorObjectLeftBottom(canvasHeight, this._winningsTextWidth, this._winningsTextHeight, scale, 0, -offset); 
            this._winningsText.Transform(xywh[0], xywh[1], xywh[2], xywh[3]);
            this.SetRenderable(this._winningsText, wVis);

            // slot machines
            offset = w / 2 + this._machineOffsetLandscape;
            xywhPlayer = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, w, h, scale, -offset, 0);
            xywhHouse = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, w, h, scale, offset, 0);
        }

        const sSize: number = xywhPlayer[3] / this.Config.MachineRows;
        const mW: number = Math.floor(sSize) * this.Config.Reelset.length;
        const mH: number = Math.floor(sSize) * this.Config.MachineRows;
        this._machinePlayer.BorderWidth = this._machinePlayer.BorderWidthOriginal * scale;
        this._machinePlayer.Transform(Math.floor(xywhPlayer[0]), Math.floor(xywhPlayer[1]), mW, mH);

        this._machineHouse.BorderWidth = this._machineHouse.BorderWidthOriginal * scale;
        this._machineHouse.Transform(Math.floor(xywhHouse[0]), Math.floor(xywhHouse[1]), mW, mH);

        // labels
        const playerCenter = xywhPlayer[0] + xywhPlayer[2] / 2 - this._playerText.TextWidth * scale / 2;
        const playerMiddle = xywhPlayer[1] + xywhPlayer[3] / 2 - this._playerText.TextHeight * scale / 2;
        this._playerText.Transform(playerCenter, playerMiddle, this._playerText.TextWidth * scale, this._playerText.TextHeight * scale);

        const houseCenter = xywhHouse[0] + xywhHouse[2] / 2 - this._houseText.TextWidth * scale / 2;
        const houseMiddle = xywhHouse[1] + xywhHouse[3] / 2 - this._houseText.TextHeight * scale / 2;
        this._houseText.Transform(houseCenter, houseMiddle, this._playerText.TextWidth * scale, this._playerText.TextHeight * scale);

        // images
        xywh = Manager.AnchorObjectCenterMiddle(canvasWidth, canvasHeight, this._VersusSize, this._VersusSize, scale, 0, 0);
        this._versus.Transform(xywh[0], xywh[1], xywh[2], xywh[3]); 
    }
    
    public Update(deltaTime: number): void {
        this._machinePlayer.Update(deltaTime);
        this._machineHouse.Update(deltaTime);
        this._spinButton.Update(deltaTime);
        this._exitButton.Update(deltaTime);
        this._infoButton.Update(deltaTime);
        this._balanceText.Update(deltaTime);
        this._betText.Update(deltaTime);
        this._winningsText.Update(deltaTime);
        this._plusButton.Update(deltaTime);
        this._minusButton.Update(deltaTime);
        this._header.Update(deltaTime);
        this._footer.Update(deltaTime);
        this._versus.Update(deltaTime);
        this._playerText.Update(deltaTime);
        this._houseText.Update(deltaTime);
        
        if (!this._spinCallback) return;
        if (!this.IsSpinning) {
            this._spinCallback();
            this._spinCallback = undefined;
        }
    }

    public Dispose(): void {
        this._machinePlayer.Dispose();
        this._machineHouse.Dispose();
        this._spinButton.Dispose();
        this._exitButton.Dispose();
        this._infoButton.Dispose();
        this._balanceText.Dispose();
        this._betText.Dispose();
        this._winningsText.Dispose();
        this._plusButton.Dispose();
        this._minusButton.Dispose();
        this._header.Dispose();
        this._footer.Dispose();
        this._versus.Dispose();
        this._playerText.Dispose();
        this._houseText.Dispose();
    }

    // handlers 
    private BetChangeHandler(direction: number, handler: (direction: number) => [bet: number, balance: number]): void {
        const newBetBalance: [bet: number, balance: number] = handler(direction);
        this._betText.Text = this.GetBetText(newBetBalance[0]);
        this._balanceText.Text = this.GetBalanceText(newBetBalance[1]);
        this.PositionBalanceText();
    }

    // helpers
    private PositionBalanceText(): void {
        if (!this._balanceText.GoContainer || !this._exitButton.GoContainer) return;
        if (this._portrait) {
            this._balanceText.GoContainer.x = this._exitButton.GoContainer.x + this._exitButton.GoContainer.width - this._balanceText.GoContainer.width;   
        } else {
            this._balanceText.GoContainer.x = this._exitButton.GoContainer.x - this._balanceText.GoContainer.width;
        }
    }

    private FormatFunds(value: number): string {
        return Math.floor(value).toLocaleString();
    }

    private GetRenderable(object: GameObject): boolean {
        return object.GoContainer ? object.GoContainer.renderable : false;
    }

    private SetRenderable(object: GameObject, value: boolean): void {
         if(!object.GoContainer) return;
        object.GoContainer.renderable = value;
    }

    private GetBalanceText(value: number): string {
        return `  ${this.Config.TextBalance}${this.FormatFunds(value)} `;
    }

    private GetBetText(value: number): string {
        return ` ${this.Config.TextBet}${this.FormatFunds(value)}  `;
    }

    private GetWinningsText(value: number): string {
        return ` ${this.Config.TextWinnings}${this.FormatFunds(value)}  `;
    }
}
