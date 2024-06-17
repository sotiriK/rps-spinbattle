import IRenderer from "../Interfaces/IRenderer";

// root class of all types
export default abstract class BaseObject {
    // dependencies
    public readonly Renderer: IRenderer;

    // required methods in implementations
    public abstract Update(deltaTime: number): void;
    public abstract Dispose(): void;

    // initialization
    public constructor(renderer: IRenderer) {
        this.Renderer = renderer;
    }
}
