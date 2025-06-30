import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        var initialAngle = 0;
        var deltaAngle = 2*Math.PI / this.slices;
        var deltaHeight = 1 / this.stacks;

        for (var j = 0; j < this.stacks; j++) {
            for (var i = 0; i < this.slices; i++) {
                this.vertices.push(Math.cos(initialAngle), Math.sin(initialAngle),  j*deltaHeight);
                this.vertices.push(Math.cos(initialAngle), Math.sin(initialAngle), (j+1)*deltaHeight);

                var sliceVertices = this.slices * 2;

                this.indices.push((2*i + 2) % sliceVertices + 2*j*this.slices, (2*i + 1) % sliceVertices + 2*j*this.slices, (2*i) % sliceVertices + 2*j*this.slices);
                this.indices.push((2*i + 3) % sliceVertices + 2*j*this.slices, (2*i + 1) % sliceVertices + 2*j*this.slices, (2*i + 2) % sliceVertices + 2*j*this.slices);


                var normal = [
                    Math.cos(initialAngle),
                    Math.sin(initialAngle),
                    0
                ]

                this.normals.push(...normal);
                this.normals.push(...normal);

                initialAngle += deltaAngle;
            }
        }
     

        
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    display() {
        this.scene.pushMatrix();
        super.display();
        this.scene.popMatrix();
    }
}

