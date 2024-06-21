import * as PIXI from 'pixi.js';
import IRenderer from '../Interfaces/IRenderer';
import IGoContainer from '../Interfaces/IGoContainer';

// renderer interface implementation
export default class PIXIRenderer implements IRenderer {
    // private members 
    private _application: PIXI.Application;
    private _containers: Map<string, PIXI.Container>; 
    private _tickerCallback?: (ticker: PIXI.Ticker) => void;
    private _zIndex: number;

    // initialization
    public constructor() {
        this._application = new PIXI.Application();
        this._containers = new Map<string, PIXI.Container>();
        this._tickerCallback = undefined;
        this._zIndex = 0;
    }

    // interface implementations
    public async Initialize(color: number): Promise<void> {
        await this._application.init({ 
            backgroundColor: color,
            width: window.innerWidth,
            height: window.innerHeight,
            resizeTo: window 
        });
        document.body.appendChild(this._application.canvas);
    }

    public async LoadSprites(sprites: Array<string>): Promise<void> {
        for (const name of sprites) {
            await PIXI.Assets.load<PIXI.Sprite>(name);            
        }
    }

    public SetTicker(maxFps: number, callback: (deltaTime: number) => void): void {
        this._application.ticker.maxFPS = maxFps;
        if (this._tickerCallback !== undefined) {
            this._application.ticker.remove(this._tickerCallback);
        }    
        this._tickerCallback = (ticker: PIXI.Ticker) => {
            callback(ticker.deltaTime);
        };
        this._application.ticker.add(this._tickerCallback);
    }

    public StageSprite(id: string, asset: string): IGoContainer {
        const sprite: PIXI.Sprite = PIXI.Sprite.from(asset);
        const container: PIXI.Container = this._application.stage.addChild(sprite);
        
        container.zIndex = this.GetIndex();
        this._containers.set(id, container);
        return container;
    }

    public StageSpriteRepeat(id: string, asset: string, width: number, height: number): IGoContainer {
        const texture: PIXI.Texture = PIXI.Texture.from(asset);
        const sprite = new PIXI.TilingSprite({texture, width: width, height: height});
        const container: PIXI.Container = this._application.stage.addChild(sprite);

        container.zIndex = this.GetIndex();
        this._containers.set(id, container);
        return container;
    }

    public StageSpriteButton(id: string, asset: string, handler: () => void): IGoContainer {
        const sprite: PIXI.Sprite = PIXI.Sprite.from(asset);
        const container: PIXI.Container = this._application.stage.addChild(sprite);
        this._containers.set(id, container);
        
        container.zIndex = this.GetIndex();
        container.interactive = true;
        sprite.on('pointerdown', handler);
        return container;
    }

    public StageRectangle(id: string, width: number, height: number, color: number, alpha: number): IGoContainer {
        const holder: PIXI.Container = new PIXI.Container(); 
        const graphics: PIXI.Graphics = new PIXI.Graphics(); 
        graphics.rect(0, 0, width, height).fill({color:color, alpha:alpha}); 
        holder.addChild(graphics);

        const container: PIXI.Container = this._application.stage.addChild(holder);
        this._containers.set(id, container);
        container.zIndex = this.GetIndex();
        return container;
    }

    public StageFrame(id: string, width: number, height: number, thickness: number, color: number, alpha: number): IGoContainer {
        const graphics: PIXI.Graphics = new PIXI.Graphics(); 
        graphics.rect(0, 0, width, height).stroke({ width: thickness, color: color, alpha: alpha }); 

        const container: PIXI.Container = this._application.stage.addChild(graphics);
        this._containers.set(id, container);
        container.zIndex = this.GetIndex();
        return container;
    }

    public StageText(id: string, text: string, fonts: Array<string>, size: number, color: number, strokeColor: number, strokeSize: number, bold: boolean): IGoContainer {
        const weight: PIXI.TextStyleFontWeight = bold ? 'bold' : 'normal';
        const style: PIXI.TextStyle = new PIXI.TextStyle({
            fontFamily: fonts, fontSize: size, fill: color, fontWeight: weight, stroke: {
                width: strokeSize, color: strokeColor
            }
        });
        const graphics: PIXI.Text = new PIXI.Text({text:text, style:style}); 
        
        const container: PIXI.Container = this._application.stage.addChild(graphics);
        this._containers.set(id, container);
        container.zIndex = this.GetIndex();
        return container;
    }

    public StageMask(id: string, x: number, y:number, width: number, height:number): IGoContainer {
        const child: PIXI.Container = new PIXI.Container();
        child.x = x;
        child.y = y;
        child.width = width;
        child.height = height;

        const container: PIXI.Container = this._application.stage.addChild(child);
        child.mask = new PIXI.Graphics().rect(x, y, width, height).fill({color:0xffffff});
        
        this._containers.set(id, container);
        container.zIndex = this.GetIndex();
        return container;
    }

    public NestSprite(asset: string, parentId: string): IGoContainer | undefined {
        if (!this._containers.has(parentId)) return undefined;
        const parent: PIXI.Container | undefined = this._containers.get(parentId);
        if (parent) {
            const sprite: PIXI.Sprite = PIXI.Sprite.from(asset);
            const container: PIXI.Container = parent.addChild(sprite);
            container.zIndex = this.GetIndex();
            return container;
        }
    }

    public NestRectangle(parentId: string, width: number, height: number, color: number, alpha: number): IGoContainer | undefined {
        if (!this._containers.has(parentId)) return undefined;
        const parent: PIXI.Container | undefined = this._containers.get(parentId);
        if (parent) {
            const graphics: PIXI.Graphics = new PIXI.Graphics(); 
            graphics.rect(0, 0, width, height).fill({color:color, alpha:alpha}); 

            const container: PIXI.Container = parent.addChild(graphics);
            container.zIndex = this.GetIndex();
            return container;
        }
    }

    public RestageSpriteRepeat(id: string, width: number, height: number, scaleTile: number): IGoContainer {
        const pre: PIXI.Container | undefined = this._containers.get(id);
        const zIndex: number = pre ? pre.zIndex : this.GetIndex();
        this.Remove(id);

        const texture: PIXI.Texture = PIXI.Texture.from(id);
        const sprite: PIXI.TilingSprite = new PIXI.TilingSprite({texture, width: width, height: height, tileScale: {x: scaleTile, y: scaleTile}});
        const container: PIXI.Container = this._application.stage.addChild(sprite);
        
        container.zIndex = zIndex;
        this._containers.set(id, container);
        return container;
    }

    public UpdateText(id: string, text: string): void {
        if (!this._containers.has(id)) return;
        const container: PIXI.Container | undefined = this._containers.get(id);
        if (container && container instanceof PIXI.Text) {
            container.text = text;
        }
    }

    public MoveMask(id: string, x: number, y:number, width: number, height:number): void {
        if (!this._containers.has(id)) return;
        const container: PIXI.Container | undefined = this._containers.get(id);
        if (container) {
            container.mask = null;
            container.x = x;
            container.y = y;
            container.mask = new PIXI.Graphics().rect(x, y, width, height).fill({color:0xffffff});
        }
    }

    public Remove(id: string): void {
        if (!this._containers.has(id)) return;
        const container: PIXI.Container | undefined = this._containers.get(id);
        if (container) {
            this._application.stage.removeChild(container);
            this._containers.delete(id);
            container.destroy();
        }
    }

    // helpers
    private GetIndex(): number {
        return ++this._zIndex;
    }
}
