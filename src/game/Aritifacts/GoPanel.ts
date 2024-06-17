import IGoContainer from "../Interfaces/IGoContainer";
import IRenderer from "../Interfaces/IRenderer";
import GameObject from "../Abstracts/GameObject";

// display a ui panel
export default class GoPanel extends GameObject {
    // initialization
    public constructor(renderer: IRenderer, id: string, width: number, height: number, color: number, alpha: number, lineSize: number, lineColor: number, lineAlpha: number) {
        super(renderer, id);
        this._container = this.Renderer.StageRectangle(this._id, width, height, color, alpha); 

        let lines: IGoContainer | undefined = this.Renderer.NestRectangle(this._id, width, lineSize, lineColor, lineAlpha);
        if (lines) lines.y = width - lineSize; 
        this.Renderer.NestRectangle(this._id, width, lineSize, lineColor, lineAlpha);
    }

    // abstract implementations
    public Update(deltaTime: number): void {}
}
