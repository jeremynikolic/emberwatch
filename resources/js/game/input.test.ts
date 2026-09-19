import { describe, expect, it } from 'vitest';
import { clientToCanvasPoint } from './input';

describe('clientToCanvasPoint', () => {
    const logicalCanvas = { width: 640, height: 360 };
    const buildBarPoint = { x: 64, y: 332 };

    it('maps a touch point through a CSS-scaled landscape canvas', () => {
        // The 640×360 logical canvas is CSS-scaled to a 693×390 landscape surface.
        const cssRect = { left: 12, top: 8, width: 693, height: 390 };
        const point = clientToCanvasPoint(
            cssRect,
            81.3,
            367.6666666667,
            logicalCanvas.width,
            logicalCanvas.height,
        );

        expect(point.x).toBeCloseTo(buildBarPoint.x);
        expect(point.y).toBeCloseTo(buildBarPoint.y);
    });

    it('preserves the same logical point on a desktop-sized canvas', () => {
        const desktopRect = { left: 0, top: 0, width: 1280, height: 720 };
        const point = clientToCanvasPoint(
            desktopRect,
            128,
            664,
            logicalCanvas.width,
            logicalCanvas.height,
        );

        expect(point.x).toBeCloseTo(buildBarPoint.x);
        expect(point.y).toBeCloseTo(buildBarPoint.y);
    });
});
