/** Represents a point in 2D space. */
export interface Point { x: number; y: number }

/**
 * Calculates the Euclidean distance between two points.
 * @param a The first point.
 * @param b The second point.
 * @returns The distance between the two points.
 */
export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the centroid of a set of points.
 * @param points An array of points.
 * @returns The centroid of the points.
 * @throws Error if the input array of points is empty.
 */
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

/** Represents a polygon defined by an array of vertices. */
export class Polygon {
  constructor(private readonly vertices: Point[]) {}

  /**
   * Calculates the perimeter of the polygon.
   * @returns The perimeter of the polygon.
   */
  perimeter(): number {
    let total = 0;
    for (let i = 0; i < this.vertices.length; i++) {
      total += distance(this.vertices[i]!, this.vertices[(i + 1) % this.vertices.length]!);
    }
    return total;
  }
}
