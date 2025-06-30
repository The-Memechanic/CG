import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initObjects();
    }


    
    initObjects() {
        this.quad = new MyQuad(this.scene);
    }

    display(){

        // diamond
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5); //front
        this.quad.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5); //back
        this.quad.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0); //left
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0); //right
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5,0); //top
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5,0); //bottom
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
        
    }

}

