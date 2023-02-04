module.exports = {
  data: {
    layout: "gallery.njk",
    title: "VR Demo // Cranach Masterpieces"
  },
  render(data) {
    let currentYear = 0;
    let lengthTimeline = 0;

    const about = "Lucas Cranach the Elder embodies the ideals of Renaissance man active not only as a painter and printmaker, but also as an entrepreneur and politician. Little can be stated with any certainty about his early life except that he was born in the town of Kronach in Northern Franconia as one of four children to the painter Hans Maler and that his mother's maiden name was Hübner. His exact birth date is unknown, but it was probably in the year 1472. A portrait from 1550 (now in the Uffizi, Florence) bearing an authentic inscription that claims the sitter to be Cranach the Elder aged 77, provides evidence which corresponds with the accounts of the artist's cousin and first biographer, Matthias Gunderam in 1556. ";

    const assets = data.collections.paintingsEN.map((item) => `<img id="${item.metadata.id}" src="${item.metadata.imgSrcProxied}" crossorigin>`);

    const assetsReversed = data.collections.paintingsEN.map((item) => `<img id="${item.metadata.id}-reversed" src="${item.metadata.imgSrcReverseProxied}" crossorigin>`);

    const getRelatedWorks = (item) => {
      if(item.references.length === 0) return '';
      const parentWidth = item.metadata.dimensions.width / 100;
      const widthRelatedWork = parentWidth * 0.2;
      const padding = widthRelatedWork/2;
      
      let count = 0;
      let posX = widthRelatedWork/2;
      
      const relatedWorks = item.references.map(element => {
        const {inventoryNumber} = element;
        const relatedWork = data.collections.paintingsEN.find(item => item.inventoryNumber === inventoryNumber);
        if(!relatedWork) return;
        count++;

        const ratio = relatedWork.metadata.dimensions.width / relatedWork.metadata.dimensions.height;
        const width = widthRelatedWork;
        const height = width/ratio;
        posX = posX + widthRelatedWork + padding;
        const posY = height/2;

        return `
          <a-image src="${relatedWork.metadata.imgSrcProxied}"}" 
            name="related-work"
            position="${posX} ${-posY} 0" 
            width="${width}"
            height="${height}"
            rotation="0 0 0"></a-image>`;
      });

      const relatedWorksWithData = relatedWorks.filter(x => x !== undefined);
      
      if(relatedWorksWithData.length === 0) return '';
      return `
        <a-entity position="-0.3 -0.04 0"
          text="width: 1; lineHeight: 50; align: right; color: white;
          baseline: top;
          wrapCount: 50;
          shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
          value: Related Works"></a-entity>
          ${relatedWorksWithData.join('')}
      `;
    };

    const getYear = (year, position) => {
      if (currentYear === year) return '';

      currentYear = year;
      return `
      <a-entity line="start: -1, -1.10 -${position}; end: -1, 3 -${position};
        opacity: 0.2;
        color: #ffffff;"></a-entity>
      <a-entity rotation="0 90 0" position="-0.9, -2.2, -${position+1.25}"
        text="width: 3; lineHeight: 50; align: right; color: #ffffff;
        baseline: bottom;
        wrapCount: 4;
        transparent: true;
        opacity: 0.05;
        shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Bold.json;
        value: ${year}"></a-entity>
      `;
    };

    const images = data.collections.paintingsEN.reverse().map((item, index) => {
      const position = index * 4;
      lengthTimeline = position;
      const width = item.metadata.dimensions.width / 100;
      const height = item.metadata.dimensions.height / 100;
      const yPos = (height / 2) + 1.2 //(height / 2) - 0.5;
      const artist = item.involvedPersons[0].name;
      const dimensions = item.dimensions.replace(/\n|\r/g, ' ').replace(/  /g, '').replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '');
      
      const description = item.description.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/[^a-zA-Z 0-9\.\,\r\n]/g, '').replace(/  /g, ' ');//item.description.replace(/\n|\r/g, ' ').replace(/  /g, '')replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '');
      return `

        <a-entity id="${item.metadata.id}" name="artefact" position="0 0 -${position}">
          <a-entity 
            name="artefact-image"
            position="0 ${yPos} 0"
            width="${width}"
            height="${height}"
            rotation="0 45 0">

            <a-image
              name="reversed-image"
              src="#${item.metadata.id}-reversed"
              position="0 0 -0.05"
              width="${width}"
              height="${height}"
              rotation="0 180 0" ></a-image>

            <a-image
              name="overall-image"
              src="#${item.metadata.id}"
              large-image="${item.metadata.imgSrcProxiedLarge}"
              small-image="${item.metadata.imgSrcProxied}"
              position="0 0 0"
              width="${width}"
              height="${height}"
              rotation="0 0 0" ></a-image>

              <a-entity position="${-width/2} -${height} 0" rotation="-45 0 0" name="related-works" visible="false">
              ${getRelatedWorks(item)}
              </a-entity>

          </a-entity>
          
          <a-entity position="1.01 0.5 ${(width*5)/2 - 0.5}" rotation="0 90 0" name="extended-info" visible="false">
            <a-entity position="0 0.5 0"
              text="width: 1; lineHeight: 50; align: left; color: white;
              baseline: bottom;
              wrapCount: 30;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${item.metadata.title}"></a-entity>
            <a-entity position="0 0.45 0"
              text="width: 1; lineHeight: 50; align: left; color: white;
              baseline: top;
              wrapCount: 50;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${artist}"></a-entity>
            <a-entity position="0 0.35 0"
              text="width: 1; lineHeight: 50; align: left; color: white;
              baseline: top;
              wrapCount: 50;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${dimensions}\n\n${description}"></a-entity>
          </a-entity>

          <a-entity position="2 ${height*2.5} ${width*2.5 +2}" rotation="0 135 0" name="extended-side-info" visible="false">
            <a-entity position="0 0.5 0"
              text="width: 2; lineHeight: 50; align: left; color: white;
              baseline: bottom;
              wrapCount: 30;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${item.metadata.title}"></a-entity>
            <a-entity position="0 0.4 0"
              text="width: 2; lineHeight: 50; align: left; color: white;
              baseline: top;
              wrapCount: 50;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${artist}\n${dimensions}\n\n${description}"></a-entity>
          </a-entity>

          <a-entity position="0 0 0" name="info" visible="true">
            <a-entity position="1.02 0.65 0"
              text="width: 1; lineHeight: 50; align: left; color: white;
              baseline: top;
              wrapCount: 50;
              shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
              value: ${item.metadata.title}"></a-entity>            
            <a-entity line="start: 0.5 0.7 0; end: 0 1.2 0; color: #aaaaaa; opacity: 0.1; transparent: false;"></a-entity>
          </a-entity>
        </a-entity>

        ${getYear(item.sortingInfo.year, position)}

      `;
    });
    
    return `
  <a-scene light="defaultLightsEnabled: false" fog="type: linear; color: #333333" >
  <a-assets>
    ${assets.join('')}
    ${assetsReversed.join('')}
  </a-assets>
  
  ${images.join('')}

  <a-entity rotation="270 90 0" position="3 -2 ${about.length * -0.5}"
    text="width: ${about.length}; lineHeight: 45; align: left; color: #000000;
    baseline: bottom;
    wrapCount: ${about.length};
    transparent: true;
    opacity: 0.5;
    shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Bold.json;
    value: ${about}"></a-entity>

  <a-entity rotation="0 0 0" position="1.5 -5 5"
    text="width: 5; lineHeight: 45; align: left; color: #ffffff;
    baseline: bottom;
    wrapCount: 20;
    transparent: true;
    opacity: 0.9;
    shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Bold.json;
    value: Cranach Masterpieces"></a-entity>
  <a-entity rotation="0 0 0" position="1.56 -4.9 5"
    text="width: 5; lineHeight: 45; align: left; color: #feb701;
    baseline: top;
    wrapCount: 40;
    shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json;
    value: VR Demo 2022/23"></a-entity>
  <a-sky color="#000000"></a-sky>
  
  <a-entity id="rig" position="0 1.8 0" rotation="0 0 0" movement-controls="fly: true" >
    <a-camera id="camera" position="5 0 15" look-controls extended-wasd-controls="flyEnabled: true; turnEnabled: true; lookEnabled: true; maxLookAngle: 60;"><a-cursor></a-cursor></a-camera>
    <a-entity id="left-controller" oculus-touch-controls="hand: left" ></a-entity>
    <a-entity id="right-controller" oculus-touch-controls="hand: right" oculus-thumbstick-controls orientationOffset="x:20 y:-0.25 z:6"></a-entity>
  </a-entity>

  <a-entity 
  id="controller-data" 
  controller-listener="leftControllerId:  #left-controller; 
                       rightControllerId: #right-controller;">
</a-entity>


<a-entity
id="textArea"
position="0 1.5 -1.9"
geometry="primitive: plane;  width: 3; height: auto"
material="color: #444444; transparent: true; opacity: 0.80;"
text="anchor: center; baseline: center; wrapCount: 40;
    transparent: true; opacity: 0.90; color: #8888FF;
    value: 1 \n 2 \n 3 \n 4"
text-display>
</a-entity>
</a-scene>

    `;
  }
}

/*<a-entity camera look-controls wasd-controls="acceleration:100" position="0 1.6 0"></a-entity>

  <!--a-entity camera look-controls="pointerLockEnabled: true;" wasd-controls position="0 1 -10" animation="property: camera.zoom; from: 1; to: 2; dur: 10000; easing: easeInOutQuad; loop: true; dir: alternate;"></a-entity--> 
  
  <a-entity text="value:Hello; color:#FFFFFF; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/creepster/Creepster-Regular.json;" position="6.7 1 -2"></a-entity>     
  
  */