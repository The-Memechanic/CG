import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyPlane } from '../shapes/MyPlane.js';

export class MyWindow extends CGFobject {
    constructor(scene, texture, width = 1, height = 1, nrDivs = 10) {
        super(scene);
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.nrDivs = nrDivs;
        this.initBuffers();
        this.initMaterials();
    }

    initMaterials() {
        this.windowAppearance = new CGFappearance(this.scene);
        this.windowAppearance.setAmbient(1, 1, 1, 1);
        this.windowAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.windowAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.windowAppearance.setEmission(0.2, 0.2, 0.2, 1);
        this.windowAppearance.setShininess(0.0);
        this.windowAppearance.setTexture(this.texture);
        this.windowAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    initBuffers() {
        this.plane = new MyPlane(this.scene, this.nrDivs, 0, 1, 0, 1); // window texture should take up the whole plane
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, this.height, 1);
        this.windowAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();
    }
}