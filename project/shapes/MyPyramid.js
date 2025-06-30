import { CGFobject } from '../../lib/CGF.js';

export class MyPyramid extends CGFobject {
    /**
     * @constructor
     * @param scene - Reference to MyScene object
     * @param slices - number of slices (triangular faces) around the base
     * @param stacks - number of stacks (height divisions)
     */
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
        this.texCoords = [];

        var ang = 0;
        var alphaAng = (2 * Math.PI) / this.slices;

        // Generate side vertices, normals, indices, and texture coordinates
        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var saa = Math.sin(ang + alphaAng);
            var ca = Math.cos(ang);
            var caa = Math.cos(ang + alphaAng);

            // Apex vertex (top)
            this.vertices.push(0, 1, 0);
            this.texCoords.push(0.5, 1); 

            // Current base vertex
            this.vertices.push(ca, 0, -sa);
            this.texCoords.push(0, 0);

            // Next base vertex
            this.vertices.push(caa, 0, -saa);
            this.texCoords.push(1, 0);

            // Normal calculation
            var normal = [saa - sa, ca * saa - sa * caa, caa - ca];
            var nsize = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
            normal = normal.map(x => x/nsize);

            // Push normals
            this.normals.push(...normal, ...normal, ...normal);

            // Indices for this triangular face
            var apexIndex = i * 3;
            this.indices.push(apexIndex, apexIndex + 1, apexIndex + 2);

            ang += alphaAng;
        }

        // Generate base geometry
        var baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); // Base center
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        var baseVertIndices = [];
        ang = 0;
        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var ca = Math.cos(ang);
            
            // Base perimeter vertices
            this.vertices.push(ca, 0, -sa);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + ca * 0.5, 0.5 - sa * 0.5);
            
            baseVertIndices.push(this.vertices.length / 3 - 1);
            ang += alphaAng;
        }

        // Base triangle indices
        for (var i = 0; i < this.slices; i++) {
            var next_i = (i + 1) % this.slices;
            this.indices.push(
                baseCenterIndex,
                baseVertIndices[next_i],
                baseVertIndices[i]
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}