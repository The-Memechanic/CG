import { CGFobject } from '../../lib/CGF.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Width of the triangle base
 * @param height - Height of the triangle
 */
export class MyTriangle extends CGFobject {
	constructor(scene, base = 2, height = 2) {
		super(scene);
		this.base = base;
		this.height = height;
		this.initBuffers();
	}
	
	initBuffers() {
		const b = this.base / 2;
		const h = this.height;
		const levels = 4; // 4 rows (results in 15 vertices)
		
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let vertexCount = 0;

		// Create vertices in a triangle grid
		for (let i = 0; i <= levels; i++) {
			const y = h * (1 - i / levels);
			const startX = -b * (i / levels);
			const endX = b * (i / levels);

			for (let j = 0; j <= i; j++) {
				const x = startX + (endX - startX) * (j / i || 0); // avoid NaN when i = 0
				this.vertices.push(x, y, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push((x + b) / (2 * b), 1 - y / h);
				vertexCount++;
			}
		}

		// Generate indices for small triangles
		let idx = 0;
		for (let i = 0; i < levels; i++) {
			let rowStart = (i * (i + 1)) / 2;
			let nextRowStart = ((i + 1) * (i + 2)) / 2;

			for (let j = 0; j <= i; j++) {
				let a = rowStart + j;
				let b = nextRowStart + j;
				let c = nextRowStart + j + 1;
				this.indices.push(a, b, c);
				this.indices.push(c, b, a);

				if (j < i) {
					let d = rowStart + j;
					let e = nextRowStart + j + 1;
					let f = rowStart + j + 1;
					this.indices.push(d, e, f);
					this.indices.push(f, e, d);
				}
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

}
