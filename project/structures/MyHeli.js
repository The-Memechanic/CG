import { CGFobject } from "../../lib/CGF.js";
import { CGFappearance } from "../../lib/CGF.js";
import { MyHelicopterCockpit } from "./MyHelicopterCockpit.js";
import { MyCylinder } from "../shapes/MyCylinder.js";
import { MyCone } from "../shapes/MyCone.js";
import { CockpitWindow } from "./CockpitWindow.js";
import { MyTorus } from "../shapes/MyTorus.js";
import { MyBucket } from "./MyBucket.js";

export class MyHeli extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {CGFtexture} waterTexture - Texture for the bucket
     * @param {number} cruisingAltitude - The altitude at which the helicopter will cruise
     * @param {Array} position - Initial position of the helicopter
     * @param {number} orientation - Initial orientation of the helicopter in radians (default 0)
     */
    constructor(scene, waterTexture, cruisingAltitudeAboveBuilding = 10, position = [0,29.5,0], orientation = 0) {
        super(scene);
        this.initShapes();

        this.bucket = new MyBucket(scene, waterTexture, 32, 10, 1.0, 1.5, 0.2);
        this.openBucket = new MyBucket(scene, waterTexture, 32, 10, 1.0, 1.5, 0.2, true);

        this.isBucketOpen = false;
        this.displayBucket = false;
        this.bucketFull = false;

        this.position = position;
        this.originalPosition = [position[0], position[1], position[2]];
        this.orientation = orientation;
        this.originalOrientation = orientation;

        this.state = "IDLE";

        this.cruisingAltitude = this.originalPosition[1] + cruisingAltitudeAboveBuilding + 2; // Set cruising altitude based on the original position
        this.risingSpeed = 0.5;

        this.previousThreshold = 0;
        this.autoHeliRotation = 0.2;
        this.autoHeliSpeed = 3;

        this.speed = 0;
        this.acc = 0;
        this.heliRotationAcc = 0;
        this.heliRotation = 0;
        this.maxHeliRotation = 0.3;
        this.terminalSpeed = 7;
        this.currentBladeRotation = 0;
        this.maxBladeRotationSpeed = 0.3;
        this.bladeRotationSpeed = 0;
        this.bladeRotationAcc = 0.01;

        this.initMaterials();
        
    }

    initShapes() {
        const width = 4;
        this.body = new MyHelicopterCockpit(this.scene, 100, 100, 4, 2.5, 2.75); // TO TEST
        this.window = new CockpitWindow(this.scene, 100, 100, 4.01, 2.51, 2.76); // TO TEST
        this.supportCylinder1 = new MyCylinder(this.scene, 20, 20, 0.25, 1.25);
        this.supportCylinder2 = new MyCylinder(this.scene, 20, 20, 0.25, 5);
        this.supportCylinder3 = new MyCylinder(this.scene, 20, 20, 0.25, 7);
        this.supportCylinder4 = new MyCylinder(this.scene, 20, 20, 0.25, 9);
        this.supportCylinder5 = new MyCylinder(this.scene, 20, 20, 0.15, 2);
        this.rope = new MyCylinder(this.scene, 20, 20, 0.1, 5, true); // this cylinder will repeat texture
        this.cone = new MyCone(this.scene, 100, 100, width * 2.5, 1.5);
        this.donut = new MyTorus(this.scene, 32, 64, 1 * width / 4, 0.2 * width / 4);
    }

    initMaterials() {
        this.metal = new CGFappearance(this.scene);
        this.metal.setAmbient(0.8, 0.8, 0.8, 1);
        this.metal.setDiffuse(0.8, 0.8, 0.8, 1);
        this.metal.setSpecular(0.3, 0.3, 0.3, 1);
        this.metal.setShininess(1.0);
        this.metal.loadTexture("images/metal.jpg");
        this.metal.setTextureWrap('REPEAT', 'REPEAT');

        this.blade = new CGFappearance(this.scene);
        this.blade.setAmbient(0.8, 0.8, 0.8, 1);
        this.blade.setDiffuse(0.5, 0.5, 0.5, 1);
        this.blade.setSpecular(0.3, 0.3, 0.3, 1);
        this.blade.setShininess(0.5);
        this.blade.loadTexture("images/blade.jpg");
        this.blade.setTextureWrap('REPEAT', 'REPEAT');

        this.ropeTex = new CGFappearance(this.scene);
        this.ropeTex.setAmbient(0.8, 0.8, 0.8, 1);
        this.ropeTex.setDiffuse(0.5, 0.5, 0.5, 1);
        this.ropeTex.setSpecular(0.3, 0.3, 0.3, 1);
        this.ropeTex.setShininess(1.0);
        this.ropeTex.loadTexture("images/rope.jpg");
        this.ropeTex.setTextureWrap('REPEAT', 'REPEAT');

        this.windowTexture = new CGFappearance(this.scene);
        this.windowTexture.setAmbient(0.8, 0.8, 0.8, 1);
        this.windowTexture.setDiffuse(0.8, 0.8, 0.8, 1);
        this.windowTexture.setSpecular(0.2, 0.2, 0.5, 1);
        this.windowTexture.setShininess(0.5);
        this.windowTexture.loadTexture("images/cockpit.png");
        this.windowTexture.setTextureWrap('REPEAT', 'REPEAT');
    }

    setCruisingAltitude(altitude) {
        this.cruisingAltitude = this.originalPosition[1] + altitude + 2; // Set cruising altitude based on the original position
        this.risingSpeed = 0.5 * (this.cruisingAltitude) / 40; // Adjust rising speed based on altitude
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    setAcc(acc) {
        this.acc = acc;
    }

    getSpeed() {
        return this.speed;
    }

    setRotationAcc(acc) {
        this.heliRotationAcc = acc;
    }

    getCoords() {
        return {
            x : this.position[0],
            y : this.position[1],
            z : this.position[2]
        }
    }

    setPosition(position) {
        this.position[0] = position[0];
        this.position[1] = position[1];
        this.position[2] = position[2];
        this.setOriginalPosition(position);
    }

    setOriginalPosition(position) {
        this.originalPosition[0] = position[0];
        this.originalPosition[1] = position[1];
        this.originalPosition[2] = position[2];
    }

    getX() {
        return this.position[0];
    }

    getY() {
        return this.position[1];
    }

    getZ() {
        return this.position[2];
    }

    getBucketFull() {
        return this.bucketFull;
    }

    update (t) {
        this.handleMovement(t);
        this.handleState(t);
    }

    handleMovement(t) {
        if (this.acc == 0) {
            this.speed *= 0.8; // Air resistance simulation
        }
        this.speed = Math.max(Math.min(this.speed + this.acc * t, this.terminalSpeed), -this.terminalSpeed);
        this.position[0] += Math.cos(this.orientation) * this.speed * t;
        this.position[2] += Math.sin(this.orientation) * this.speed * t;
        
        if (this.heliRotationAcc == 0) {
            this.heliRotation *= 0.8; // Air resistance simulation
        }
        this.heliRotation = Math.max(Math.min(this.heliRotation + this.heliRotationAcc * t, this.maxHeliRotation), -this.maxHeliRotation);
        this.orientation = (this.orientation + this.heliRotation * t) % (2 * Math.PI);
    }

    handleState(t) {
        if (this.state == "START") {
            this.bladeRotationSpeed = Math.max(Math.min(this.bladeRotationSpeed + this.bladeRotationAcc * t, this.maxBladeRotationSpeed), -this.maxBladeRotationSpeed);

            if (this.bladeRotationSpeed == this.maxBladeRotationSpeed) {
                this.setState("RISING");
            }
        }

        if (this.state == "RISING") {
            this.position[1] += this.risingSpeed * t;
            if (this.position[1] >= this.cruisingAltitude) {
                this.position[1] = this.cruisingAltitude;
                this.displayBucket = true;
                this.setState("FREE");
            }
        }

        if (this.state == "ROTATE_BACK") {
            let deltaX = this.originalPosition[0] - this.position[0];
            let deltaZ = this.originalPosition[2] - this.position[2];
            let targetOrientation = Math.atan2(deltaZ, deltaX);
        
            // Normalize angle difference to [-π, π]
            let angleDiff = targetOrientation - this.orientation;
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        
            const rotationStep = this.autoHeliRotation * t;

            var decelerationThreshold = rotationStep + (rotationStep * (this.heliRotation / this.maxHeliRotation));
            if (decelerationThreshold < this.previousThreshold) { // we never allow a smaller theshold than the previous one
                decelerationThreshold = this.previousThreshold;
            } else {
                this.previousThreshold = decelerationThreshold;
            }

            if (Math.abs(angleDiff) <= rotationStep) {
                this.orientation = targetOrientation;
                this.stop();
                this.previousThreshold = 0; // reset the threshold for the next movement
                this.setState("GOBACK");
            } else {
                if (Math.abs(angleDiff) <= decelerationThreshold) {
                    this.heliRotationAcc = Math.sign(angleDiff) * -0.05;
                } else {
                    this.heliRotationAcc = Math.sign(angleDiff) * 0.05;
                }
            }

            if (this.orientation < 0) this.orientation += 2 * Math.PI;
            if (this.orientation >= 2 * Math.PI) this.orientation -= 2 * Math.PI;
        }

        if (this.state == "GOBACK") {
            if (Math.abs(this.position[0] - this.originalPosition[0]) < 3 && Math.abs(this.position[2] - this.originalPosition[2]) < 3) {
                this.position[0] = this.originalPosition[0];
                this.position[2] = this.originalPosition[2];
                this.setAcc(0);
                this.speed = 0;
                this.previousThreshold = 0; // reset the threshold for the next movement
                this.setState("ROTATE_IDLE");
            } else {
                var decelerationThreshold = 3 + (10 * Math.pow((this.speed / this.terminalSpeed), 3)); // this relation gives a smooth approximation for when to decelerate
                if (decelerationThreshold < this.previousThreshold) { // we never allow a smaller theshold than the previous one
                    decelerationThreshold = this.previousThreshold;
                } else {
                    this.previousThreshold = decelerationThreshold;
                }
                if (Math.abs(this.position[0] - this.originalPosition[0]) < decelerationThreshold && Math.abs(this.position[2] - this.originalPosition[2]) < decelerationThreshold) {
                    this.setAcc(-1.5);
                } else {
                    this.setAcc(1.5);
                }
            }
        }

        if (this.state == "ROTATE_IDLE") {
            let targetOrientation = this.originalOrientation;

            // Normalize angle difference to [-π, π]
            let angleDiff = targetOrientation - this.orientation;
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        
            const rotationStep = this.autoHeliRotation * t;
        
            var decelerationThreshold = rotationStep + (rotationStep * (this.heliRotation / this.maxHeliRotation));
            if (decelerationThreshold < this.previousThreshold) { // we never allow a smaller theshold than the previous one
                decelerationThreshold = this.previousThreshold;
            } else {
                this.previousThreshold = decelerationThreshold;
            }

            if (Math.abs(angleDiff) <= rotationStep) {
                this.orientation = targetOrientation;
                this.stop();
                this.displayBucket = false;
                this.previousThreshold = 0; // reset the threshold for the next movement
                this.setState("LOWERING_IDLE");
            } else {
                if (Math.abs(angleDiff) <= decelerationThreshold) {
                    this.heliRotationAcc = Math.sign(angleDiff) * -0.05;
                } else {
                    this.heliRotationAcc = Math.sign(angleDiff) * 0.05;
                }
            }

            if (this.orientation < 0) this.orientation += 2 * Math.PI;
            if (this.orientation >= 2 * Math.PI) this.orientation -= 2 * Math.PI;
        }

        if (this.state == "LOWERING_IDLE") {
            this.position[1] -= this.risingSpeed * t;
            if (this.position[1] <= this.originalPosition[1]) {
                this.position[1] = this.originalPosition[1];
                this.setState("END");
            }
        }

        if (this.state == "END") {
            this.bladeRotationSpeed = Math.max(Math.min(this.bladeRotationSpeed - this.bladeRotationAcc * t, this.maxBladeRotationSpeed), -this.maxBladeRotationSpeed);

            if (this.bladeRotationSpeed <= 0) {
                this.bladeRotationSpeed = 0;
                this.setState("IDLE");
            }
        }

        if (this.state == "GET_WATER") {
            this.position[1] -= this.risingSpeed * 2.5 * t;
            if (this.position[1] <= 11) {
                this.position[1] = 11;
                this.bucket.setFilled(true);
                this.bucketFull = true;
                this.setState("WATER_IDLE");
            }
        }

        if (this.state == "RISING_WATER") {
            this.position[1] += this.risingSpeed * 2.5 * t;
            if (this.position[1] >= this.cruisingAltitude) {
                this.position[1] = this.cruisingAltitude;
                this.displayBucket = true;
                this.setState("FREE");
            }
        }

        if (this.state == "DUMP_WATER") {
            this.isBucketOpen = true;
        }

        if (this.state == "FINISHED_DUMP") {
            this.isBucketOpen = false;
            this.bucket.setFilled(false);
            this.bucketFull = false;
            this.setState("FREE");
        }

        if (this.state == "FIX_HEIGHT") {
            const sign = Math.sign(this.cruisingAltitude - this.position[1]);
            
            this.position[1] += sign * t;
            
            if (sign > 0 && this.position[1] >= this.cruisingAltitude) {
                this.position[1] = this.cruisingAltitude;
                this.setState("FREE");
            }

            if (sign < 0 && this.position[1] <= this.originalPosition[1]) {
                this.position[1] = this.originalPosition[1];
                this.setState("FREE");
            }
            
        }
    }

    stop() {
        this.heliRotationAcc = 0;
        this.heliRotation = 0;
        this.acc = 0;
        this.speed = 0;
    }

    reset() {
        this.speed = 0;
        this.acc = 0;
        this.heliRotationAcc = 0;
        this.heliRotation = 0;
        this.currentBladeRotation = 0;
        this.bladeRotationSpeed = 0;
        this.isBucketOpen = false;
        this.displayBucket = false;
        this.bucket.setFilled(false);
        this.bucketFull = false;
        
        this.position[0] = this.originalPosition[0];
        this.position[1] = this.originalPosition[1];
        this.position[2] = this.originalPosition[2];
        this.orientation = this.originalOrientation;
        this.state = "IDLE";
    }

    display() {

        this.scene.pushMatrix();

        // Tilt based on velocity
        var tiltAngle = -this.speed * 0.05; // Adjust the tilt angle based on speed
        
        this.scene.rotate(tiltAngle, -Math.sin(this.orientation), 0, Math.cos(this.orientation)); // Rotate in the orientation direction

        this.scene.rotate(-this.orientation, 0, 1, 0); // Rotate around the Y-axis

        this.scene.pushMatrix();
        this.metal.apply();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.windowTexture.apply();
        this.window.display();
        this.scene.popMatrix();

        if (this.displayBucket) {
            this.scene.pushMatrix();

            this.scene.translate(0, -10, 0); // Position the bucket

            this.scene.pushMatrix();
            this.blade.apply();
            if (this.isBucketOpen) {
                this.openBucket.display();
            } else {
                this.bucket.display();
            }
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.ropeTex.apply();
            this.scene.translate(0, 7.375, 0);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.rope.display();
            this.scene.popMatrix();

            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.metal.apply();
        this.scene.rotate(Math.PI/2, 0, 0, 1); // Check first rotation
        this.cone.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.metal.apply();
        this.scene.translate(-10, 0, 0);
        this.donut.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); // Back rotor

        var rotation = 0;

        this.currentBladeRotation += this.bladeRotationSpeed;
        if (this.speed > 0) rotation = this.currentBladeRotation;
        else rotation = -this.currentBladeRotation;

        this.scene.translate(-10, 0, 0);
        this.scene.rotate(rotation % (2 * Math.PI), 0, 0, 1);
        this.scene.translate(10, 0, 0);

        this.scene.pushMatrix();
        this.blade.apply();
        this.scene.translate(-10, 1, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.supportCylinder5.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blade.apply();
        this.scene.translate(-11, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0); 
        this.supportCylinder5.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 3.5, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0); 
        this.supportCylinder1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); // Top rotor

        this.currentBladeRotation += this.bladeRotationSpeed;
        var rotation;
        if (this.speed > 0) rotation = this.currentBladeRotation;
        else rotation = -this.currentBladeRotation;

        this.scene.rotate(rotation % (2 * Math.PI), 0, 1, 0);

        this.scene.pushMatrix();
        this.blade.apply();
        this.scene.translate(0, 3.5, 0);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.translate(0, 0, -4.5);
        this.supportCylinder4.display(); // Check first rotation
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blade.apply();
        this.scene.translate(0, 3.5, 0);
        this.scene.rotate(-Math.PI/4, 0, 1, 0);
        this.scene.translate(0, 0, -4.5);
        this.supportCylinder4.display(); // Check first rotation
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0); 
        this.supportCylinder1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -3.25, -2.5); //2.5
        this.supportCylinder2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-3.5, -3.25, -2.5); //2.5
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.supportCylinder3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-3.5, -3.25, 2.5); //2.5
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.supportCylinder3.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
        
    }
}