module.exports = {
  data: {
    layout: "gallery.njk",
    title: "BestOf"
  },
  render(data) {
    let currentYear = 0;

    const assets = data.collections.paintingsEN.map((item) => `<img id="${item.metadata.id}" src="${item.metadata.imgSrcProxied}" crossorigin>`);

    const getYear = (year, position) => {
      if (currentYear === year) return '';

      currentYear = year;
      return `
      <a-entity line="start: -1, -1.10 -${position}; end: -1, 3 -${position};
        opacity: 0.2;
        color: #feb701;"></a-entity>
      <a-entity rotation="0 90 0" position="-1, -2.2, -${position+1.22}"
        text="width: 3; lineHeight: 50; align: right; color: #feb701;
        baseline: bottom;
        wrapCount: 4;
        transparent: true;
        opacity: 0.1;
        shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Bold.json;
        value: ${year}"></a-entity>
      `;
    };

    const images = data.collections.paintingsEN.reverse().map((item, index) => {
      const position = index * 4;
      const width = item.metadata.dimensions.width / 100;
      const height = item.metadata.dimensions.height / 100;
      const yPos = (height / 2) + 1.2 //(height / 2) - 0.5;
      const artist = item.involvedPersons[0].name;
      return `
      
        <a-image
          src="#${item.metadata.id}" 
          position="0, ${yPos}, -${position}"
          width="${width}"
          height="${height}"
          rotation="0 45 0" ></a-image>

        <a-entity position="1.02, -1.05, -${position}"
          id="${item.metadata.id}"
          text="width: 1; lineHeight: 50; align: left; color: white;
          baseline: bottom;
          wrapCount: 30;
          shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
          value: ${item.metadata.title}"></a-entity>


        <a-entity position="1.02, -1.06, -${position}"
          text="width: 1; lineHeight: 50; align: left; color: white;
          baseline: top;
          wrapCount: 50;
          shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
          value: ${artist}"></a-entity>
        
        
        <a-entity line="start: 0.5 -1.02 -${position}; end: 0 -0.5 -${position}; color: #555555"></a-entity>
        ${getYear(item.sortingInfo.year, position)}

      `;
    });
    return `
  <a-scene light="defaultLightsEnabled: false" fog="type: linear; color: #333333" >
  <a-assets>
    ${assets.join('')}
  </a-assets>
  
  ${images.join('')}

  <a-entity rotation="0 0 0" position="1.5 -5 5"
    text="width: 5; lineHeight: 45; align: left; color: #ffffff;
    baseline: bottom;
    wrapCount: 20;
    transparent: true;
    opacity: 0.3;
    shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Bold.json;
    value: Cranach\nMasterpieces"></a-entity>
  <a-sky color="#000000"></a-sky>
  
  <a-entity id="rig" position="0 1.8 0" rotation="0 0 0" movement-controls="fly: true" >
    <a-camera id="camera" position="5 0 15" look-controls extended-wasd-controls="flyEnabled: true; turnEnabled: true; lookEnabled: true; maxLookAngle: 60;"><a-cursor></a-cursor></a-camera>
    <a-entity oculus-touch-controls="hand: left" ></a-entity>
    <a-entity oculus-touch-controls="hand: right" oculus-thumbstick-controls  orientationOffset="x:2 y:-0.25 z:6"></a-entity>
  </a-entity>
</a-scene>

    `;
  }
}

/*<a-entity camera look-controls wasd-controls="acceleration:100" position="0 1.6 0"></a-entity>

  <!--a-entity camera look-controls="pointerLockEnabled: true;" wasd-controls position="0 1 -10" animation="property: camera.zoom; from: 1; to: 2; dur: 10000; easing: easeInOutQuad; loop: true; dir: alternate;"></a-entity--> 
  
  <a-entity text="value:Hello; color:#FFFFFF; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/creepster/Creepster-Regular.json;" position="6.7 1 -2"></a-entity>     
  
  */