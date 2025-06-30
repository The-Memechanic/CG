import {CGFobject, CGFappearance} from '../lib/CGF.js';
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
        this.initObjects();
        this.initMaterials();
    }


    
    initObjects() {
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangle_small = new MyTriangleSmall(this.scene);
        this.triangle_big = new MyTriangleBig(this.scene);
    }

    updateBuffers(){
        
    }

    initMaterials() {
        //High Specular Colors

        // Yellow
        this.yellow = new CGFappearance(this.scene);
        this.yellow.setAmbient(1, 1, 0, 1.0);
        this.yellow.setDiffuse(1, 1, 0, 1.0);
        this.yellow.setSpecular(1, 1, 1, 1.0);
        
        // Pink
        this.pink = new CGFappearance(this.scene);
        this.pink.setAmbient(1, 0.71, 0.76, 1.0);
        this.pink.setDiffuse(1, 0.71, 0.76, 1.0);
        this.pink.setSpecular(1, 1, 1, 1.0);

        // Orange
        this.orange = new CGFappearance(this.scene);
        this.orange.setAmbient(1, 0.65, 0, 1.0);
        this.orange.setDiffuse(1, 0.65, 0, 1.0);
        this.orange.setSpecular(1, 1, 1, 1.0);

        // Light Blue
        this.light_blue = new CGFappearance(this.scene);
        this.light_blue.setAmbient(0.68, 0.85, 0.9, 1.0);
        this.light_blue.setDiffuse(0.68, 0.85, 0.9, 1.0);
        this.light_blue.setSpecular(1, 1, 1, 1.0);
        
        // Green
        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0, 1, 0, 1.0);
        this.green.setDiffuse(0, 1, 0, 1.0);
        this.green.setSpecular(1, 1, 1, 1.0);

        // Red
        this.red = new CGFappearance(this.scene);
        this.red.setAmbient(1, 0, 0, 1.0);
        this.red.setDiffuse(1, 0, 0, 1.0);
        this.red.setSpecular(1, 1, 1, 1.0);

        // Purple
        this.purple = new CGFappearance(this.scene);
        this.purple.setAmbient(0.5, 0, 1, 1.0);
        this.purple.setDiffuse(0.5, 0, 1, 1.0);
        this.purple.setSpecular(1, 1, 1, 1.0);
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

        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        // right big triangle
        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.orange.apply();
        this.triangle_big.display();
        this.scene.popMatrix();

        // left big triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.light_blue.apply();
        this.triangle_big.display();
        this.scene.popMatrix();

        // right small triangle
        this.scene.pushMatrix();
        this.scene.translate((3/2)*Math.sqrt(2), -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.purple.apply();
        this.triangle_small.display();
        this.scene.popMatrix();

        // left small triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2)/2, -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(3*Math.PI/4, 0, 0, 1);
        this.red.apply();
        this.triangle_small.display();
        this.scene.popMatrix();

        // normal triangle
        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2),0,0);
        this.scene.rotate(5*Math.PI/4, 0, 0, 1);
        this.pink.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // parallelogram
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), 0, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.yellow.apply();
        this.parallelogram.display();
        this.scene.popMatrix();
    }
}

