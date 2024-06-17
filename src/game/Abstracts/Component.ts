import IRenderer from "../Interfaces/IRenderer";
import BaseObject from "./BaseObject";

// base class for view types
export default abstract class Component extends BaseObject {
    // protected members 
    protected _id: string;

    // required methods in implementations
    public abstract Transform(x: number, y: number, width: number, height: number): void;

    // initialization
    public constructor(renderer: IRenderer, id: string) {
        super(renderer);
        this._id = id;
    }
}