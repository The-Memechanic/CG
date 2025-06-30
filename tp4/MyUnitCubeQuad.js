import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { CGFappearance } from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, textureTop, textureFront, textureRight, textureBack, textureLeft, textureBottom) {
        super(scene);
        this.initObjects();
        this.initMaterials();
        this.textureTop = textureTop;
        this.textureFront = textureFront;
        this.textureRight = textureRight;
        this.textureBack = textureBack;
        this.textureLeft = textureLeft;
        this.textureBottom = textureBottom;
    }


    
    initObjects() {
        this.quad = new MyQuad(this.scene);
    }

    initMaterials() {
        // tangram material
        
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.1, 0.1, 0.1, 1);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
    }

    filtering_display(){
        this.material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.quad.display();
    }

    regular_display(){
        this.material.apply();
        this.quad.display();
    }

    display(toggleFiltering){

        // diamond
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5); //front
        this.material.setTexture(this.textureFront);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5); //back
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.material.setTexture(this.textureBack);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0); //left
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.material.setTexture(this.textureLeft);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0); //right
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.material.setTexture(this.textureRight);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5,0); //top
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.material.setTexture(this.textureTop);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5,0); //bottom
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.material.setTexture(this.textureBottom);
        if (toggleFiltering) this.filtering_display();
        else this.regular_display();
        this.quad.display();
        this.scene.popMatrix();
        
    }

}

