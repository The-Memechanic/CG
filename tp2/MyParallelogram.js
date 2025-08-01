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
			0, 0, 0, //0
            2, 0 ,0, //1
            1, 1, 0, //2
            3, 1, 0 //3
		];

		this.indices = [
			0, 1, 2,
			1, 3, 2,
            2, 1, 0,
            2, 3, 1
		];

		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

