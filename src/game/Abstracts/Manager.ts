import IConfig from "../Interfaces/IConfig";
import IRenderer from "../Interfaces/IRenderer";
import BaseObject from "./BaseObject";

// base class for manager types
export default abstract class Manager extends BaseObject {
    // dependencies
    public readonly Config: IConfig;

    // required methods in implementations
    public abstract UpdateLayout(scaleX: number, scaleY: number, canvasWidth: number, canvasHeight: number, portrait: boolean): void;
    public abstract DisableInteraction(): void;
    public abstract EnableInteraction(): void;

    // initialization
    public constructor(config: IConfig, renderer: IRenderer) {
        super(renderer);
        this.Config = config;
    }

    // helpers
    protected static AnchorTiledCenterMiddle(canvasWidth: number, canvasHeight: number, tileSize: number, tileScale: number): [x: number, y: number, w: number, h: number] {
        const ts: number = tileSize * tileScale;
        const countX: number = Math.ceil(canvasWidth / ts);
        const countY = Math.ceil(canvasHeight / ts);
        const w: number = countX * ts;
        const h: number = countY * ts;
        const x: number = (canvasWidth - w) / 2;
        const y: number = (canvasHeight - h) / 2;
        return [x, y, w, h];
    }

    protected static AnchorObjectCenterTop(canvasWidth: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = canvasWidth / 2 - w / 2 + offsetX;
        const y: number = offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectCenterMiddle(canvasWidth: number, canvasHeight: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = canvasWidth / 2 - w / 2 + offsetX * scale;
        const y: number = canvasHeight / 2 - h / 2 + offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectCenterBottom(canvasWidth: number, canvasHeight: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = canvasWidth / 2 - w / 2 + offsetX * scale;
        const y: number = canvasHeight - h + offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectRightBottom(canvasWidth: number, canvasHeight: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = canvasWidth - w + offsetX * scale;
        const y: number = canvasHeight - h + offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectRightTop(canvasWidth: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = canvasWidth - w + offsetX * scale;
        const y: number = offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectLeftTop(width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = offsetX * scale;
        const y: number = offsetY * scale;
        return [x, y, w, h];
    }

    protected static AnchorObjectLeftBottom(canvasHeight: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): [x: number, y: number, w: number, h: number] {
        const w: number = width * scale;
        const h: number = height * scale;
        const x: number = offsetX * scale;
        const y: number = canvasHeight - h + offsetY * scale;
        return [x, y, w, h];
    }
}