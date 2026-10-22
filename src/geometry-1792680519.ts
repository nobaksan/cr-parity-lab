export interface Point { x: number; y: number }

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function centroid(points: Point[]): Point {
  if (points.length === 0) throw new Error("빈 점 목록");
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / points.length, y: sy / points.length };
}

export class Polygon {
  constructor(private readonly vertices: Point[]) {}

  perimeter(): number {
    let total = 0;
    for (let i = 0; i < this.vertices.length; i++) {
      total += distance(this.vertices[i]!, this.vertices[(i + 1) % this.vertices.length]!);
    }
    return total;
  }
}
