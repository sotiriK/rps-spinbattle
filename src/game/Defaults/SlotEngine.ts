import IConfig from "../Interfaces/IConfig";
import ISlotEngine from "../Interfaces/ISlotEngine";

// simple implamentation of a slot engine
export default class SlotEngine implements ISlotEngine {
    // private members 
    private _gaffe: Array<number>;
    private _reelset: Array<Array<string>>;
    private _combinations: Map<string, string>;
    private _generatedStops: Array<number>;
    private _winMatches: Array<[x:number, y:number]>;
    private _userId: number;
    private _balance: number;  
    private _multiplier: number;
    private _multiplierInc: number;  
    private _winMatchMin: number;  

    // dependencies
    public readonly Config: IConfig;

    // initialization
    public constructor(config: IConfig) {
        this.Config = config;
        this._userId = 0;
        this._multiplier = 0;
        this._multiplierInc = 0;
        this._winMatchMin = 0;
        this._balance = 0;
        this._gaffe = new Array<number>();
        this._reelset = new Array<Array<string>>();
        this._combinations = new Map<string, string>();
        this._generatedStops = new Array<number>();
        this._winMatches = new Array<[x:number, y:number]>();
    }

    // interface implementations
    public GetUserId(): number {
        return this._userId;
    }

    public GetUserBalance(): number {
        return this._balance;
    }
    
    public SetGaffe(values:Array<number>): void {
        this._gaffe = values;
    }

    public async Initialize (userId: number): Promise<boolean> { 
        return new Promise<boolean>((resolve, reject) => {
            try {
                this._userId = userId;
                this._balance = this.Config.BalanceStart;
                this._combinations = this.Config.Combinations;
                this._reelset = this.Config.Reelset.concat(this.Config.Reelset);
                this._multiplier = this.Config.BetMultiplier;
                this._multiplierInc = this.Config.BetMultiplierInc;
                this._winMatchMin = this.Config.WinMatchMin;
                resolve(true);
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    public Reset(): void {
        this._balance = this.Config.BalanceStart;
    }

    public async GenerateStops(): Promise<Array<number>> {
        return new Promise<Array<number>>((resolve, reject) => {
            try {
                const stops: Array<number> = new Array<number>();
                this._reelset.forEach((reel) => {
                    const stop: number | undefined = this._gaffe.shift();
                    stops.push(stop !== undefined ? stop % reel.length : Math.floor(Math.random() * reel.length));
                });
                this._generatedStops = stops;
                resolve(Object.assign([], stops));
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    public GetWinMatches(): Array<[x:number, y:number]> {
        if (this._generatedStops.length === 0) {
            return new Array<[x:number, y:number]>();
        }        
        const winBoxes = new Array<[x:number, y:number]>();
        const arSize = Math.floor(this._generatedStops.length / 2);
        const checkStops: Array<number> = this._generatedStops.splice(0, arSize);
        const vsStops: Array<number> = this._generatedStops;
        const reelset: Array<Array<string>> = this._reelset;

        checkStops.forEach((stop, index) => {
            for (let r: number = 0; r < this.Config.MachineRows; r++) {
                const checkStop: number = stop + r;
                const vsStop: number = vsStops[index] + r;

                const checkIndex: number = checkStop % reelset[index].length;
                const checkSym: string = reelset[index][checkIndex];
                const vsIndex: number = vsStop % reelset[index].length;
                const vsSym: string = reelset[index][vsIndex];

                if (this._combinations.has(checkSym) && this._combinations.get(checkSym) === vsSym) {
                    winBoxes.push([index, r]);
                }
            }
        });
        this._winMatches = winBoxes;
        return Object.assign([], winBoxes);
    }

    public GetWinnings(betAmount: number): number {
        let winnings: number = 0;
        let betMultiplier: number = 0;
        if (this._winMatches.length >= this._winMatchMin) {
            betMultiplier = this._multiplier + (this._multiplierInc * (this._winMatches.length-this._winMatchMin));
            winnings = betAmount * betMultiplier;
        }

        this._balance = this._balance + winnings - betAmount;
        return winnings;
    }
}
