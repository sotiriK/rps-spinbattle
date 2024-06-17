import IGoContainer from "./IGoContainer";

export default interface IRenderer {
    Initialize(color: number): Promise<void>;
    LoadSprites(sprites: Array<string>): Promise<void>;
    SetTicker(maxFps: number, callback: (deltaTime: number) => void): void;

    StageSprite(id: string, asset: string): IGoContainer;
    StageSpriteRepeat(id: string, asset: string, width: number, height: number): IGoContainer;
    StageSpriteButton(id: string, asset: string, handler: () => void): IGoContainer;
    StageRectangle(id: string, width: number, height: number, color: number, alpha: number): IGoContainer;
    StageFrame(id: string, width: number, height: number, thickness: number, color: number, alpha: number): IGoContainer;
    StageText(id: string, text: string, fonts: Array<string>, size: number, color: number, strokeColor: number, strokeSize: number, bold: boolean): IGoContainer;
    StageMask(id: string, x: number, y:number, width: number, height:number): IGoContainer;

    NestSprite(asset: string, parentId: string): IGoContainer | undefined;
    NestRectangle(parentId: string, width: number, height: number, color: number, alpha: number): IGoContainer | undefined;

    RestageSpriteRepeat(id: string, width: number, height: number, scaleTile: number): IGoContainer;
    UpdateText(id: string, text: string): void;
    MoveMask(id: string, x: number, y:number, width: number, height:number): void;
    
    Remove(id: string): void;
}