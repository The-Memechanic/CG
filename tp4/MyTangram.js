import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MyDiamond} from './MyDiamond.js';
import {MyTriangle} from './MyTriangle.js';
import {MyParallelogram} from './MyParallelogram.js';
import {MyTriangleSmall} from './MyTriangleSmall.js';
import {MyTriangleBig} from './MyTriangleBig.js';

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initTexCoords();
        this.initObjects();
        this.initMaterials();
    }


    
    initObjects() {
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangle_small_purple = new MyTriangleSmall(this.scene, this.triangleSmallPurple);
        this.triangle_small_red = new MyTriangleSmall(this.scene, this.triangleSmallRed);
        this.triangle_big_blue = new MyTriangleBig(this.scene, this.triangleBigBlue);
        this.triangle_big_orange = new MyTriangleBig(this.scene, this.triangleBigOrange);
    }

    updateBuffers(){
        
    }

    initMaterials() {
        this.texture = new CGFtexture(this.scene, 'images/tangram.png');
        // tangram material

        this.tangramMaterial = new CGFappearance(this.scene);
        this.tangramMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.tangramMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.tangramMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.tangramMaterial.setShininess(10.0);
        this.tangramMaterial.setTexture(this.texture);
    }

    initTexCoords(){
        this.triangleBigBlue = [
            0, 0,
            1, 0,
            0.5, 0.5,
            0, 0,
            1, 0,
            0.5, 0.5
        ]

        this.triangleBigOrange = [
            1, 0,
            1, 1,
            0.5, 0.5,
            1, 0,
            1, 1,
            0.5, 0.5
        ]

        this.triangleSmallPurple = [
            0, 0,
            0, 0.5,
            0.25, 0.25,
            0, 0,
            0, 0.5,
            0.25, 0.25
        ]

        this.triangleSmallRed = [
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5,
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5
        ]
    }

    display(){

        // diamond
        this.scene.pushMatrix();
        
        this.scene.multMatrix(
        [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sqrt(2)/2, -Math.sqrt(2)/2, 0, 1
        ]
        );

        this.scene.multMatrix(
        [
        Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0, 0,
        -Math.sin(Math.PI/4),  Math.cos(Math.PI/4), 0, 0,
        0,       0,      1, 0,
        0,       0,      0, 1
        ]
        );
        this.tangramMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        // right big triangle
        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.tangramMaterial.apply();
        this.triangle_big_orange.display();
        this.scene.popMatrix();

        // left big triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.tangramMaterial.apply();
        this.triangle_big_blue.display();
        this.scene.popMatrix();

        // right small triangle
        this.scene.pushMatrix();
        this.scene.translate((3/2)*Math.sqrt(2), -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.tangramMaterial.apply();
        this.triangle_small_purple.display();
        this.scene.popMatrix();

        // left small triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2)/2, -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(3*Math.PI/4, 0, 0, 1);
        this.tangramMaterial.apply();
        this.triangle_small_red.display();
        this.scene.popMatrix();

        // normal triangle
        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2),0,0);
        this.scene.rotate(5*Math.PI/4, 0, 0, 1);
        this.tangramMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // parallelogram
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), 0, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.tangramMaterial.apply();
        this.parallelogram.display();
        this.scene.popMatrix();
    }
}

