import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			// front
			0, 0, 0, //0
            2, 0 ,0, //1
            1, 1, 0, //2
            3, 1, 0, //3

			// back
			0, 0, 0, //4
			2, 0 ,0, //5
			1, 1, 0, //6
			3, 1, 0  //7
		];

		this.indices = [
			0, 1, 2,
			1, 3, 2,
            6, 5, 4,
            6, 7, 5
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

		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

