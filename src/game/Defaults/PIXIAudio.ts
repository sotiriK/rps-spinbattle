import * as PIXI from 'pixi.js';
import * as Audio from '@pixi/sound';
import IAudio from '../Interfaces/IAudio';

// audio interface implementation 
export default class PIXIAudio implements IAudio {
    // private memebers
    private _sounds: Map<string, Audio.Sound>; 

    // initialization
    public constructor() {
        this._sounds = new Map<string, Audio.Sound>();
    }

    // interface implementations
    public async LoadSounds(sounds: Array<string>): Promise<void> {
        for (const name of sounds) {
            await PIXI.Assets.load<Audio.Sound>(name);
            const sound: Audio.Sound = Audio.Sound.from(name);
            this._sounds.set(name, sound); 
        }
    }

    public Play(name: string): void {
        const sound: Audio.Sound | undefined = this._sounds.get(name);
        if (sound !== undefined) {
            sound.loop = false;
            sound.play();
        }
    }

    public PlayLoop(name: string): void {
        const sound: Audio.Sound | undefined = this._sounds.get(name);
        if (sound !== undefined) {
            sound.loop = true;
            sound.play();
        }
    }

    public Stop(name: string): void {
        const sound: Audio.Sound | undefined = this._sounds.get(name);
        if (sound !== undefined) {
            sound.stop();
        }
    }
}

