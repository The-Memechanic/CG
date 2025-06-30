import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance ,   CGFshader} from "../lib/CGF.js";
import { MyPanorama } from "./structures/MyPanorama.js";
import { MyBuilding } from "./structures/MyBuilding.js";
import { MyForest } from "./structures/MyForest.js";
import { MyHeli } from "./structures/MyHeli.js";
import { MyFire } from "./structures/MyFire.js";
import { MyLake } from "./structures/MyLake.js";
import { MyGround } from "./structures/MyGround.js";
import { MyWaterFall } from "./structures/MyWaterFall.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.texture = null;
		this.appearance = null;
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    ////////////////////////////////////
    //            GLOBALS             //
    ////////////////////////////////////

    this.lastTime = 0;

    this.displayAxis = true;

    this.fov = 1.0;
    this.speedFactor = 1.0;
    
    this.buildingColor = [0.5, 0.5, 0.5]; // default color for the building
    this.totalWidth = 3;
    this.depth = 1.5;
    this.floors = 3;
    this.windowsPerFloor = 3;

    this.cruisingAltitude = 10;                                 // default cruising altitude

    ////////////////////////////////////
    //            TEXTURES            //
    ////////////////////////////////////

    this.panoramaTexture = new CGFtexture(this, "images/panorama.jpg");
    this.windowTexture = new CGFtexture(this, "images/window.png");
    this.fireTexture = new CGFtexture(this, "images/fire.jpg");
    this.waterTexture = new CGFtexture(this, "images/waterTex.jpg");
    this.groundTexture = new CGFtexture(this, "images/ground.jpg");

    ////////////////////////////////////
    //             OBJECTS            //
    ////////////////////////////////////

    this.axis = new CGFaxis(this, 20, 1);

    this.panorama = new MyPanorama(
      this, 
      this.panoramaTexture  // texture for the panorama background
    );

    this.building = new MyBuilding(
      this, 
      this.totalWidth,      // total width of the building
      this.depth,           // depth of the building
      this.floors,          // number of floors (on the sides)
      this.windowsPerFloor, // number of windows per floor
      this.windowTexture,   // texture for the windows
      this.buildingColor,   // color of the building (0-1 range for RGB)
      20
    );

    var initialHeliPosition = this.building.getTopCoords();     // get the top coordinates of the building for the helicopter

    this.forest = new MyForest(this, 14, 7); // forest with grid dimension parameters

    this.helicopter = new MyHeli(
      this, 
      this.waterTexture,      // reuse the lake texture for the bucket in the heli
      this.cruisingAltitude,  // cruising altitude for the helicopter
      initialHeliPosition, // initial position of the helicopter
    );

    this.waterfall = new MyWaterFall(
      this, 
      this.waterTexture,    // texture for the waterfall
      1.0,                  // height of the waterfall originally
      0.8                   // radius of the waterfall
    );

    this.fire = new MyFire(
      this, 
      20,                 // number of flame triangles
      this.fireTexture,   // texture for the fire
      [50, 0, 50],        // position of the fire
      20                  // scale of the fire (radius)
    );

    this.fire2 = new MyFire(
      this, 
      20,                 // number of flame triangles
      this.fireTexture,   // texture for the fire
      [90, 0, 50],        // position of the fire
      20                  // scale of the fire (radius)
    );

    this.lake = new MyLake(
      this, 
      this.waterTexture,  // texture for the lake
      [50, 0.1, -20],     // center of the lake
      15                  // scale of the lake (radius)
    );

    this.ground = new MyGround(
      this, 
      this.groundTexture  // texture for the ground
    );

    ////////////////////////////////////
    //            SHADERS             //
    ////////////////////////////////////

    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({ uSampler2: 1, timeFactor: 0 });
  }

  /**
   * Initializes the lights in the scene.
   */
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  /**
   * Initializes the camera for the scene.
   */
  initCameras() {
    this.camera = new CGFcamera(
      1.0,
      0.1,
      1000,
      vec3.fromValues(200, 200, 200),
      vec3.fromValues(0, 0, 0)
    );
  }

  // The functions below are used to update the scene parameters from the GUI.
  updateFov() {
    this.camera.fov = this.fov;
  }
  updateSpeedFactor() {
    this.speedFactor = this.speedFactor;
  }
  updateCruisingAltitude() {
    this.cruisingAltitude = this.cruisingAltitude;
    this.helicopter.setCruisingAltitude(this.cruisingAltitude);
    if (this.helicopter.getState() == "FREE") {
      this.helicopter.setState("FIX_HEIGHT"); // if the heli is free, we need to fix its height to the new cruising altitude
    }
  }
  updateBuildingColor() {
    this.buildingColor = this.buildingColor;
    this.building.setColor(this.buildingColor);
  }
  updateBuildingWidth() {
    this.totalWidth = this.totalWidth;
    this.building.setTotalWidth(this.totalWidth);
  }
  updateBuildingDepth() {
    this.depth = this.depth;
    this.building.setDepth(this.depth);
  }
  updateBuildingFloors() {
    this.floors = this.floors;
    this.building.setSideFloors(this.floors);
    if (this.helicopter.getState() == "IDLE") {
      this.helicopter.setPosition(this.building.getTopCoords()); // reposition the heli if it is parked
    }

    if (this.helicopter.getState() == "FREE") {
      this.helicopter.setState("FIX_HEIGHT");
    }

    this.helicopter.setOriginalPosition(this.building.getTopCoords()); // always change the original
    this.helicopter.setCruisingAltitude(this.cruisingAltitude); // update the cruising altitude to match the new building height
  }
  updateBuildingWindowsPerFloor() {
    this.windowsPerFloor = this.windowsPerFloor;
    this.building.setWindowsPerFloor(this.windowsPerFloor);
  }

  /**
   * Checks which keys are pressed and updates the object states accordingly. (It's a massive state machine)
   */
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;
    var currentState = this.helicopter.getState();
    var heliCoords = this.helicopter.getCoords();
    var bucketFull = this.helicopter.getBucketFull();
    var fireCoords = this.fire.getCoords();
    var fireCoords2 = this.fire2.getCoords();

    if (this.gui.isKeyPressed("KeyP")) {
      text += " P ";
      this.keysPressed = true;

      if (currentState == "IDLE") {               // if the heli is parked, start it
        this.helicopter.setState("START");
      } else if (currentState == "WATER_IDLE") {  // if the heli is parked on water, rise it
        this.helicopter.setState("RISING_WATER");
      }
    }

    if (this.gui.isKeyPressed("KeyO")) {
      text += " O ";
      this.keysPressed = true;

      var isOnFire1 = Math.pow(fireCoords.x - heliCoords.x, 2) + Math.pow(fireCoords.z - heliCoords.z, 2) <= Math.pow(fireCoords.radius, 2) && this.fire.getActive();
      var isOnFire2 = Math.pow(fireCoords2.x - heliCoords.x, 2) + Math.pow(fireCoords2.z - heliCoords.z, 2) <= Math.pow(fireCoords2.radius, 2) && this.fire2.getActive();
      var isOnFire = isOnFire1 || isOnFire2; // check if the helicopter is on fire
      if (currentState == "FREE" && bucketFull && isOnFire) { // if we are free and the bucket is full, dump the water
        this.helicopter.setState("DUMP_WATER");
        this.helicopter.stop();
        this.waterfall.setPosition(heliCoords.x, heliCoords.y, heliCoords.z); // set the waterfall position to the helicopter position
        this.waterfall.setState("EXTENDING");
      }
    }

    if (this.gui.isKeyPressed("KeyL")) {
      var lakeCoords = this.lake.getCoords();
      var lakeCenter = lakeCoords.centre;
      var lakeRadius = lakeCoords.radius;
      var heliSpeed = this.helicopter.getSpeed();

      var isOnWater = Math.pow(heliCoords.x - lakeCenter[0], 2) + Math.pow(heliCoords.z - lakeCenter[2], 2) <= Math.pow(lakeRadius - 1, 2);

      text += " L ";
      this.keysPressed = true;

      if (currentState == "FREE" && !bucketFull) {                // L only works if the bucket is empty
        if (!isOnWater) {                                         // if the helicopter is not on top of the water, land it
          this.helicopter.stop();
          this.helicopter.setState("ROTATE_BACK");
        } else if (isOnWater && heliSpeed < 1 && heliSpeed > -1) { // if it is on water and basically stopped, fetch water
          this.helicopter.stop();
          this.helicopter.setState("GET_WATER");
        }
      }
    }

    if (currentState == "FREE") {                       // if we are free, move around
      if (this.gui.isKeyPressed("KeyW")) {              // go forward
        text += " W ";
        this.helicopter.setAcc(2 * this.speedFactor);
        keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyS")) {             // go backward
        text += " S ";
        this.helicopter.setAcc(-2 * this.speedFactor);
        keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyA")) {              // rotate left
        text += " A ";
        this.helicopter.setRotationAcc(-0.1 * this.speedFactor);
        keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyD")) {              // rotate right
        text += " D ";
        this.helicopter.setRotationAcc(0.1 * this.speedFactor);
        keysPressed = true;
      }
    }

    if (this.gui.isKeyPressed("KeyR")) {                // reset the helicopter
      text += " R ";
      this.helicopter.reset();
      keysPressed = true;
    }
    if (keysPressed)
      console.log("text ", text);
  }

  /**
   * Handles the relationship between the states of the helicopter, waterfall, and fire independently of the keys pressed.
   */
  handleStates() {
    var waterfallState = this.waterfall.getState();
    var fireCoords = this.fire.getCoords();
    var fireCoords2 = this.fire2.getCoords();
    var helicopterState = this.helicopter.getState();

    if (waterfallState == "FALLING_WARNING") {        // intermediate state to free the helicopter
      this.helicopter.setState("FINISHED_DUMP");
    }

    if (waterfallState == "FINISHED_FALLING") {       // put the fire out
      var waterfallCoords = this.waterfall.getCoords();
      if (Math.pow(fireCoords.x - waterfallCoords.x, 2) + Math.pow(fireCoords.z - waterfallCoords.z, 2) <= Math.pow(fireCoords.radius + waterfallCoords.radius, 2)) {
        this.fire.setActive(false);
      }
      if(Math.pow(fireCoords2.x - waterfallCoords.x, 2) + Math.pow(fireCoords2.z - waterfallCoords.z, 2) <= Math.pow(fireCoords2.radius + waterfallCoords.radius, 2)) {
        this.fire2.setActive(false);
      }
    }

    if (helicopterState == "RISING") {
      this.building.setHelipadState("UP");
    } else if (helicopterState == "LOWERING_IDLE") {
      this.building.setHelipadState("DOWN");
    } else {
      this.building.setHelipadState("STATIC");
    }
  }

  update(t) {
    if (this.helicopter.getState() == "FREE" || this.helicopter.getState() == "DUMP_WATER") {
      this.helicopter.setAcc(0);
      this.helicopter.setRotationAcc(0);
    }
    this.handleStates();
    this.checkKeys();     // we reset the accelerations before checking the keys, so that we stop when no keys are pressed

    this.helicopter.update((t - this.lastTime) / 100); // update the heli with delta t
    this.waterfall.update((t - this.lastTime) / 100);  // update the waterfall with delta t
    this.building.update((t / 1000) % 1000);  // update the building state with delta t

    this.fireShader.setUniformsValues({ timeFactor: (t / 1000) % 1000 }); // update the fire shader with the time factor

    this.lastTime = t;                                // update lastTime to calculate delta t next time
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) {
      this.axis.display();
    }
    
    this.pushMatrix();
    this.panorama.display();                // panorama background
    this.popMatrix();

    this.pushMatrix();
    this.waterfall.display();               // waterfall
    this.popMatrix();
    

    this.pushMatrix();
    this.ground.display();                  // ground
    this.popMatrix();
    
    this.pushMatrix();
    this.translate(0, 12, 0);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.building.display();                // building
    this.popMatrix();
    
    this.pushMatrix();
    this.translate(this.helicopter.getX(), this.helicopter.getY(), this.helicopter.getZ());
    this.scale(1.5, 1.5, 1.5);
    this.helicopter.display();              // helicopter
    this.popMatrix();
  
    
    this.pushMatrix();
    this.translate(30, 0, 30);
    this.scale(3, 3, 3);
    this.forest.display();                  // forest
    this.popMatrix();

    this.pushMatrix();
    this.setActiveShader(this.fireShader);
    this.fire.display();                    // fire
    this.popMatrix();

    this.pushMatrix();
    this.setActiveShader(this.fireShader);
    this.fire2.display();                    // fire
    this.popMatrix();

    this.setActiveShader(this.defaultShader);   // reset to default shader

    this.pushMatrix();
    this.lake.display();                    // lake
    this.popMatrix();

  }
}
