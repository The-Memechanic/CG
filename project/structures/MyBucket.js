import { CGFobject } from '../../lib/CGF.js';
import { MyTorus } from '../shapes/MyTorus.js';
import { MyLake } from './MyLake.js';

export class MyBucket extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} slices - Number of divisions around the circumference
     * @param {number} stacks - Number of divisions along the height
     * @param {number} outerRadius - Outer radius of the bucket
     * @param {number} height - Height of the bucket
     * @param {number} thickness - Wall thickness (difference between outer and inner radius)
     * @param {boolean} isOpen - Whether the bucket is open at the bottom
     */
    constructor(scene, waterTex, slices, stacks, outerRadius = 1, height = 1, thickness = 0.05, isOpen = false) {
        super(scene);
        this.waterTex = waterTex;
        this.slices = slices;
        this.stacks = stacks;
        this.outerRadius = outerRadius;
        this.innerRadius = outerRadius - thickness;
        this.height = height;
        this.thickness = thickness;
        this.isOpen = isOpen;

        this.filled = false;

        this.initObjects();
        this.initBuffers();
    }

    initObjects() {
        this.handle = new MyTorus(this.scene, this.slices, this.stacks * 2, this.outerRadius - this.thickness / 2, this.thickness / 2, true); // half torus for the handle

        this.water = new MyLake(this.scene, this.waterTex, [0, this.height * 0.8, 0], this.outerRadius - this.thickness * 2);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        const angleStep = (2 * Math.PI) / this.slices;
        const heightStep = this.height / this.stacks;
    
        // the bucket walls
        for (let side = 0; side <= 1; side++) {
            const radius = side === 0 ? this.outerRadius : this.innerRadius;
            const normalDir = side === 0 ? 1 : -1;
    
            for (let stack = 0; stack <= this.stacks; stack++) {
                for (let slice = 0; slice <= this.slices; slice++) {
                    const angle = slice * angleStep;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    const z = stack * heightStep;
    
                    this.vertices.push(x, y, z);
                    this.normals.push(normalDir * Math.cos(angle), normalDir * Math.sin(angle), 0);
                    this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
                }
            }
        }
    
        // Calculate the indices of the bucket walls
        const vertsPerRing = this.slices + 1;
        for (let side = 0; side <= 1; side++) {
            const baseIndex = side * vertsPerRing * (this.stacks + 1);
            for (let stack = 0; stack < this.stacks; stack++) {
                for (let slice = 0; slice < this.slices; slice++) {
                    const first = baseIndex + stack * vertsPerRing + slice;
                    const second = first + vertsPerRing;
    
                    if (side === 0) {
                        this.indices.push(second, first, first + 1);
                        this.indices.push(second + 1, second, first + 1);
                    } else {
                        this.indices.push(first + 1, first, second);
                        this.indices.push(first + 1, second, second + 1);
                    }
                }
            }
        }
    
        // Base
        if (!this.isOpen) {

            // We create a full base
            const baseCenterIndex = this.vertices.length / 3;

            this.vertices.push(0, 0, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5, 0.5);

            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleStep;
                const x = this.outerRadius * Math.cos(angle);
                const y = this.outerRadius * Math.sin(angle);

                this.vertices.push(x, y, 0);
                this.normals.push(0, 0, -1);
                this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
            }

            for (let slice = 0; slice < this.slices; slice++) {
                this.indices.push(
                    baseCenterIndex,
                    baseCenterIndex + slice + 1,
                    baseCenterIndex + slice + 2
                );
                this.indices.push(
                    baseCenterIndex + slice + 1,
                    baseCenterIndex,
                    baseCenterIndex + slice + 2
                );
            }
        } else {

            // We create another ring similar to the top ring
            const bottomStartIndex = this.vertices.length / 3;

            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleStep;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                const xOuter = this.outerRadius * cos;
                const yOuter = this.outerRadius * sin;

                this.vertices.push(xOuter, yOuter, 0);
                this.normals.push(0, 0, -1);
                this.texCoords.push(0.5 + 0.5 * cos, 0.5 + 0.5 * sin);

                const xInner = this.innerRadius * cos;
                const yInner = this.innerRadius * sin;

                this.vertices.push(xInner, yInner, 0);
                this.normals.push(0, 0, -1);
                this.texCoords.push(0.5 + 0.5 * (this.innerRadius / this.outerRadius) * cos,
                                    0.5 + 0.5 * (this.innerRadius / this.outerRadius) * sin);
            }

            for (let slice = 0; slice < this.slices; slice++) {
                const i = bottomStartIndex + slice * 2;
                this.indices.push(i + 2, i, i + 1);
                this.indices.push(i + 3, i + 2, i + 1);
            }

        }

    
        // Top ring
        const topRingStart = this.vertices.length / 3;
        const z = this.height;
        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleStep;
            const xOuter = this.outerRadius * Math.cos(angle);
            const yOuter = this.outerRadius * Math.sin(angle);
            const xInner = this.innerRadius * Math.cos(angle);
            const yInner = this.innerRadius * Math.sin(angle);
    
            this.vertices.push(xOuter, yOuter, z);
            this.normals.push(0, 0, 1);
            this.texCoords.push(slice / this.slices, 1);
    
            this.vertices.push(xInner, yInner, z);
            this.normals.push(0, 0, 1);
            this.texCoords.push(slice / this.slices, 0);
        }
    
        for (let slice = 0; slice < this.slices; slice++) {
            const i = topRingStart + slice * 2;
            const next = i + 2;
    
            this.indices.push(i + 1, i, next);
            this.indices.push(i + 1, next, next + 1);
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    setFilled(filled) {
        this.filled = filled;
    }

    display() {
        // Draw bucket body
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Rotate to make it vertical
        super.display();
        this.scene.popMatrix();
    
        // Draw handle
        this.scene.pushMatrix();
        this.scene.translate(0, this.height, 0); // Place the handle on top of the bucket
        this.scene.rotate(Math.PI / 2, 0, 1, 0); // Also rotate it
        this.handle.display();
        this.scene.popMatrix();

        // Draw water if filled
        if (this.filled) {
            this.scene.pushMatrix();
            this.water.display();
            this.scene.popMatrix();
        }
    }
    
    
}
