
export default interface IConfig {
    readonly MaxFps: number;
    readonly ReferenceWidth: number;
    readonly ReferenceHeight: number;
    readonly MinWidthLandscape: number;
    readonly MinHeightLandscape: number;
    readonly MinWidthPortrait: number;
    readonly MinHeightPortrait: number;
    readonly BalanceStart: number;
    readonly BetMin: number;
    readonly BetMax: number;
    readonly BetIncrement: number;
    readonly DefaultUserId: number;

    readonly TextBalance: string;
    readonly TextBet: string;
    readonly TextWinnings: string;
    readonly TextFonts: Array<string>;
    readonly LabelFonts: Array<string>;

    readonly SizeLabelText: number;
    readonly SizeLabelTextStroke: number;
    readonly SizeSlotText: number;
    readonly SizeSlotTextStroke: number;
    readonly SizeSlotPanelLine: number;
    readonly SizeWinBoxLine: number;

    readonly ColorFailWinBoxLine: number;
    readonly ColorFailWinBox: number;
    readonly ColorWinBoxLine: number;
    readonly ColorWinBox: number;
    readonly ColorLabelText: number;
    readonly ColorLabelTextStroke: number;
    readonly ColorSlotText: number;
    readonly ColorSlotTextStroke: number;
    readonly ColorBackground: number;
    readonly ColorSlotPanelFill: number;
    readonly ColorSlotPanelLine: number;

    readonly AlphaWinBox: number;
    readonly AlphaFailWinBox: number;
    readonly AlphaSlotPanelFill: number;
    readonly AlphaSlotPanelLine: number;
    
    readonly SpriteBackTile: string;
    readonly SpriteTitle: string;
    readonly SpriteVersus: string; 
    readonly SpriteSymbolRock: string;
    readonly SpriteSymbolPaper: string;
    readonly SpriteSymbolScissors: string;
    readonly SpriteButtonInfo: string;
    readonly SpriteButtonClose: string;
    readonly SpriteButtonSpin: string;
    readonly SpriteButtonPlay: string;
    readonly SpriteButtonPlus: string;
    readonly SpriteButtonMinus: string;
    readonly SpriteButtonUp: string;
    readonly SpriteButtonDown: string;
    readonly SpriteButtonLeft: string;
    readonly SpriteButtonRight: string;
    readonly SpriteButtonZero: string;
    readonly SpriteButtonRandom: string;
    readonly AllSprites: Array<string>;

    readonly AudioTransition: string;
    readonly AudioWinner: string;
    readonly AudioSpinWon: string;
    readonly AudioSpinLost: string;
    readonly AudioClick: string;
    readonly AudioSpinLoop: string;
    readonly AudioStop: string;
    readonly AllAudio: Array<string>;

    readonly R: string;
    readonly P: string;
    readonly S: string;
    readonly SymbolAssets: Map<string, string>;

    readonly MachineRows: number;
    readonly Reelset: Array<Array<string>>;

    readonly InitialPlayerStops: Array<number>;
    readonly InitialHouseStops: Array<number>;

    readonly WinMatchMin: number;
    readonly BetMultiplier: number;
    readonly BetMultiplierInc: number;
    readonly Combinations: Map<string, string>;

    readonly DescTextFonts: Array<string>;
    readonly DescTextSize: number;
    readonly DescTextColor: number;
    readonly DescTextStrokeColor: number;
    readonly DescTextStrokeSize: number;
    readonly GameDescription: string;
}
