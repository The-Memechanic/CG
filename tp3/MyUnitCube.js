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
			// top
			 0.5,  0.5,  0.5,	// 0
			-0.5,  0.5,  0.5,	// 1
			-0.5,  0.5, -0.5,	// 2
			 0.5,  0.5, -0.5,	// 3

			// bottom
			 0.5, -0.5,  0.5,	// 4
			-0.5, -0.5,  0.5,	// 5
			-0.5, -0.5, -0.5,	// 6
			 0.5, -0.5, -0.5,	// 7

			// front
			 0.5,  0.5,  0.5,	// 8
			-0.5,  0.5,  0.5,	// 9
			-0.5, -0.5,  0.5,	// 10
			 0.5, -0.5,  0.5,	// 11

			// back
			 0.5,  0.5, -0.5,	// 12
			-0.5,  0.5, -0.5,	// 13
			-0.5, -0.5, -0.5,	// 14
			 0.5, -0.5, -0.5,	// 15

			// right
			 0.5,  0.5,  0.5,	// 16
			 0.5,  0.5, -0.5,	// 17
			 0.5, -0.5, -0.5,	// 18
			 0.5, -0.5,  0.5,	// 19

			// left
			-0.5,  0.5,  0.5,	// 20
			-0.5,  0.5, -0.5,	// 21
			-0.5, -0.5, -0.5,	// 22
			-0.5, -0.5,  0.5	// 23
		];

		// Indices defining all six faces (two triangles per face)
		this.indices = [
			// top
			2, 1, 0,
			3, 2, 0,

			// bottom
			5, 6, 7,
			4, 5, 7,

			// front
			8, 9, 10,
			8, 10, 11,

			// back
			15, 14, 13,
			15, 13, 12,

			// right
			18, 17, 16,
			19, 18, 16,

			// left
			21, 22, 23,
			20, 21, 23
		];

		// Normals
		this.normals = [
			// top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			// bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			// front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			// back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			// right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// left
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}
