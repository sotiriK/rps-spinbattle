import IGameController from '../Interfaces/IGameController';
import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import IAudio from "../Interfaces/IAudio";
import ISlotEngine from '../Interfaces/ISlotEngine';
import ILogger from '../Interfaces/ILogger';
import ViewMenu from '../Aritifacts/ViewMenu';
import ViewBack from '../Aritifacts/ViewBack';
import ViewGame from '../Aritifacts/ViewGame';
import Manager from '../Abstracts/Manager';
import ViewInfo from '../Aritifacts/ViewInfo';

// controls game flow
export default class GameController implements IGameController {
    // private memebers
    private _background?: ViewBack;
    private _menuView?: ViewMenu;
    private _slotView?: ViewGame;
    private _infoView?: ViewInfo;
    private _betAmount: number;

    // dependencies
    public readonly Config: IConfig;
    public readonly Renderer: IRenderer;
    public readonly Audio: IAudio;
    public readonly Engine: ISlotEngine;
    public readonly Logger: ILogger;

    // initialization
    public constructor(config: IConfig, renderer: IRenderer, audio: IAudio, slotEngine: ISlotEngine, logger: ILogger) {
        this.Config = config;
        this.Renderer = renderer;
        this.Audio = audio;
        this.Engine = slotEngine;
        this.Logger = logger;
        this._betAmount = this.Config.BetMin;
    }

    // interface implementations
    public async Start(): Promise<void> {
        await this.Renderer.Initialize(this.Config.ColorBackground).catch((error) => {
            this.Logger.error(`Failed to Initialize renderer: ${error}`);
        });
        await this.Renderer.LoadSprites(this.Config.AllSprites).catch((error) => {
            this.Logger.error(`Failed to load sprite assets: ${error}`);
        });
        await this.Engine.Initialize(this.Config.DefaultUserId).catch((error) => {
            this.Logger.error(`Failed to initioalize slot engine: ${error}`);
        });

        this._background = new ViewBack(this.Config, this.Renderer);
        this._menuView = new ViewMenu(this.Config, this.Renderer, this.PlayRequest.bind(this));
        this.Resize();

        this.Renderer.SetTicker(this.Config.MaxFps, this.Update.bind(this));
        window.onresize = this.Resize.bind(this);
        window.onfocus = this.Focus.bind(this);
    }

    public Update(deltaTime: number): void {
        const objs: Array<Manager | undefined> = [this._background, this._menuView, this._slotView, this._infoView];
        for (const obj of objs) {
            if (!obj) continue;
            obj.Update(deltaTime);
        }
    }

    public Resize(): void {
        const wwidth: number = window.innerWidth;
        const wheight: number = window.innerHeight;
        const portrait: boolean = wwidth < wheight;

        let minW: number, minH: number, sFactor: number;
        if (portrait) {
            minW = this.Config.MinWidthPortrait;
            minH = this.Config.MinHeightPortrait;
            sFactor = this.Config.PortraitScaleFactor;
        }
        else {
            minW = this.Config.MinWidthLandscape;
            minH = this.Config.MinHeightLandscape;
            sFactor = 1.0;
        }

        const cwidth: number = wwidth < minW ? minW : wwidth;
        const cheight: number = wheight < minH ? minH : wheight;
        const scaleX: number = (cwidth / this.Config.ReferenceWidth) * sFactor;
        const scaleY: number = (cheight / this.Config.ReferenceHeight) * sFactor;

        const objs: Array<Manager | undefined> = [this._background, this._menuView, this._slotView, this._infoView];
        for (const obj of objs) {
            if (!obj) continue;
            obj.UpdateLayout(scaleX, scaleY, cwidth, cheight, portrait);
        }
    }

    public Focus(): void {
        if (!this._slotView) return;
        if (!this._slotView.IsSpinning) {
            this.Audio.Stop(this.Config.AudioSpinLoop);
        }
    }

