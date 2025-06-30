import { CGFobject } from '../../lib/CGF.js';

export class MyHelicopterCockpit extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} slices - Number of divisions around the circumference
     * @param {number} stacks - Number of divisions along the height
     * @param {number} radiusX - Horizontal stretch factor (width)
     * @param {number} radiusY - Vertical flattening factor (height)
     * @param {number} radiusZ - Depth stretch factor (length)
     */
    constructor(scene, slices, stacks, radiusX = 1.5, radiusY = 0.8, radiusZ = 1.2) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;   
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const phiIncrement = Math.PI / this.stacks; // Vertical angle increment
        const thetaIncrement = (2 * Math.PI) / this.slices; // Horizontal angle increment

        // Add north pole
        this.vertices.push(0, this.radiusY, 0); 
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0);

        // Generate body vertices without the poles
        for (let stack = 1; stack < this.stacks; stack++) {
            const phi = stack * phiIncrement;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            for (let slice = 0; slice <= this.slices; slice++) {
                const theta = slice * thetaIncrement;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const x = this.radiusX * sinTheta * sinPhi;
                const y = this.radiusY * cosPhi;
                const z = this.radiusZ * cosTheta * sinPhi;

                this.vertices.push(x, y, z);
                this.texCoords.push(slice / this.slices, stack / this.stacks);

                // Calculate normals
                const normalX = x / this.radiusX;
                const normalY = y / this.radiusY;
                const normalZ = z / this.radiusZ;
                const normalLength = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
                this.normals.push(
                    normalX / normalLength,
                    normalY / normalLength,
                    normalZ / normalLength
                );
            }
        }

        // Add south pole
        const southPoleIndex = this.vertices.length / 3;
        this.vertices.push(0, -this.radiusY, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 1);

        // Connect north pole
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                0,
                1 + (slice + 1) % (this.slices + 1),
                1 + slice
            );
        }

        // Generate body indices
        for (let stack = 0; stack < this.stacks - 2; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const base = 1 + stack * (this.slices + 1);
                const nextBase = 1 + (stack + 1) * (this.slices + 1);

                this.indices.push(
                    base + slice,
                    nextBase + slice,
                    base + (slice + 1) % (this.slices + 1)
                );
                this.indices.push(
                    base + (slice + 1) % (this.slices + 1),
                    nextBase + slice,
                    nextBase + (slice + 1) % (this.slices + 1)
                );
            }
        }

        // Connect south pole
        const lastRingStart = 1 + (this.stacks - 2) * (this.slices + 1);
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                lastRingStart + slice,
                southPoleIndex,
                lastRingStart + (slice + 1) % (this.slices + 1)
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    // For debugging
    setLineMode() {
        this.primitiveType = this.scene.gl.LINES;
    }
}