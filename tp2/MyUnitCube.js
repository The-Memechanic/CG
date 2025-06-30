import { CGFobject } from '../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-0.5,  0.5, -0.5,	// 0
			 0.5,  0.5, -0.5,   // 1
			-0.5, -0.5, -0.5,   // 2
			 0.5, -0.5, -0.5,	// 3
			-0.5,  0.5,  0.5,	// 4
			 0.5,  0.5,  0.5,	// 5
			-0.5, -0.5,  0.5,	// 6
			 0.5, -0.5,  0.5	// 7
		];

		// Indices defining all six faces (two triangles per face)
		this.indices = [
			// top
			0, 4, 5,
			5, 1, 0,

			// bottom
			7, 6, 2,
			2, 3, 7,

			// front
			7, 5, 4,
			4, 6, 7,

			// back
			3, 2, 0,
			0, 1, 3,

			// right
			3, 1, 5,
			5, 7, 3,

			// left
			4, 0, 2,
			2, 6, 4
		];
		// The defined indices (and corresponding vertices)
		// will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}
