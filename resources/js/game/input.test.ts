import { describe, expect, it } from 'vitest';
import { clientToCanvasPoint } from './input';

describe('clientToCanvasPoint', () => {
    it('maps a touch point through a CSS-scaled landscape canvas', () => {
        const point = clientToCanvasPoint(
            { left: 12, top: 8, width: 693, height: 390 },
            81.3,
            367.6666666667,
            640,
            360,
        );

        expect(point.x).toBeCloseTo(64);
        expect(point.y).toBeCloseTo(332);
    });

    it('preserves the same logical point on a desktop-sized canvas', () => {
        const point = clientToCanvasPoint(
            { left: 0, top: 0, width: 1280, height: 720 },
            128,
            664,
            640,
            360,
        );

        expect(point.x).toBeCloseTo(64);
        expect(point.y).toBeCloseTo(332);
    });
});
