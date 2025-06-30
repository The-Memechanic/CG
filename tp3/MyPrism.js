import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
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
                this.vertices.push(Math.cos(initialAngle), Math.sin(initialAngle), j*deltaHeight);
                this.vertices.push(Math.cos(initialAngle), Math.sin(initialAngle), (j+1)*deltaHeight);
                this.vertices.push(Math.cos(initialAngle + deltaAngle), Math.sin(initialAngle + deltaAngle),  j*deltaHeight);
                this.vertices.push(Math.cos(initialAngle + deltaAngle), Math.sin(initialAngle + deltaAngle), (j+1)*deltaHeight);

                this.indices.push(4*i + 2 + 4*j*this.slices, 4*i + 1 + 4*j*this.slices, 4*i + 4*j*this.slices);
                this.indices.push(4*i + 3 + 4*j*this.slices, 4*i + 1 + 4*j*this.slices, 4*i + 2 + 4*j*this.slices);

                var normal = [
                    Math.cos(initialAngle + deltaAngle/2),
                    Math.sin(initialAngle + deltaAngle/2),
                    0
                ]

                this.normals.push(...normal);
                this.normals.push(...normal);
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

