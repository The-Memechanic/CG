import { CGFobject } from '../../lib/CGF.js';

export class MyTorus extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} slices - Number of divisions around the small circumference (tube)
     * @param {number} loops - Number of divisions around the large circumference (main ring)
     * @param {number} majorRadius - Radius from center to middle of tube
     * @param {number} minorRadius - Radius of the tube itself
     * @param {boolean} half - Whether to render only half of the torus
     */
    constructor(scene, slices, loops, majorRadius = 1, minorRadius = 0.3, half = false) {
        super(scene);
        this.slices = slices;
        this.loops = loops;
        this.majorRadius = majorRadius;
        this.minorRadius = minorRadius;
        this.half = half;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const sliceAngle = (2 * Math.PI) / this.slices;
        const loopAngle = (2 * Math.PI) / this.loops;
        const maxLoops = this.half ? Math.floor(this.loops / 2) : this.loops;   // Only draw half of the torus if this.half is true

        // Generate vertices, normals, and texture coordinates
        for (let loop = 0; loop <= maxLoops; loop++) {
            const loopRad = loop * loopAngle;
            const cosLoop = Math.cos(loopRad);
            const sinLoop = Math.sin(loopRad);

            const centerX = this.majorRadius * cosLoop;
            const centerY = this.majorRadius * sinLoop;

            for (let slice = 0; slice <= this.slices; slice++) {
                const sliceRad = slice * sliceAngle;
                const cosSlice = Math.cos(sliceRad);
                const sinSlice = Math.sin(sliceRad);

                const x = centerX + this.minorRadius * cosSlice * cosLoop;
                const y = centerY + this.minorRadius * cosSlice * sinLoop;
                const z = this.minorRadius * sinSlice;

                const nx = cosSlice * cosLoop;
                const ny = cosSlice * sinLoop;
                const nz = sinSlice;

                this.vertices.push(x, y, z);
                this.normals.push(nx, ny, nz);
                this.texCoords.push(loop / this.loops, slice / this.slices);
            }
        }

        // Generate indices
        for (let loop = 0; loop < maxLoops; loop++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (loop * (this.slices + 1)) + slice;
                const second = first + (this.slices + 1);

                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
