import { CGFobject, CGFappearance} from "../../lib/CGF.js";
import { MyPyramid } from "../shapes/MyPyramid.js";
import { MyCone } from "../shapes/MyCone.js";

export class MyTree extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {number} trunkRadius - Radius of the tree trunk
     * @param {number} treeHeight - Total height of the tree
     * @param {number} tiltAngle - Angle to tilt the tree (in degrees)
     * @param {string} tiltAxis - Axis to tilt the tree ('X' or 'Z')
     * @param {Array} topColor - RGB color for the tree top
     */
    constructor(scene, trunkRadius, treeHeight, tiltAngle, tiltAxis, topColor, textLeaf, textWood) {
        super(scene);
        this.trunkRadius = trunkRadius || 0.5;
        this.treeHeight = treeHeight || 5.0;
        this.tiltAngle = tiltAngle || 0;
        this.tiltAxis = (tiltAxis === 'X' || tiltAxis === 'Z') ? tiltAxis : 'X';
        this.topColor = topColor || [0.0, 0.0, 0.0];

        this.trunkHeight = this.treeHeight * 0.2;
        this.topHeight = this.treeHeight * 0.8;

        this.textLeaf = textLeaf;
        this.textWood = textWood;

        // Finer control of tree fullness
        this.numPyramids = Math.max(3, Math.round(this.topHeight / 1.0));
        this.pyramidHeight = this.topHeight / this.numPyramids;
        this.pyramidBaseRadius = this.trunkRadius * 2.5;

        this.initBuffers();
        this.initMaterials();
    }

    initBuffers() {
        // Create trunk and pyramids
        this.trunk = new MyCone(this.scene, 100, 100, (this.treeHeight/2)*0.8,this.trunkRadius);
        this.pyramids = [];
        for (let i = 0; i < this.numPyramids; i++) {
            const sides = 4 + i;
            const slant = 1 - (i * 0.05);
            this.pyramids.push(new MyPyramid(this.scene, sides, slant));
        }
    }

    initMaterials() {
        // leaf Material
        this.topMaterial = this.scene.createAppearance ? this.scene.createAppearance() : new CGFappearance(this.scene);
        this.topMaterial.setAmbient(...this.topColor, 1.0);
        this.topMaterial.setDiffuse(this.topColor[0] * 0.8, this.topColor[1] * 0.8, this.topColor[2] * 0.8, 1.0);
        this.topMaterial.setSpecular(0.3, 0.3, 0.3, 1);
        this.topMaterial.setShininess(0.3);
        this.topMaterial.setTexture(this.textLeaf);
        this.topMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Trunk Material
        this.trunkMaterial = new CGFappearance(this.scene);
        this.trunkMaterial.setAmbient(0.7, 0.18, 0.05, 1.0);
        this.trunkMaterial.setDiffuse(0.03, 0.01,0.01, 1.0);
        this.trunkMaterial.setShininess(1.0);
        this.trunkMaterial.setTexture(this.textWood);
        this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(0, -this.trunkHeight / 2 - (0.1 * (this.tiltAngle / 10)), 0); // Put trees on the ground

        // Apply tilt to the whole tree
        if (this.tiltAxis === 'X') {
            this.scene.rotate(this.tiltAngle * Math.PI / 180, 1, 0, 0);
        } else {
            this.scene.rotate(this.tiltAngle * Math.PI / 180, 0, 0, 1);
        }

        // the trunk is centered on Y-axis
        this.scene.pushMatrix();
        this.scene.translate(0, this.trunkHeight / 2, 0); // Center trunk on Y
        this.scene.scale(this.trunkRadius, this.trunkHeight, this.trunkRadius); // Scale with height along Z (now Y)
        this.trunkMaterial.apply();
        this.trunk.display();
        this.scene.popMatrix();

        // tree pyramids
        let currentY = this.trunkHeight;
        
        for (let i = 0; i < this.numPyramids; i++) {
            const scale = 1 - (i / this.numPyramids) * 0.5;
            
        
            this.scene.pushMatrix();
            this.scene.translate(0, currentY, 0);
            this.scene.scale(this.pyramidBaseRadius * scale, this.pyramidHeight, this.pyramidBaseRadius * scale);
            this.topMaterial.apply();
            this.pyramids[i].display();
            this.scene.popMatrix();
        
            currentY += this.pyramidHeight * 0.5;
        }

        this.scene.popMatrix();
    }
}
