export interface CanvasClientRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface CanvasPoint {
    x: number;
    y: number;
}

/** Convert a browser pointer coordinate into the Canvas logical coordinate space. */
export function clientToCanvasPoint(
    rect: CanvasClientRect,
    clientX: number,
    clientY: number,
    canvasWidth: number,
    canvasHeight: number,
): CanvasPoint {
    return {
        x: (clientX - rect.left) * canvasWidth / rect.width,
        y: (clientY - rect.top) * canvasHeight / rect.height,
    };
}
