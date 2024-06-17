import Component from "../Abstracts/Component";
import IGoContainer from "../Interfaces/IGoContainer";
import IRenderer from "../Interfaces/IRenderer";

// display the slot machine
export default class CompReel extends Component {
    // constants
    private readonly _minSpinFrames: number = 180;
    private readonly _spinVelocityStart: number = 0.01;
    private readonly _spinVelocityInc: number = 0.01;
    private readonly _spinVelocityMax: number = 0.5;
    private readonly _spinBounceMax: number = 0.025;
    private readonly _bounceFrames: number = 15;

    // private members
    private readonly _maskId: string;
    private readonly _symbolData: Map<string, string>;
    private readonly _reelData: Array<string>;
    private readonly _mask: IGoContainer;
    private readonly _symbols: Array<IGoContainer>;
    private _endCallback?: () => void;
    private _endingSpin: boolean;
    private _spinVelocity: number;
    private _spinFrames: number;
    private _bounce: boolean;  
    private _stopIndex: number;
    private _visibleSymbols: number;
    private _maskWidth: number;
    private _maskHeight: number;
    
    // public properties
    public get IsSpinning(): boolean { 
        return this._spinVelocity > 0; 
    }
    public get IsEnding(): boolean { 
        return this._endingSpin; 
    }
    public set StopIndex(value: number) {
        this._stopIndex = value;
    }

    // initialization
    public constructor(renderer: IRenderer, id: string, reelData: Array<string>, symbolsData: Map<string, string>, stopIndex: number, width: number, height: number) {
        super(renderer, id);
        
        this._maskId = id;
        this._symbols = new Array<IGoContainer>();
        this._reelData = reelData.concat(reelData); // double the symbols for infinite scrolling
        this._symbolData = symbolsData;
        this._stopIndex = stopIndex;
        this._spinVelocity = 0;
        this._spinFrames = 0;
        this._bounce = false;
        this._endingSpin = false;
        this._maskWidth = width;
        this._maskHeight = height;
        this._endCallback = undefined;
        
        this._visibleSymbols = Math.ceil(height / width);
        this._mask = this.Renderer.StageMask(this._maskId, 0, 0, width, height);
        
        this.PopulateSymbols();
        this.PlaceSymbols(this._stopIndex);
    }
    
    // abstract implementations
    public Update(deltaTime: number): void {
        const symSize: number = this.GetSymbolSize(); 
        this.Bounce(deltaTime, symSize);

        if (this._spinVelocity === 0) return;

        this._spinFrames++;
        const stopSymbol: IGoContainer = this._symbols[this._stopIndex];
        const stopEntering = stopSymbol.y <= 0;

        this._spinVelocity += this._spinVelocityInc * deltaTime; 
        if (this._spinVelocity > this._spinVelocityMax) {
            this._spinVelocity = this._spinVelocityMax;
        }
 
        let change: number = symSize * this._spinVelocity * deltaTime;
        let diff = stopSymbol.y < 0 ? Math.abs(stopSymbol.y) : change;
        this.MoveSymbols(change < diff ? change : diff, symSize);

        const stopEntered = stopSymbol.y >= 0;
        if (stopEntering && stopEntered) {
            if (this._spinFrames > this._minSpinFrames && this._endingSpin) {
                this._spinVelocity = 0;
                this._spinFrames = 0;
                this._endingSpin = false;
                this.PlaceSymbols(this._stopIndex);
                if (this._endCallback) { 
                    this._endCallback(); 
                }
                this._bounce = true;
            }
        }
    }

    public Transform(x: number, y: number, width: number, height: number): void {
        this._maskWidth = width;
        this._maskHeight = height;
        this.Renderer.MoveMask(this._maskId, x, y, width, height);
        this.PlaceSymbols(this._stopIndex);
    }

    public Dispose(): void {
        this.Renderer.Remove(this._maskId);
    }

    // public methods 
    public StartSpin(): void {
        if (this._endingSpin) return;
        this._spinVelocity = this._spinVelocityStart;
        this._spinFrames = 0;
    }

    public EndSpin(stop: number, callback: () => void): void { 
        if (this._endingSpin) return;
        this._stopIndex = stop;
        this._endingSpin = true;
        this._endCallback = callback;
    }

    // helpers
    private GetSymbolSize(): number {
        return this._maskWidth; 
    }

    private GetSymbolsMinY(): number {
        let pos:number = this._symbols[0].y;
        this._symbols.forEach((container) => {
            if (container.y < pos) pos = container.y;
        }); 
        return pos;
    }

    private PopulateSymbols(): void {
        this._reelData.forEach((symbolId) => {
            const symbolAsset = this._symbolData.get(symbolId);
            if (symbolAsset) {
                const container: IGoContainer | undefined = this.Renderer.NestSprite(symbolAsset, this._maskId);
                if (container) this._symbols.push(container);
            }
        });
    }

    private PlaceSymbols(stop: number): void {
        const symSize: number = this.GetSymbolSize();  
        const stopOffset: number = stop * symSize * -1; 
        // placement starts at stopOffset 
        this._symbols.forEach((container, index) => { 
            container.width = symSize;
            container.height = symSize;
            container.x = 0;
            container.y = stopOffset + symSize * index;
        });
        this.MoveSymbols(0, symSize);
    }

    private MoveSymbols(change: number, symSize: number): void {
        const edgeBottom = this._maskHeight + symSize * this._visibleSymbols;
        const minPosY = this.GetSymbolsMinY();
        this._symbols.forEach((container) => { 
            container.y += change; 
            if (container.y > edgeBottom) {
                container.y = minPosY - symSize + change;
            }
        });
    }

    private Bounce(deltaTime: number, symSize: number): void {
        if (!this._bounce) return;

        this._spinFrames++;
        if (this._spinFrames >= this._bounceFrames) {
            this._bounce = false;
            this._spinFrames = 0;
            if (this._symbols[this._stopIndex].y !== 0) {
                this.MoveSymbols(-this._symbols[this._stopIndex].y, symSize);
            }
            return;
        }

        const bounceDirection = Math.random() >= 0.5 ? -1 : 1;
        const bounce = symSize * Math.random() * this._spinBounceMax * bounceDirection * deltaTime;
        this.MoveSymbols(bounce, symSize);
    }
}
