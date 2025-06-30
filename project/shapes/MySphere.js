import { CGFobject } from '../../lib/CGF.js';

export class MySphere extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {number} slices - Number of slices (horizontal divisions)
     * @param {number} stacks - Number of stacks (vertical divisions)
     * @param {boolean} isInverted - If true, inverts the normals to create an inside-out sphere
     */
    constructor(scene, slices, stacks, isInverted = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.isInverted = isInverted;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const phiIncrement = (Math.PI / 2) / this.stacks; // Vertical angle increment per hemisphere
        const thetaIncrement = (2 * Math.PI) / this.slices; // Horizontal angle increment

        // Add north pole
        this.vertices.push(0, 1, 0);
        this.normals.push(0, this.isInverted ? -1 : 1, 0); // Invert normal if needed
        this.texCoords.push(0.5, 0);

        // Main body vertices
        for (let stack = 1; stack <= this.stacks * 2 - 1; stack++) {
            let phi = stack * phiIncrement;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);
            
            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = slice * thetaIncrement;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);
                
                this.vertices.push(sinTheta * sinPhi, cosPhi, cosTheta * sinPhi);
                this.texCoords.push(slice / this.slices, stack / (this.stacks * 2));
                if (this.isInverted) {
                    this.normals.push(-sinTheta * sinPhi, -cosPhi, -cosTheta * sinPhi);
                }
                else {
                    this.normals.push(sinTheta * sinPhi, cosPhi, cosTheta * sinPhi);
                }
            }
        }

        // Add south pole
        const southPoleIndex = this.vertices.length / 3;
        this.vertices.push(0, -1, 0);
        this.normals.push(0, this.isInverted ? 1 : -1, 0); // Invert normal if needed
        this.texCoords.push(0.5, 1);

        // Connect north pole
        for (let slice = 0; slice < this.slices; slice++) {
            if (this.isInverted) {
                this.indices.push(
                    0,
                    1 + (slice + 1) % (this.slices + 1),
                    1 + slice
                );
            } else {
                this.indices.push(
                    0,
                    1 + slice,
                    1 + (slice + 1) % (this.slices + 1)
                );
            }
        }

        // Generate body indices
        for (let stack = 0; stack < this.stacks * 2 - 2; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const base = 1 + stack * (this.slices + 1);
                const nextBase = 1 + (stack + 1) * (this.slices + 1);
                
                if (this.isInverted) {
                    this.indices.push(
                        base + slice,
                        base + (slice + 1) % (this.slices + 1),
                        nextBase + slice
                    );
                    
                    this.indices.push(
                        base + (slice + 1) % (this.slices + 1),
                        nextBase + (slice + 1) % (this.slices + 1),
                        nextBase + slice
                    );
                } else {
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
        }

        // Connect south pole
        const lastRingStart = 1 + (this.stacks * 2 - 2) * (this.slices + 1);
        for (let slice = 0; slice < this.slices; slice++) {
            if (this.isInverted) {
                this.indices.push(
                    lastRingStart + slice,
                    lastRingStart + (slice + 1) % (this.slices + 1),
                    southPoleIndex
                );
            } else {
                this.indices.push(
                    lastRingStart + slice,
                    southPoleIndex,
                    lastRingStart + (slice + 1) % (this.slices + 1)
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    // for debugging
    setLineMode() {
        this.primitiveType = this.scene.gl.LINES;
    }
}