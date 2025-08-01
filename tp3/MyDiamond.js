import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyDiamond extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			// front
			-1, 0, 0,	//0
			0, -1, 0,	//1
			0, 1, 0,	//2
			1, 0, 0,	//3

			// back
			-1, 0, 0,	//4
			0, -1, 0,	//5
			0, 1, 0,	//6
			1, 0, 0		//7
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2,

			6, 5, 4,
			5, 6, 7
		];

		this.normals = [
			0, 0,  1,
			0, 0,  1,
			0, 0,  1,
			0, 0,  1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

