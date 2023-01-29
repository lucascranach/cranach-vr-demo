let activeItem = false;

const moveCam = (x, y, z, rotation) => {
    const cam = document.querySelector('#camera');
    const camPosition = rig.getAttribute('position');
    const newCamPosition = `${x} ${y} ${z}`;
    cam.setAttribute('animation__position', {
        property: 'position',
        dur: 4000,
        to: newCamPosition,
        easing: 'easeOutElastic'});

};


const scaleArtefact = (ele, mode) => {

    const scaleFactor = 5;
    const stepTowardsUser = 3;
    const rotateTowardsUser = 90;

    const height = ele.getAttribute('height');
    const position = ele.getAttribute('position');

    const newHeight = mode === 'backInLine' ? height : height * scaleFactor;
    const rotation = mode === 'backInLine' ? 45: rotateTowardsUser;
    const scale = mode === 'backInLine' ? 1 : scaleFactor;
    const xPos = mode === 'backInLine' ? 0 : stepTowardsUser;
    const yPos = (newHeight / 2) + 1.2;

    const newPosition = `${xPos} ${yPos} ${position.z}`;

    ele.setAttribute('animation__scale', {
        property: 'scale',
        dur: 1000,
        to: `${scale} ${scale} ${scale}`,
        easing: 'easeOutElastic'});
    ele.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: 4000,
        to: `0 ${rotation} 0`,
        easing: 'easeOutElastic'});
    ele.setAttribute('animation__position', {
        property: 'position',
        dur: 4000,
        to: newPosition,
        easing: 'easeOutElastic'});
    
    return position;
};



const focusArtefact = (ele) => {
    
    if(activeItem === ele){
        scaleArtefact(activeItem, 'backInLine');
        activeItem = false;
        return;
    }

    if(activeItem !== false){
        scaleArtefact(activeItem, 'backInLine');
    };
    const position = scaleArtefact(ele);
    moveCam(20, 0, position.z);
    activeItem = ele;
};

const addEventListenerToEntity = (entity) => (event) =>{
    focusArtefact(event.target);

  };

window.addEventListener('DOMContentLoaded', (event) => {
    

    const entities = document.querySelectorAll('a-image');
    entities.forEach(entity => entity.addEventListener('click', addEventListenerToEntity(entity)));


    
});