    // helpers
    private ProcessSpinResults(stopsPlayer: Array<number>, stopsHouse: Array<number>) {
        // get qualified matches
        let winMatches: Array<[x: number, y: number]>; 
        winMatches = this.Engine.GetWinMatches();
        
        // winnings
        let winnings: number;
        winnings = this.Engine.GetWinnings(this._betAmount);

        // balance
        let newBalance: number = this.Engine.GetUserBalance();
        if (this._betAmount <= newBalance) {
            newBalance -= this._betAmount;
        } 
        else {
            this._betAmount = newBalance;
            newBalance = 0;
            if (this._betAmount < 0) {
                this._betAmount = 0;
            }
        }

        // logging
        this.Logger.log(`Win matches: ${winMatches.length}`);
        this.Logger.log(`Bet: ${this._betAmount}`);
        this.Logger.log(`Player winnings: ${winnings}`);
        
        // audio
        if (winnings > 0) {
            this.Audio.Play(this.Config.AudioWinner);
            this.Audio.Play(this.Config.AudioSpinWon);
        }
        else {
            this.Audio.Play(this.Config.AudioSpinLost);
        }

        // display
        if (!this._slotView) return; 
        this._slotView.SpinResults(winnings, winMatches, newBalance, this._betAmount); 
    }

    // handlers
    private PlayRequest(): void {
        if (this._menuView) this._menuView.DisableInteraction();
        this.Audio.LoadSounds(this.Config.AllAudio).then(this.Play.bind(this)).catch((error) => {
            this.Logger.error(`Failed to load audio assets: ${error}`);
        }); 
    }

    private SpinRequest(): void {
        if (!this._slotView) return;

        this._slotView.StartSpin();
        this._slotView.DisableInteraction();
        this.Audio.PlayLoop(this.Config.AudioSpinLoop);
        
        this.Engine.GenerateStops().then((stops: Array<number>) => {
            if (!this._slotView) return; 
            
            this.Logger.log(`Generated stops: ${stops}`);
            const playerStops: Array<number> = stops.splice(0, this.Config.Reelset.length);
            const houseStops: Array<number> = stops;
            this._slotView.EndSpin(playerStops, stops, (reel) => this.SpinReelComplete.call(this, reel), () => this.SpinComplete.call(this, playerStops, houseStops));
        }).catch((error) => {
            this.Logger.error(`Failed to generate stops: ${error}`);
        });
    }

    private Play(): void {
        if (!this._menuView) return; 
        this._menuView.Dispose();
        this._menuView = undefined;

        this._betAmount = this.Config.BetMin;
        this.Audio.Play(this.Config.AudioTransition);
        this._slotView = new ViewGame(this.Config, this.Renderer, this.SpinRequest.bind(this), this.Return.bind(this), this.Info.bind(this), this.BetChange.bind(this));
        this.Resize();

        if (!this._background) return;
        this._background.EnableInteraction();
    }

    private Return(): void {
        if (!this._slotView) return; 
        this._slotView.Dispose();
        this._slotView = undefined;
        this.Engine.Reset(); 

        this.Audio.Stop(this.Config.AudioSpinLoop);
        this.Audio.Play(this.Config.AudioTransition);
        this._menuView = new ViewMenu(this.Config, this.Renderer, this.PlayRequest.bind(this));
        this.Resize();

        if (!this._background) return;
        this._background.EnableInteraction();
    }

    private Info(): void {
        this.Audio.Play(this.Config.AudioClick);
        if (this._slotView) {
            this._slotView.DisableInteraction();
        }
        this._infoView = new ViewInfo(this.Config, this.Renderer, this.Engine.SetGaffe.bind(this.Engine), () => {
            if (!this._infoView) return;
            this._infoView.Dispose();
            this._infoView = undefined;
            if (this._slotView) {
                this._slotView.EnableInteraction();
                this.Audio.Play(this.Config.AudioClick);
            }
        });
        this.Resize();
    }

    private BetChange(direction: number): [bet: number, balance: number] {
        if (direction > 0) {
            const newBet: number = this._betAmount + this.Config.BetIncrement;
            const newBalance: number = this.Engine.GetUserBalance() - newBet;
            if (newBet <= this.Config.BetMax && newBalance >= 0) { this._betAmount = newBet; }
        } 
        else {
            const newBet: number = this._betAmount - this.Config.BetIncrement;
            if (newBet >= this.Config.BetMin) { this._betAmount = newBet; }
        }
        this.Audio.Play(this.Config.AudioClick);
        return [this._betAmount, this.Engine.GetUserBalance()  - this._betAmount];
    }

    private SpinComplete(playerStops: Array<number>, stops: Array<number>): void {
        this.Audio.Stop(this.Config.AudioSpinLoop);
        this.ProcessSpinResults(playerStops, stops);
        if (!this._slotView) return; 
        this._slotView.EnableInteraction();
    }

    private SpinReelComplete(reel: number): void {
        this.Audio.Play(this.Config.AudioStop);
    }
}
