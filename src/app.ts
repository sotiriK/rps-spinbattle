import IConfig from './game/Interfaces/IConfig';
import IRenderer from './game/Interfaces/IRenderer';
import IAudio from './game/Interfaces/IAudio';
import ISlotEngine from './game/Interfaces/ISlotEngine';
import GameController from './game/Defaults/GameController';
import IGameController from './game/Interfaces/IGameController';
import DefaultConfig from './game/Defaults/DefaultConfig';
import PIXIRenderer from './game/Defaults/PIXIRenderer';
import PIXIAudio from './game/Defaults/PIXIAudio';
import SlotEngine from './game/Defaults/SlotEngine';
import ILogger from './game/Interfaces/ILogger';

// bootstrap
export class App {
    // simple dependency injection 
    private _logger: ILogger = console;
    private _config: IConfig = new DefaultConfig();
    private _renderer: IRenderer = new PIXIRenderer();
    private _audio: IAudio = new PIXIAudio();
    private _engine: ISlotEngine = new SlotEngine(this._config);
    private _controller: IGameController = new GameController(this._config, this._renderer, this._audio, this._engine, this._logger);

    public constructor() {
        // game entry point - root of game specific content: src/game and public/game 
        this._controller.Start();
    }
}
