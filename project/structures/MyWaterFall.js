import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCylinder } from '../shapes/MyCylinder.js';

export class MyWaterFall extends CGFobject {
    /**
     * @constructor
     * @param scene - Reference to MyScene object
     * @param text - Texture to be applied to the waterfall
     * @param height - Initial height of the waterfall
     * @param radius - Radius of the waterfall cylinder
     */
    constructor(scene, text, height, radius) {
        super(scene);
        this.height = height;
        this.radius = radius;
        this.cylinder = new MyCylinder(scene, 50, 50, radius, height, true);
        this.position = [0, 0, 0]; // default position just to exist
        this.texture = text;

        this.scalingSpeed = 2;
        this.fallingSpeed = 2;

        this.targetHeight = 30;

        this.state = "INACTIVE";

        this.initMaterials();
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    getCoords() {
        return {
            x: this.position[0],
            y: this.position[1],
            z: this.position[2],
            radius: this.radius
        };
    }

    setPosition(x, y, z) {
        this.position = [x, y - 13.5, z];
    }

    resetHeight() {
        this.cylinder.setHeight(this.height);
    }

    initMaterials() {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.8, 0.8, 0.8, 1);
        this.appearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearance.setShininess(1.0);
        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    update(t) {
        if (this.state == "INACTIVE") {
            this.resetHeight();
        }

        if (this.state == "FALLING_WARNING") {
            this.setState("FALLING");
        }

        if (this.state == "EXTENDING") {
            this.cylinder.setHeight(this.cylinder.getHeight() + this.scalingSpeed * t);
            if (this.cylinder.getHeight() >= this.targetHeight) {
                this.cylinder.setHeight(this.targetHeight);
                this.setState("FALLING_WARNING");
            }
        }

        if (this.state == "FINISHED_FALLING") {
            this.setState("INACTIVE");
        }

        if (this.state == "FALLING") {
            this.position[1] -= this.fallingSpeed * t; // Move downwards
            if (this.position[1] <= 0) {
                this.position[1] = 0;
                this.setState("FINISHED_FALLING");
            }
        }
    }

    display() {
        if (this.state != "INACTIVE") {
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(this.position[0], this.position[1], this.position[2]); // Translate to the desired position
            this.scene.rotate(Math.PI / 2, 1, 0, 0); // Rotate to make it vertical
            this.cylinder.display();
            this.scene.popMatrix();
        }
    }
}
