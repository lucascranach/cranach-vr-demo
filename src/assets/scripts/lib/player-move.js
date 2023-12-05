AFRAME.registerComponent("player-move", {

    schema:
    {
        // the id of the element with constroller listener component attached
        controllerListenerId:  {type: 'string', default: "#controller-data"},
        // the id of the element with raycaster attached, for teleport movement
        raycasterId:           {type: 'string', default: "#right-controller"},
        navigationMeshClass:   {type: 'string', default: "navMesh"},
        teleportEnabled:       {type: 'boolean', default: false},
        motionEnabled:         {type: 'boolean', default: false},
    },

    init: function() 
    {
        this.controllerData = document.querySelector(this.data.controllerListenerId).components["controller-listener"];

        // use raycaster data for teleport
        if ( document.querySelector(this.data.raycasterId) )
            this.raycaster = document.querySelector(this.data.raycasterId).components["raycaster"];
        else
            this.raycaster = null;

        this.clock = new THREE.Clock();

        this.moveSpeed = 1; // units per second

        // create a vector to store camera direction
        this.cameraDirection = new THREE.Vector3();

        // quick turns
        this.turnReady = true;
        this.startAngle = 0;
        this.endAngle = 0;
        this.turnInProgress = false;
        this.turnAngle = 45;
        this.turnDuration = 0.10;
        this.turnTime = 0;

        // other components may set this value to enable/disable this component
        this.enabled = true;
    },

    lerp: function(startValue, endValue, percent)
    {
        return startValue + (endValue - startValue) * percent;
    },

    tick: function()
    {
        // always update deltaTime!
        this.deltaTime = this.clock.getDelta();

        // =====================================================================
        // moving on horizontal (XZ) plane
        // =====================================================================

        // move with left joystick (while not pressing left grip);
        //   move faster when pressing trigger
        this.leftJoystickLength = Math.sqrt(this.controllerData.leftAxisX * this.controllerData.leftAxisX + 
                                           this.controllerData.leftAxisY * this.controllerData.leftAxisY );

        if ( this.data.motionEnabled &&
             this.leftJoystickLength > 0.001 && 
             !this.controllerData.leftGrip.pressing )
        {
            // this.cameraDirection: a vector to store camera direction
            this.el.sceneEl.camera.getWorldDirection(this.cameraDirection);
            this.cameraAngle = Math.atan2(this.cameraDirection.z, this.cameraDirection.x);

            this.leftJoystickAngle = Math.atan2(this.controllerData.leftAxisY, this.controllerData.leftAxisX);
            
            this.moveAngle = this.cameraAngle + this.leftJoystickAngle;

            this.moveDistance = this.moveSpeed * this.deltaTime;

            // move faster if pressing trigger at same time
            this.moveDistance *= (1 + 9 * this.controllerData.leftTrigger.value);

            // convert move distance and angle to right and forward amounts
            // scale by magnitude of joystick press (smaller press moves player slower)
            this.moveRight   = -this.leftJoystickLength * Math.sin(this.moveAngle) * this.moveDistance;
            this.moveForward =  this.leftJoystickLength * Math.cos(this.moveAngle) * this.moveDistance;
            
            this.el.object3D.position.x = this.el.object3D.position.x + this.moveRight;
            this.el.object3D.position.z = this.el.object3D.position.z + this.moveForward;
        }

        // =====================================================================
        // turning in horizontal (XZ) plane
        // =====================================================================

        // while pressing left grip, press left joystick left/right to turn left/right by N degrees;
        // -or- just press right joystick left/right to turn left/right by N degrees.
        //  joystick must return to rest/center position before turning again
        this.leftX  = this.controllerData.leftAxisX;
        this.rightX = this.controllerData.rightAxisX;
        
        if ( Math.abs(this.leftX) < 0.10 && Math.abs(this.rightX) < 0.10 )
        {           
            this.turnReady = true;
        }

        if ( this.data.motionEnabled && this.turnReady &&
             ((this.controllerData.leftGrip.pressing && Math.abs(this.leftX) > 0.90) || Math.abs(this.rightX) > 0.90)
           )
        {
            this.startAngle = this.el.getAttribute("rotation").y;

            if ( this.leftX > 0.90 || this.rightX > 0.90 )
                this.endAngle = this.startAngle - this.turnAngle;
            if ( this.leftX < -0.90 || this.rightX < -0.90 )
                this.endAngle = this.startAngle + this.turnAngle;

            this.turnInProgress = true;
            this.turnTime = 0;
            this.turnReady = false;
        }

        if (this.turnInProgress)
        {
            this.turnTime += this.deltaTime;
            this.rot = this.el.getAttribute("rotation");
            this.rot.y = this.lerp(this.startAngle, this.endAngle, this.turnTime/this.turnDuration);
            this.el.setAttribute("rotation", this.rot);
            
            if (this.turnTime >= this.turnDuration)
                this.turnInProgress = false;
        }

        // =====================================================================
        // vertical movement (Y axis)
        // =====================================================================

        // while pressing left grip, press left joystick up/down to move up/down;
        //   move faster while pressing trigger.
        // includes extended deadzone adjustment 
        //   to avoid unintended simultaneous turning and vertical movement
        if ( this.data.motionEnabled && 
             this.controllerData.leftGrip.pressing && 
             Math.abs(this.controllerData.leftAxisY) > 0.25 )
        {
            this.y = this.controllerData.leftAxisY;
            this.y = Math.sign(this.y) * (Math.abs(this.y) - 1/4);
            this.moveDistance = -this.moveSpeed * this.y * this.deltaTime;
            // move faster if pressing trigger at same time
            this.moveDistance *= (1 + 9 * this.controllerData.leftTrigger.value);

            this.el.object3D.position.y = this.el.object3D.position.y + this.moveDistance;
        }
    }
});
