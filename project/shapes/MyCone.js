import { CGFobject } from '../../lib/CGF.js';

/**
 * MyCone
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the Y axis
 * @param stacks - Number of divisions along the Y axis
 * @param height - Height of the cone (default 1)
 * @param radius - Radius of the base (default 1)
 */
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks, height = 1, radius = 1) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaAng = 2 * Math.PI / this.slices;
        const stackHeight = this.height / this.stacks;
        const radiusStep = this.radius / this.stacks;

        // SIDE
        for (let stack = 0; stack <= this.stacks; stack++) {
            const currentRadius = this.radius - radiusStep * stack;
            const y = stack * stackHeight;

            for (let slice = 0; slice <= this.slices; slice++) {
                const ang = slice * alphaAng;
                const x = currentRadius * Math.cos(ang);
                const z = -currentRadius * Math.sin(ang);

                this.vertices.push(x, y, z);

                const normalY = this.radius / this.height;
                const normalLength = Math.sqrt(1 + normalY * normalY);
                this.normals.push(
                    Math.cos(ang) / normalLength,
                    normalY / normalLength,
                    -Math.sin(ang) / normalLength
                );

                // Wrap around correctly
                this.texCoords.push(slice / this.slices, 1 - (y / this.height));
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                this.indices.push(second, first, first + 1);
                this.indices.push(second + 1,second,  first + 1);
            }
        }

        // BASE
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); // center
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let slice = 0; slice <= this.slices; slice++) {
            const ang = slice * alphaAng;
            const x = this.radius * Math.cos(ang);
            const z = -this.radius * Math.sin(ang);

            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(
                0.5 + 0.5 * Math.cos(ang),
                0.5 + 0.5 * Math.sin(ang)
            );
        }

        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                baseCenterIndex,
                baseCenterIndex + slice + 1,
                baseCenterIndex + slice + 2
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity);
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
