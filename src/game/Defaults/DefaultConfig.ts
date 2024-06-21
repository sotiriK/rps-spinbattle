import IConfig from "../Interfaces/IConfig";

// game configuration 
export default class DefaultConfig implements IConfig {
    // constants
    private readonly _sprites: string = './game/Sprites/';
    private readonly _sound: string = './game/Sound/';

    // interface implementations
    public readonly MaxFps: number = 60;
    public readonly ReferenceWidth: number = 1920;
    public readonly ReferenceHeight: number = 1080;
    public readonly MinWidthLandscape: number = 320;
    public readonly MinHeightLandscape: number = 240;
    public readonly MinWidthPortrait: number = 240;
    public readonly MinHeightPortrait: number = 320;
    public readonly PortraitScaleFactor: number = 0.75;
    public readonly BalanceStart: number = 10000;
    public readonly BetMin: number = 5;
    public readonly BetMax: number = 1000;
    public readonly BetIncrement: number = 5;
    public readonly DefaultUserId: number = 0;

    public readonly TextBalance: string = "$";
    public readonly TextBet: string = "$";
    public readonly TextWinnings: string = "+ $";
    public readonly TextFonts: Array<string> = ['Brush Script MT', 'Georgia', 'Arial'];
    public readonly LabelFonts: Array<string> = ['Arial Black', 'Arial'];

    public readonly SizeLabelText: number = 80;
    public readonly SizeLabelTextStroke: number = 16;
    public readonly SizeSlotText: number = 58;
    public readonly SizeSlotTextStroke: number = 6;
    public readonly SizeSlotPanelLine: number = 6;
    public readonly SizeWinBoxLine: number = 2;

    public readonly ColorFailWinBoxLine: number = 0x000000;
    public readonly ColorFailWinBox: number = 0x000000;
    public readonly ColorWinBoxLine: number = 0x000000;
    public readonly ColorWinBox: number = 0xff0000;
    public readonly ColorLabelText: number = 0xff0000;
    public readonly ColorLabelTextStroke: number = 0x000000;
    public readonly ColorSlotText: number = 0x000000;
    public readonly ColorSlotTextStroke: number = 0xffffff;
    public readonly ColorBackground: number = 0xffffff;
    public readonly ColorSlotPanelFill: number = 0xff0000;
    public readonly ColorSlotPanelLine: number = 0xffffff;

    public readonly AlphaWinBox: number = 0.5;
    public readonly AlphaFailWinBox: number = 0.2;
    public readonly AlphaSlotPanelFill: number = 0.25;
    public readonly AlphaSlotPanelLine: number = 1;

    public readonly SpriteBackTile: string = `${this._sprites}Back.png`;
    public readonly SpriteTitle: string = `${this._sprites}Title.png`;
    public readonly SpriteVersus: string = `${this._sprites}Versus.png`;
    public readonly SpriteSymbolRock: string = `${this._sprites}Rock.png`;
    public readonly SpriteSymbolPaper: string = `${this._sprites}Paper.png`;
    public readonly SpriteSymbolScissors: string = `${this._sprites}Scissors.png`;
    public readonly SpriteButtonInfo: string = `${this._sprites}Info.png`;
    public readonly SpriteButtonClose: string = `${this._sprites}Close.png`;
    public readonly SpriteButtonSpin: string = `${this._sprites}Spin.png`;
    public readonly SpriteButtonPlay: string = `${this._sprites}Play.png`;
    public readonly SpriteButtonPlus: string = `${this._sprites}Plus.png`;
    public readonly SpriteButtonMinus: string = `${this._sprites}Minus.png`;
    public readonly SpriteButtonUp: string = `${this._sprites}Up.png`;
    public readonly SpriteButtonDown: string = `${this._sprites}Down.png`;
    public readonly SpriteButtonLeft: string = `${this._sprites}Left.png`;
    public readonly SpriteButtonRight: string = `${this._sprites}Right.png`;
    public readonly SpriteButtonZero: string = `${this._sprites}Zero.png`;
    public readonly SpriteButtonRandom: string = `${this._sprites}Random.png`;
    public readonly AllSprites: Array<string> = [
        this.SpriteBackTile,
        this.SpriteTitle,
        this.SpriteVersus,
        this.SpriteSymbolRock,
        this.SpriteSymbolPaper,
        this.SpriteSymbolScissors,
        this.SpriteButtonInfo,
        this.SpriteButtonClose,
        this.SpriteButtonSpin,
        this.SpriteButtonPlay,
        this.SpriteButtonPlus,
        this.SpriteButtonMinus,
        this.SpriteButtonUp,
        this.SpriteButtonDown,
        this.SpriteButtonLeft,
        this.SpriteButtonRight,
        this.SpriteButtonZero,
        this.SpriteButtonRandom
    ];

