import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        var fCamera = this.gui.addFolder('Camera');
        fCamera.add(this.scene, 'fov', 0.1, 3).name('Fov Factor').onChange(this.scene.updateFov.bind(this.scene));

        var fBuilding = this.gui.addFolder('Building');
        fBuilding.addColor(this.scene, 'buildingColor').name('Building Color').onChange(this.scene.updateBuildingColor.bind(this.scene));
        fBuilding.add(this.scene, 'depth', 1, 10).name('Building Depth').onChange(this.scene.updateBuildingDepth.bind(this.scene));
        fBuilding.add(this.scene, 'floors', 1, 10).step(1).name('Building Floors').onChange(this.scene.updateBuildingFloors.bind(this.scene));
        fBuilding.add(this.scene, 'totalWidth', 1, 10).name('Building Width').onChange(this.scene.updateBuildingWidth.bind(this.scene));
        fBuilding.add(this.scene, 'windowsPerFloor', 0, 10).step(1).name('Windows Per Floor').onChange(this.scene.updateBuildingWindowsPerFloor.bind(this.scene));

        var fHeli = this.gui.addFolder('Helicopter');
        fHeli.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor').onChange(this.scene.updateSpeedFactor.bind(this.scene));
        fHeli.add(this.scene, 'cruisingAltitude', 10, 50).step(10).name('Cruising Altitude').onChange(this.scene.updateCruisingAltitude.bind(this.scene));

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}