export class Train {
  private width: number;

  private height: number;

  private depth: number;

  private color: number[];

  public indices: number[] = [
    0,1,2,0,2,3, // Front face
    4,5,6,4,6,7, // Back face
    8,9,10,8,10,11, // Top face
    12,13,14,12,14,15, // Bottom face
    16,17,18,16,18,19, // Right face
    20,21,22,20,22,23, // Left face
  ];

  public normals: number[] = [
    // Front face
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    // Back face
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top face
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    // Bottom face
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right face
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    // Left face
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]

  constructor(width: number, height: number, depth: number, color: number[]) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
  }

  getPositions(): number[] {
    return [
      // Front face
      -this.width / 2,
      0,
      this.depth / 2,
      this.width / 2,
      0,
      this.depth / 2,
      this.width / 2,
      this.height,
      this.depth / 2,
      -this.width / 2,
      this.height,
      this.depth / 2,
      // Back face
      -this.width / 2,
      0,
      -this.depth / 2,
      -this.width / 2,
      this.height,
      -this.depth / 2,
      this.width / 2,
      this.height,
      -this.depth / 2,
      this.width / 2,
      0,
      -this.depth / 2,
      // Top face
      -this.width / 2,
      this.height,
      -this.depth / 2,
      -this.width / 2,
      this.height,
      this.depth / 2,
      this.width / 2,
      this.height,
      this.depth / 2,
      this.width / 2,
      this.height,
      -this.depth / 2,
      // Bottom face
      -this.width / 2,
      0,
      -this.depth / 2,
      this.width / 2,
      0,
      -this.depth / 2,
      this.width / 2,
      0,
      this.depth / 2,
      -this.width / 2,
      0,
      this.depth / 2,
      // Right face
      this.width / 2,
      0,
      -this.depth / 2,
      this.width / 2,
      this.height,
      -this.depth / 2,
      this.width / 2,
      this.height,
      this.depth / 2,
      this.width / 2,
      0,
      this.depth / 2,
      // Left face
      -this.width / 2,
      0,
      -this.depth / 2,
      -this.width / 2,
      0,
      this.depth / 2,
      -this.width / 2,
      this.height,
      this.depth / 2,
      -this.width / 2,
      this.height,
      -this.depth / 2,
      ];
  }

  getColor(): number[]{
    return this.color
  }

  getIndices(): number[] {
    return this.indices
  }

  getNormals(): number[] {
    return this.normals
  }
}

export default Train;
