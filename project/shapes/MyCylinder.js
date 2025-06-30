import { CGFobject } from '../../lib/CGF.js';

export class MyCylinder extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} slices - Number of divisions around the circumference
     * @param {number} stacks - Number of divisions along the height
     * @param {number} radius - Radius of the cylinder
     * @param {number} height - Height of the cylinder
     */
    constructor(scene, slices, stacks, radius = 1, height = 1, notStretched = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.height = height;
        this.notStretched = notStretched;
        this.initBuffers();
    }

    setHeight(height) {
        this.height = height; // Update height
        this.initBuffers(); // Reinitialize buffers to reflect the new height
    }

    getHeight() {
        return this.height; // Return the current height
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        const angleIncrement = (2 * Math.PI) / this.slices;
        const heightIncrement = this.height / this.stacks; // Scaled by height

        // Generate side vertices, normals, and indices
        for (let stack = 0; stack <= this.stacks; stack++) {
            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = this.radius * Math.cos(angle);
                const y = this.radius * Math.sin(angle);
                const z = stack * heightIncrement;       // Scaled by height
                
                this.vertices.push(x, y, z);
                this.normals.push(Math.cos(angle), Math.sin(angle), 0);
                if (this.notStretched) {
                    const circumference = 2 * Math.PI * this.radius;
                    const aspectRatio = this.height / circumference;
                    this.texCoords.push(slice / this.slices, 1 - (stack / this.stacks) * aspectRatio);  // Correctly scale texture coordinates when wanted
                } else {
                    this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);  // Certain textures need to be stretched
                }
            }
        }

        // Generate side indices
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (stack * (this.slices + 1)) + slice;
                const second = first + (this.slices + 1);
                
                this.indices.push(second, first, first + 1);
                this.indices.push(second + 1,second,  first + 1);
            }
        }

        // Generate bottom
        const bottomCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5);
        
        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = this.radius * Math.cos(angle); // Scaled by radius
            const y = this.radius * Math.sin(angle); // Scaled by radius
            
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
        }

        // Bottom base indices
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                bottomCenterIndex + slice + 1,
                bottomCenterIndex,
                bottomCenterIndex + ((slice + 1) % this.slices) + 1
            );
        }

        // Generate top
        const topCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);
        
        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = this.radius * Math.cos(angle);
            const y = this.radius * Math.sin(angle);
            
            this.vertices.push(x, y, this.height);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
        }

        // Top base indices
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                topCenterIndex + ((slice + 1) % this.slices) + 1,
                topCenterIndex,
                topCenterIndex + slice + 1
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}