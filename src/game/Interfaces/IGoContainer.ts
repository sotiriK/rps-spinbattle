
export default interface IGoContainer {
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get alpha(): number;
    set alpha(value: number);
    set tint(value: number);
    get tint(): number;
    get renderable(): boolean;
    set renderable(value: boolean);
    get visible(): boolean;
    set visible(value: boolean);
}
