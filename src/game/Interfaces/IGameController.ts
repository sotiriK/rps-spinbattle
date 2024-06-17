import IAudio from "./IAudio";
import IConfig from "./IConfig";
import ILogger from "./ILogger";
import IRenderer from "./IRenderer";
import ISlotEngine from "./ISlotEngine";

export default interface IGameController {
    readonly Config: IConfig;
    readonly Renderer: IRenderer;
    readonly Audio: IAudio;
    readonly Engine: ISlotEngine;
    readonly Logger: ILogger;

    Start(): Promise<void>;
    Update(deltaTime: number): void;
    Resize(): void;
}
