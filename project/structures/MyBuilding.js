import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyPlane } from '../shapes/MyPlane.js';
import { MyCube } from '../shapes/MyCube.js';
import { MySphere } from '../shapes/MySphere.js';

export class MyBuilding extends CGFobject {
    /**
     * @constructor
     * @param {CGFscene} scene - Reference to the scene
     * @param {number} totalWidth - Total width of the building
     * @param {number} depth - Depth of the building
     * @param {number} sideFloors - Number of floors on the side buildings (center will have one more)
     * @param {number} windowsPerFloor - Number of windows per floor
     * @param {CGFtexture} windowTexture - Texture for the windows
     * @param {Array} buildingColor - Color of the building in RGB
     * @param {number} scale - Scale factor for the building
     */
    constructor(scene, totalWidth, depth, sideFloors, windowsPerFloor, windowTexture, buildingColor, scale = 1) {
        super(scene);
        
        this.totalWidth = totalWidth;
        this.sideFloors = sideFloors;
        this.centralFloors = sideFloors + 1; // Central building has an extra floor
        this.windowsPerFloor = windowsPerFloor;
        this.windowTexture = windowTexture;
        this.buildingColor = buildingColor;
        this.scale = scale;
        
        this.centralWidth = totalWidth * 0.4; // Central building is a little wider
        this.sideWidth = totalWidth * 0.3;
        this.depth = depth;
        this.floorHeight = 0.3;
        this.windowWidth = 0.15;
        this.windowHeight = 0.2;

        this.lightEmissionFrequency = 15;

        this.helipadState = "STATIC";
        this.currentTexture = "H";
        this.helipadSwitchFrequency = 0.5;
        this.currentHelipadSwitchTime = 0;

        this.initBuffers();
        this.initMaterials();
    }

    setColor(color) {
        this.buildingColor = color.map(c => c / 256); // we need to normalize the color
        this.buildingMaterial.setAmbient(...this.buildingColor, 1);
        this.buildingMaterial.setDiffuse(...this.buildingColor, 1);
        this.signAppearance.setAmbient(...this.buildingColor, 1);
        this.signAppearance.setDiffuse(...this.buildingColor, 1);
    }

    updateLightAppearanceEmission(value) {
        this.lightAppearance.setEmission(value, value, 0, 1);
    }

    setHelipadState(state) {
        this.helipadState = state;
    }

    getHelipadState() {
        return this.helipadState;
    }

    initBuffers() {
        this.cube = new MyCube(this.scene);
        this.plane = new MyPlane(this.scene, 1);
        this.light = new MySphere(this.scene, 10, 10);

    }

    initMaterials() {
        this.brickTexture = new CGFtexture(this.scene, 'images/brick.jpg');
        this.signTexture = new CGFtexture(this.scene, 'images/bombeiros.png');
        this.doorTexture = new CGFtexture(this.scene, 'images/door.jpg');
        this.helipadHTexture = new CGFtexture(this.scene, 'images/helipad_texture.jpg');
        this.helipadUpTexture = new CGFtexture(this.scene, 'images/helipad_texture-up.png');
        this.helipadDownTexture = new CGFtexture(this.scene, 'images/helipad_texture-down.png');

        this.helipadShader = new CGFshader(this.scene.gl, "shaders/helipad.vert", "shaders/helipad.frag");
        this.helipadShader.setUniformsValues({
            textureH: 0,
            textureOther: 1,
        });

        this.buildingMaterial = new CGFappearance(this.scene);
        this.buildingMaterial.setAmbient(...this.buildingColor, 1);
        this.buildingMaterial.setDiffuse(...this.buildingColor, 1);
        this.buildingMaterial.setSpecular(0.2, 0.2, 0.2, 1);
        this.buildingMaterial.setShininess(1.0);
        this.buildingMaterial.setTexture(this.brickTexture);

        // helipad lights appearance (initially at 0 emission)
        this.lightAppearance = new CGFappearance(this.scene);
        this.lightAppearance.setAmbient(1.0, 1.0, 0.0, 1);
        this.lightAppearance.setDiffuse(0.3, 0.3, 0.0, 1);
        this.lightAppearance.setEmission(0.0, 0.0, 0.0, 1);
        this.lightAppearance.setShininess(1.0);

        // door appearance
        this.doorAppearance = new CGFappearance(this.scene);
        this.doorAppearance.setAmbient(1, 1, 1, 1);
        this.doorAppearance.setDiffuse(1, 1, 1, 1);
        this.doorAppearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.doorAppearance.setEmission(0.1, 0.1, 0.1, 1);
        this.doorAppearance.setShininess(0.3);
        this.doorAppearance.setTexture(this.doorTexture);

        // sign appearance
        this.signAppearance = new CGFappearance(this.scene);
        this.signAppearance.setAmbient(...this.buildingColor, 1);
        this.signAppearance.setDiffuse(...this.buildingColor, 1);
        this.signAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.signAppearance.setEmission(0.1, 0.1, 0.1, 1);
        this.signAppearance.setShininess(0.5);
        this.signAppearance.setTexture(this.signTexture);

        // helipad appearance
        this.helipadAppearance = new CGFappearance(this.scene);
        this.helipadAppearance.setTexture(this.helipadHTexture);
        
        this.windows = [];
        this.initWindows();
    }

