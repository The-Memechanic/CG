import { MyPlane } from "../shapes/MyPlane.js";
import { CGFobject, CGFappearance } from "../../lib/CGF.js";
export class MyGround extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {CGFtexture} texture - Texture to be applied to the ground
     */
    constructor(scene, texture) {
            super(scene);
            this.texture = texture;
            this.nrDivs = 10;

            this.initBuffers();
        }
        

        initBuffers() {
            this.plane = new MyPlane(this.scene, this.nrDivs, 0, 30, 0, 30);
        }
    
        display() {
    
            const windowAppearance = new CGFappearance(this.scene);
            windowAppearance.setAmbient(0.8, 0.8, 0.8, 1);
            windowAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
            windowAppearance.setSpecular(0.5, 0.5, 0.5, 1);
            windowAppearance.setShininess(1.0);
            
            windowAppearance.setTexture(this.texture);
            windowAppearance.setTextureWrap('REPEAT', 'REPEAT');
    
            this.scene.scale(2000, 2000, 2000);
            windowAppearance.apply();
  
    
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Rotate to make it horizontal
            this.plane.display();
            this.scene.popMatrix();
        }
}