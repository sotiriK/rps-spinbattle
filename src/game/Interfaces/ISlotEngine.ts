import IConfig from "./IConfig";

export default interface ISlotEngine {
    readonly Config: IConfig;

    GetUserId(): number;
    GetUserBalance(): number;
    SetGaffe(values:Array<number>): void;
    Initialize (userId: number): Promise<boolean>;
    Reset(): void;
    GenerateStops(): Promise<Array<number>>;
    GetWinMatches(): Array<[x:number, y:number]>;
    GetWinnings(betAmount: number): number;
}