    initWindows() {
        for (let module = 0; module < 3; module++) {
            const moduleWindows = [];
            const isCentral = module === 1;
            const floors = isCentral ? this.centralFloors : this.sideFloors;
            
            for (let floor = 0; floor < floors; floor++) {
                const floorWindows = [];
                
                // Central building has no windows on the first floor
                if (!(isCentral && floor === 0)) {
                    for (let i = 0; i < this.windowsPerFloor; i++) {
                        const window = new MyWindow(
                            this.scene,
                            this.windowTexture,
                            this.windowWidth,
                            this.windowHeight
                        );
                        floorWindows.push(window);
                    }
                }
                moduleWindows.push(floorWindows);
            }
            this.windows.push(moduleWindows);
        }
    }
    
    displayModule(width, floors, offsetX) {
        this.scene.pushMatrix();
        this.scene.translate(offsetX, 0, 0);
        
        // Determine depth for side buildings
        const isSideBuilding = offsetX !== 0;
        const depth = isSideBuilding ? this.depth * 0.75 : this.depth;
    
        // Draw the building itself
        this.buildingMaterial.apply();
        this.scene.pushMatrix();
        this.scene.scale(width, floors * this.floorHeight, depth);
        this.cube.display();
        this.scene.popMatrix();
        
        const moduleIdx = offsetX < 0 ? 0 : (offsetX === 0 ? 1 : 2);
        const windowSpacing = width / (this.windowsPerFloor + 1);
        
        // Check if the current floor has windows and draw them
        if (this.windows[moduleIdx]) {
            for (let floor = 0; floor < floors; floor++) {
    
                // We ignore if there are no windows
                if (!this.windows[moduleIdx][floor] || (moduleIdx === 1 && floor === 0)) continue;
                    
                for (let i = 0; i < this.windowsPerFloor; i++) {
    
                    // Just to make sure
                    if (this.windows[moduleIdx][floor][i]) {
                        this.scene.pushMatrix();
                        const xPos = -width/2 + (i + 1) * windowSpacing;
                        const yPos = -floors * this.floorHeight/2 + floor * this.floorHeight + this.floorHeight/2;
                        this.scene.translate(xPos, yPos, depth/2 + 0.01);
                        this.windows[moduleIdx][floor][i].display();
                        this.scene.popMatrix();
                    }
                }
            }
        }
        
        // Central building extras
        if (moduleIdx === 1) {
    
            // The Door
            this.scene.pushMatrix();
            this.scene.translate(0, -floors * this.floorHeight/2 + this.floorHeight/2 - 0.025, depth/2 + 0.01);
            this.scene.scale(0.2, 0.25, 1);
            this.doorAppearance.apply();
            this.plane.display();
            this.scene.popMatrix();
            
            // 112 há fogo!!
            this.scene.pushMatrix();
            this.scene.translate(0, -floors * this.floorHeight/2 + this.floorHeight, depth/2 + 0.02);
            this.scene.scale(0.4, 0.08, 1);
            this.signAppearance.apply();
            this.plane.display();
            this.scene.popMatrix();
            
            // Helipad
            this.scene.pushMatrix();
            this.scene.translate(0, floors * this.floorHeight / 2 + 0.01, 0);
            this.scene.scale(width, 1, depth);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            
            // We activate the helipad shader whenever it is not static
            if (this.helipadState != "STATIC") {
                this.scene.setActiveShader(this.helipadShader);
                this.helipadHTexture.bind(0);   // regular H texture is always bound
                
                // bind the current state texture for the shader
                if (this.helipadState === "UP") {
                    this.helipadUpTexture.bind(1);
                } else {
                    this.helipadDownTexture.bind(1);
                }
            } else {
                this.helipadAppearance.apply(); // when static, just use the appearance
            }
            
            this.plane.display();
            
            // reset the shader to default
            this.scene.setActiveShader(this.scene.defaultShader);

            this.scene.popMatrix();

            // Helipad lights
            this.scene.pushMatrix();
            this.scene.translate(0, floors * this.floorHeight / 2 + 0.01, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.lightAppearance.apply();

            const positions = [
                [-width / 2 + 0.07, -depth / 2 + 0.07, 0],
                [ width / 2 - 0.07, -depth / 2 + 0.07, 0],
                [-width / 2 + 0.07,  depth / 2 - 0.07, 0],
                [ width / 2 - 0.07,  depth / 2 - 0.07, 0]
            ];

            for (let i = 0; i < 4; i++) {
                const [x, y, z] = positions[i];
                this.scene.pushMatrix();
                this.scene.translate(x, y, z);
                this.scene.scale(0.05,0.05,0.05);
                this.light.display();
                this.scene.popMatrix();
            }

            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }

    setDepth(depth) {
        this.depth = depth;
    }
    setSideFloors(sideFloors) {
        this.sideFloors = sideFloors;
        this.centralFloors = sideFloors + 1;
        this.windows = [];
        this.initWindows(); // After changinf floor size, we need to reinitialize windows
    }
    setWindowsPerFloor(windowsPerFloor) {
        this.windowsPerFloor = windowsPerFloor;
        this.windows = [];
        this.initWindows(); // After changing windows per floor, we need to reinitialize windows too
    }
    setTotalWidth(totalWidth) {
        this.totalWidth = totalWidth;
        this.centralWidth = totalWidth * 0.4;
        this.sideWidth = totalWidth * 0.3;
    }

    update(t) {

        this.helipadShader.setUniformsValues( {timeFactor : t} ); // pass time to the shader for animation

        const lightsOn = this.helipadState !== "STATIC";
        if (lightsOn) {
            this.updateLightAppearanceEmission((Math.sin(this.lightEmissionFrequency * t) + 1) / 2); // alternate between 0 and 1 emission
        } else {
            this.updateLightAppearanceEmission(0);
        }
    }

    getTopCoords() {
        return [0, this.scale * (this.floorHeight * (this.sideFloors + 2) - 0.03), 0];  // returns coordinates of the top of the building to replace the helicopter
    }

    display() {
        this.scene.pushMatrix();

        this.scene.scale(this.scale, this.scale, this.scale);
        this.scene.translate(0, this.floorHeight / 2 * (this.sideFloors - 3), 0);   // adjust vertical position when changing floors number

        // Left building
        this.scene.pushMatrix();
        this.scene.translate(0, -this.floorHeight * 0.5, -this.depth * 0.125); // Adjust vertical position for it's lower height
        this.displayModule(this.sideWidth, this.sideFloors, -this.centralWidth / 2 - this.sideWidth / 2);
        this.scene.popMatrix();
        
        // Center building
        this.displayModule(this.centralWidth, this.centralFloors, 0);
        
        // Right building
        this.scene.pushMatrix();
        this.scene.translate(0, -this.floorHeight * 0.5, -this.depth * 0.125); // Adjust vertical position for it's lower height
        this.displayModule(this.sideWidth, this.sideFloors, this.centralWidth / 2 + this.sideWidth / 2);
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}