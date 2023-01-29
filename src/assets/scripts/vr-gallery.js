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

const transformImage = (image, mode) => {

    const scaleFactor = 5;
    const stepTowardsUser = 1;
    const rotateTowardsUser = 90;

    const largeImageUrl = image.getAttribute('large-image');
    image.setAttribute('src', largeImageUrl);

    const height = image.getAttribute('height');
    const position = image.getAttribute('position');

    const newHeight = mode === 'backInLine' ? height : height * scaleFactor;
    const rotation = mode === 'backInLine' ? 45: rotateTowardsUser;
    const scale = mode === 'backInLine' ? 1 : scaleFactor;
    const xPos = mode === 'backInLine' ? 0 : stepTowardsUser;
    const yPos = (newHeight / 2) + 1.2;
    const yPosExtendedInfo = 0;

    const newPosition = `${xPos} ${yPos} ${position.z}`;

    image.setAttribute('animation__scale', {
        property: 'scale',
        dur: 1000,
        to: `${scale} ${scale} ${scale}`,
        easing: 'easeOutElastic'});
    image.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: 4000,
        to: `0 ${rotation} 0`,
        easing: 'easeOutElastic'});
    image.setAttribute('animation__position', {
        property: 'position',
        dur: 4000,
        to: newPosition,
        easing: 'easeOutElastic'});
    return yPosExtendedInfo;
};

const transformInfo = (info, imagePosition, mode) => {

    const imageXPos = imagePosition.x;
    const imageYPos = imagePosition.y;
    const imageZPos = imagePosition.z;

    const scaleFactor = 5;
    const stepTowardsUser = 3;

    const line = info.querySelector('[line]');
    line.setAttribute('line', { visible: false });
    
    const position = info.getAttribute('position');
    const xPos = mode === 'backInLine' ? 0 : stepTowardsUser;
    const newPosition = `${stepTowardsUser} 0 ${imageZPos}`;
    const scale = mode === 'backInLine' ? 1 : scaleFactor;

    info.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: 1000,
        to: `0 90 0`,
        easing: 'easeInQuad'});
    info.setAttribute('animation__position', {
        property: 'position',
        dur: 1000,
        to: newPosition,
        easing: 'easeInQuad'});
    info.setAttribute('animation__scale', {
        property: 'scale',
        dur: 1000,
        to: `${scale} ${scale} ${scale}`,
        easing: 'easeInQuad'});
};

const toggleInfo = (artefact) => {

    const info = artefact.querySelector('[name="info"]');
    const extendedInfo = artefact.querySelector('[name="extended-info"]');
    
    const infoVisibiity = info.getAttribute('visible') === true ? false : true;
    const extendedInfoVisibiity = extendedInfo.getAttribute('visible') === true ? false : true;
    
    info.setAttribute("visible",infoVisibiity);
    extendedInfo.setAttribute("visible",extendedInfoVisibiity);
};

const moveExtendedInfo = (artefact, yPosExtendedInfo) => {
    
    const yPos = yPosExtendedInfo;
    const extendedInfo = artefact.querySelector('[name="extended-info"]');
    const position = extendedInfo.getAttribute('position');
    const newPosition = `${position.x} ${yPos} ${position.z}`;

    extendedInfo.setAttribute('animation__position', {
        property: 'position',
        dur: 1000,
        to: newPosition,
        easing: 'easeInQuad'});
};

const focusArtefact = (ele) => {

    const artefact = ele.closest('[name="artefact"]');
    const image = artefact.querySelector('a-image');

    if(activeItem === artefact){
        const activeItemImage = activeItem.querySelector('a-image');
        transformImage(activeItemImage, 'backInLine');
        toggleInfo(activeItem);
        activeItem = false;
        return;
    }
    
    if(activeItem !== false){
        const activeItemImage = activeItem.querySelector('a-image');
        transformImage(activeItemImage, 'backInLine');
        toggleInfo(activeItem);
    };

    const yPosExtendedInfo = transformImage(image, 'focus');
    moveExtendedInfo(artefact, yPosExtendedInfo);
    toggleInfo(artefact);

    const position = artefact.getAttribute('position');
    moveCam(20, 0, position.z);
    activeItem = artefact;
};

/* Main
############################################################################ */

const addEventListenerToEntity = (entity) => (event) =>{
    focusArtefact(event.target);
};

window.addEventListener('DOMContentLoaded', (event) => {

    const entities = document.querySelectorAll('[name="artefact"]');
    entities.forEach(entity => entity.addEventListener('click', addEventListenerToEntity(entity)));
    
});

