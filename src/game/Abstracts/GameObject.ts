import IGoContainer from "../Interfaces/IGoContainer";
import IRenderer from "../Interfaces/IRenderer";
import Component from "./Component";

// base class for container types
export default abstract class GameObject extends Component {
    // protected members 
    protected _container?: IGoContainer;
    protected _disabled: boolean;

    // properties
    public get Disabled(): boolean { 
        return this._disabled; 
    }
    public set Disabled(value: boolean) { 
        this._disabled = value;
        if(!this._container) return;
        this._container.tint = value ? 0xbbbbbb : 0xffffff;
    }
    public get GoContainer(): IGoContainer | undefined { 
        return this._container; 
    }

    // initialization
    public constructor(renderer: IRenderer, id: string) {
        super(renderer, id);
        this._container = undefined;
        this._disabled = false;
    }

    // abstract implementations
    public Transform(x: number, y: number, width: number, height: number): void {
        if(!this._container) return;
        this._container.width = width;
        this._container.height = height;
        this._container.x = x;
        this._container.y = y;
    } 

    public Dispose(): void {
        if(!this._container) return;
        this._container = undefined;
        this.Renderer.Remove(this._id);
    }

    // public methods
    public Hide(): void {
        if(!this._container) return;
        this._container.visible = false;
    }

    public Show(): void {
        if(!this._container) return;
        this._container.visible = true;
    }
}