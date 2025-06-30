import { CGFobject } from '../../lib/CGF.js';

/**
 * MyCircle
 * Renders a filled circle using triangle fan
 * @param scene - Reference to MyScene object
 * @param slices - Number of segments
 * @param radius - Radius of the circle
 * @param minS, maxS, minT, maxT - Texture coordinates bounds
 */
export class MyCircle extends CGFobject {
	constructor(scene, slices, radius = 0.5, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);
		this.slices = slices || 20;
		this.radius = radius;
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [0, 0, 0]; // center vertex
		this.normals = [0, 0, 1];
		this.texCoords = [
			(this.minS + this.maxS) / 2, 
			(this.minT + this.maxT) / 2
		];
		this.indices = [];

		for (let i = 0; i <= this.slices; i++) {
			const angle = 2 * Math.PI * i / this.slices;
			const x = this.radius * Math.cos(angle);
			const y = this.radius * Math.sin(angle);

			this.vertices.push(x, y, 0);
			this.normals.push(0, 0, 1);

			const s = this.minS + (x / (2 * this.radius) + 0.5) * (this.maxS - this.minS);
			const t = this.minT + (0.5 - y / (2 * this.radius)) * (this.maxT - this.minT);
			this.texCoords.push(s, t);

			if (i < this.slices) {
				this.indices.push(0, i + 1, i + 2);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	setFillMode() {
		this.primitiveType = this.scene.gl.TRIANGLES;
	}

	setLineMode() {
		this.primitiveType = this.scene.gl.LINE_LOOP;
	}
}