    public readonly AudioTransition: string = `${this._sound}Transition.mp3`;
    public readonly AudioWinner: string = `${this._sound}Winner.mp3`;
    public readonly AudioSpinWon: string = `${this._sound}SpinWon.mp3`;
    public readonly AudioSpinLost: string = `${this._sound}SpinLost.mp3`;
    public readonly AudioClick: string = `${this._sound}Click.mp3`;
    public readonly AudioSpinLoop: string = `${this._sound}SpinLoop.mp3`;
    public readonly AudioStop: string = `${this._sound}Stop.mp3`;
    public readonly AllAudio: Array<string> = [
        this.AudioTransition,
        this.AudioWinner,
        this.AudioSpinWon,
        this.AudioSpinLost,
        this.AudioClick,
        this.AudioSpinLoop,
        this.AudioStop
    ];

    public readonly R: string = 'R';
    public readonly P: string = 'P';
    public readonly S: string = 'S';
    public readonly SymbolAssets: Map<string, string> = new Map<string, string>([
        [this.R, this.SpriteSymbolRock],
        [this.P, this.SpriteSymbolPaper],
        [this.S, this.SpriteSymbolScissors]
    ]);

    public readonly MachineRows: number = 3;
    public readonly Reelset: Array<Array<string>> = [
        ['R','P','S','R','P','S','R','P','S','R','R','P','S','R','P','S','R','P','S','R','R','P','S','R','P','S','R','P','S','R'],
        ['P','S','R','P','S','R','P','S','R','P','P','S','R','P','S','R','P','S','R','P','P','S','R','P','S','R','P','S','R','P'],
        ['S','R','P','S','R','P','S','R','P','S','S','R','P','S','R','P','S','R','P','S','S','R','P','S','R','P','S','R','P','S'],
        ['P','S','R','P','S','R','P','S','R','P','P','S','R','P','S','R','P','S','R','P','P','S','R','P','S','R','P','S','R','P'],
        ['R','P','S','R','P','S','R','P','S','R','R','P','S','R','P','S','R','P','S','R','R','P','S','R','P','S','R','P','S','R']
    ];

    public readonly InitialPlayerStops: Array<number> = [12, 17, 18, 20, 6];
    public readonly InitialHouseStops: Array<number> = [8, 10, 12, 23, 15];

    // no Paylines, for each win above WinMatchMin bet multiplier increases by BetMultiplierIncrease
    // for example 4 matches = BetMultiplier, 5 matches = BetMultiplier + BetMultiplierInc, etc.
    public readonly WinMatchMin: number = 4;
    public readonly BetMultiplier = 2;
    public readonly BetMultiplierInc = 2;
    public readonly Combinations: Map<string, string> = new Map([
        ['R', 'S'],
        ['P', 'R'],
        ['S', 'P']
    ]);

    public readonly DescTextFonts: Array<string> = ['Courier New', 'Arial'];
    public readonly DescTextSize: number = 34;
    public readonly DescTextColor: number = 0x000000;
    public readonly DescTextStrokeColor: number = 0xaaaaaa;
    public readonly DescTextStrokeSize: number = 2;
    public readonly GameDescription: string = `RULES:
    - Select your bet amount
    - Press the spin button
    - Match symbols to win
    - A match is when player beats the house
        - Rock beats Scissors
        - Paper beats Rock
        - Scissors beats Paper
    - ${this.WinMatchMin} or more matches wins
    - Each match increases bet multiplier by ${this.BetMultiplier}
        - ${this.WinMatchMin} matches has a bet bultiplier of ${this.BetMultiplier}
        - ${this.WinMatchMin+1} matches has a bet bultiplier of ${this.BetMultiplier*2}
        - ${this.WinMatchMin+2} matches has a bet bultiplier of ${this.BetMultiplier*3}
        - Etc...
    - Bet multiplier resets on each spin
    - Have fun and good luck!`;
}
