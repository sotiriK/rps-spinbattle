
export default interface IAudio {
    LoadSounds(sounds: Array<string>): Promise<void>;
    Play(name: string): void;
    PlayLoop(name: string): void;
    Stop(name: string): void;
}
