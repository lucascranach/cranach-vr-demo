AFRAME.registerComponent('timeline-item', {

    schema: {
        start: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        end: {type: 'vec3', default: {x: 1, y: 1, z: 1}},
      },
    
      multiple: true,

      init: function () {
        var scene = this.el.sceneEl.object3D;
        var data = this.data;
        var el = this.el;
        const opacity = 1;
        const color = '#feb701';

        this.rendererSystem = this.el.sceneEl.systems.renderer;
        this.material = new THREE.LineBasicMaterial({
          color: color,
          opacity: opacity,
          transparent: opacity < 1,
          visible: true
        });

        this.el.object3D.visible = true;
        const points = [];
        points.push( new THREE.Vector3( data.start.x, data.start.y, data.start.z ) );
        points.push( new THREE.Vector3( data.end.x, data.end.y, data.end.z ) );
        
        console.log(data.start);
        console.log(data.end);
        console.log(points);
        this.geometry = new THREE.BufferGeometry().setFromPoints( points );
        this.rendererSystem.applyColorCorrection(this.material.color);
        this.item = new THREE.Line(this.geometry, this.material);
        el.setObject3D('mesh', this.item);

        // scene.render();
        // el.render( scene, camera );
      },


      update: function (oldData) {
        const data = this.data;
        const geometry = this.geometry;
        const geoNeedsUpdate = false;
        const material = this.material;
        const positionArray = geometry.attributes.position.array;
    

    
        material.color.setStyle(data.color);
        this.rendererSystem.applyColorCorrection(material.color);
        material.opacity = data.opacity;
        material.transparent = data.opacity < 1;
        material.visible = data.visible;
      },
    
      remove: function () {
        this.el.removeObject3D(this.attrName, this.line);
      }
  });

