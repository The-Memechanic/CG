import { CGFobject } from '../../lib/CGF.js';
import { CGFappearance } from '../../lib/CGF.js';
import { MyTriangle } from '../shapes/MyTriangle.js';

export class MyFire extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} flameNum - Number of flames to generate
     * @param {CGFtexture} texture - Texture for the fire
     * @param {Array} position - Position of the fire in the scene
     * @param {number} scale - Scale factor for the fire
     */
    constructor(scene, flameNum, texture, position = [0, 0, 0], scale = 1) {
        super(scene);
        this.flameNum = flameNum;
        this.triangles = [];
        this.offsets = [];
        this.rotations = [];
        this.randomValues = [];
        this.texture = texture;
        this.active = true; // Flag to control visibility
        this.position = position;
        this.scale = scale;

        this.initMaterials();
        this.initTriangles();
    }
    setActive(active) {
        this.active = active;
    }
    getActive() {
        return this.active;
    }

    initMaterials() {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(1, 1, 1, 1);
        this.appearance.setDiffuse(0.5, 0.5, 0.5, 1);
        this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.appearance.setShininess(1.0);
        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
        this.appearance.setEmission(0.7, 0.7, 0.7, 0.7);    // In nature, generally, fire emits light
        this.scene.gl.enable(this.scene.gl.BLEND); // Enable blending for transparency
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA); // blending function
    }

    initTriangles() {
        for (let i = 0; i < this.flameNum; i++) {
            const base = Math.random() * 0.3 + 0.2;    // base: 0.2 to 0.5
            const height = Math.random() * 0.4 + 0.3;  // height: 0.4 to 1.0
            const triangle = new MyTriangle(this.scene, base, height);
            this.triangles.push(triangle);

            // Random horizontal offsets (for placement around center)
            const xOffset = (Math.random() - 0.5) * 0.8 * (this.scale / 10); // -0.4 to 0.4
            const zOffset = (Math.random() - 0.5) * 0.8 * (this.scale / 10);
            const rotation = Math.random() * Math.PI * 2; // Random rotation angle
            const randomValue = Math.random() * 0.7 + 0.3; // range: 0.3 to 1
            this.offsets.push([xOffset, zOffset]);
            this.rotations.push(rotation);
            this.randomValues.push(randomValue);
        }
    }

    getCoords() {
        return {
            x: this.position[0],
            y: this.position[1],
            z: this.position[2],
            radius: this.scale
        }
    }

    display() {
        this.appearance.apply();
        if (this.active){
            this.scene.pushMatrix();

            this.scene.translate(this.position[0], this.position[1], this.position[2]);
            this.scene.scale(this.scale, this.scale, this.scale);

            for (let i = 0; i < this.flameNum; i++) {
                this.scene.pushMatrix();

                const [xOffset, zOffset] = this.offsets[i];
                const yOffset = 0;
                const rotation = this.rotations[i];

                this.scene.translate(xOffset, yOffset, zOffset);
                this.scene.rotate(rotation, 0, 1, 0);

                this.scene.fireShader.setUniformsValues({ randomValue: this.randomValues[i] });

                this.triangles[i].display();

                this.scene.popMatrix();
            }
            this.scene.popMatrix();
        }
       
    }
}
