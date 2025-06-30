import { MyCircle } from "../shapes/MyCircle.js";
import { CGFobject, CGFappearance } from "../../lib/CGF.js";
export class MyLake extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {CGFtexture} texture - Texture to be applied to the lake
     * @param {Array} coords - Coordinates of the center of the lake [x, y, z]
     * @param {number} scale - Scale factor for the lake size
     */
    constructor(scene, texture, coords, scale = 1) {
        super(scene);
        this.texture = texture;
        this.nrDivs = 10;
        this.coords = coords;
        this.scale = scale;
        this.initBuffers();
        this.initMaterials();
    }
        
    getCoords() {
        return {
            centre : this.coords,
            radius : this.scale
        }
    }

    initBuffers() {
        this.circle = new MyCircle(this.scene, 50, 1.5);
    }

    initMaterials() {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.8, 0.8, 0.8, 1);
        this.appearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearance.setShininess(0.3);
        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(this.coords[0], this.coords[1], this.coords[2]);
        this.scene.scale(this.scale, this.scale, this.scale);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();
    }
}