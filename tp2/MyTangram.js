import {CGFobject} from '../lib/CGF.js';
import {MyDiamond} from './MyDiamond.js';
import {MyTriangle} from './MyTriangle.js';
import {MyParallelogram} from './MyParallelogram.js';
import {MyTriangleSmall} from './MyTriangleSmall.js';
import {MyTriangleBig} from './MyTriangleBig.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initObjects();
    }


    
    initObjects() {
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangle_small = new MyTriangleSmall(this.scene);
        this.triangle_big = new MyTriangleBig(this.scene);
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

        this.diamond.display();
        this.scene.popMatrix();

        // right big trangle
        this.scene.pushMatrix();
        this.scene.translate(2*Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.triangle_big.display();
        this.scene.popMatrix();

        // left big triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), -Math.sqrt(2), 0);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.triangle_big.display();
        this.scene.popMatrix();

        // right small triangle
        this.scene.pushMatrix();
        this.scene.translate((3/2)*Math.sqrt(2), -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.triangle_small.display();
        this.scene.popMatrix();

        // left small triangle
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2)/2, -3*Math.sqrt(2)/2, 0);
        this.scene.rotate(3*Math.PI/4, 0, 0, 1);
        this.triangle_small.display();
        this.scene.popMatrix();

        // normal triangle
        this.scene.pushMatrix();
        this.scene.translate(Math.sqrt(2),0,0);
        this.scene.rotate(5*Math.PI/4, 0, 0, 1);
        this.triangle.display();
        this.scene.popMatrix();

        // parallelogram
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2), 0, 0);
        this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.parallelogram.display();
        this.scene.popMatrix();
    }
}

