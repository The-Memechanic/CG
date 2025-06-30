import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import { MySphere } from '../shapes/MySphere.js';

export class MyPanorama extends CGFobject {
    /**
     * @constructor
     * @param scene - Reference to MyScene object
     * @param texture - Texture to be applied to the panorama
     */
	constructor(scene, texture) {
		super(scene);
        this.texture = texture;
		this.initBuffers();
	}
	initBuffers() {
		this.sphere = new MySphere(this.scene, 50, 50, true);
	};

    display(){

        this.scene.appearance = new CGFappearance(this.scene);
		this.scene.appearance.setAmbient(1.0, 1.0, 1.0, 1);
		this.scene.appearance.setShininess(1.0);

        this.scene.appearance.setTexture(this.texture);
        this.scene.appearance.setTextureWrap('REPEAT', 'REPEAT');
        this.scene.appearance.apply();

        this.scene.pushMatrix();
        this.scene.translate(this.scene.camera.position[0],this.scene.camera.position[1],this.scene.camera.position[2])
        this.scene.scale(1000,1000,1000);
        this.sphere.display();
        this.scene.popMatrix();
    }
}