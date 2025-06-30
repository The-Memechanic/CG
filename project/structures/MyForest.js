import { CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";
export class MyForest extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} colNum - Number of columns of trees
     * @param {number} rowNum - Number of rows of trees
     */
    constructor(scene, colNum, rowNum) {
        super(scene);
        this.colNum = colNum;
        this.rowNum = rowNum;
        this.trees = [];
        this.offsets = [];
        this.initTrees();
    }

    initTrees() {

        this.leafTexture = new CGFtexture(this.scene, "images/snowleaf.png");
        this.woodTexture = new CGFtexture(this.scene, "images/wood.jpg");

        // Create a matrix of random trees
        for (let i = 0; i < this.rowNum; i++) {
            let row = [];
            let offsetRow = [];
            for (let j = 0; j < this.colNum; j++) {
                // Randomize tree parameters
                const trunkRadius = 0.4 + Math.random() * 0.2; // Random radius between 0.2 and 0.4
                const trunkHeight = 3   + Math.random() * 4; // Random height between 2 and 4
                const tiltAngle = (Math.random() - 0.5) * 20; // Random tilt between 0 and 0.3
                const tiltDirection = ['X', 'Z'][Math.floor(Math.random() * 2)]; // Random direction
                
                // Slightly randomize tree color
                const color = [Math.random() * 0.8, 0.7 + Math.random() * 0.3, Math.random() * 0.5]; // Random greenish color
                
                // Create tree with random parameters
                row.push(new MyTree(this.scene, trunkRadius, trunkHeight, tiltAngle, tiltDirection, color, this.leafTexture, this.woodTexture));
                //random offset for each tree
                const xOffset = Math.random()*1.5; // Random offset between -0.25 and 0.25
                const zOffset = Math.random()*1.5; // Random offset between -0.25 and 0.25
                offsetRow.push([xOffset, zOffset]);
            }
            this.offsets.push(offsetRow);
            this.trees.push(row);
        }
    }

    display() {
        const xSpacing = 2;
        const zSpacing = 2;
        
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.colNum; j++) {
                this.scene.pushMatrix();
                
                const off_setx = this.offsets[i][j][0];
                const off_setz = this.offsets[i][j][1];
                this.scene.translate(j * xSpacing  + off_setx, 0, i * zSpacing + off_setz );

                this.trees[i][j].display();
                
                this.scene.popMatrix();
            }
        }
    }
}