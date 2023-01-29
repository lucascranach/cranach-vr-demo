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

const animateImage = (params) => {

    const {item, scale, rotation, position} = params;

    item.setAttribute('animation__scale', {
        property: 'scale',
        dur: 1000,
        to: `${scale} ${scale} ${scale}`,
        easing: 'easeOutElastic'});
    item.setAttribute('animation__rotation', {
        property: 'rotation',
        dur: 4000,
        to: `0 ${rotation} 0`,
        easing: 'easeOutElastic'});
    item.setAttribute('animation__position', {
        property: 'position',
        dur: 4000,
        to: position,
        easing: 'easeOutElastic'});
};

const transformImage = (image, mode) => {

    const scaleFactor = 5;
    const stepTowardsUser = 2;
    const rotateTowardsUser = 90;

    const overallImage = image.querySelector('[name="overall-image"]');
    const largeImageUrl = overallImage.getAttribute('large-image');
    const smallImageUrl = overallImage.getAttribute('large-image');
    const imgUrl = 'backInLine' ? smallImageUrl : largeImageUrl;
    overallImage.setAttribute('src', imgUrl);

    const height = image.getAttribute('height');
    const position = image.getAttribute('position');

    const newHeight = mode === 'backInLine' ? height : height * scaleFactor;
    const rotation = mode === 'backInLine' ? 45: rotateTowardsUser;
    const scale = mode === 'backInLine' ? 1 : scaleFactor;
    const xPos = mode === 'backInLine' ? 0 : stepTowardsUser;
    const yPos = (newHeight / 2) + 1.2;
    const yPosExtendedInfo = 0;

    const newPosition = `${xPos} ${yPos} ${position.z}`;

    animateImage({item: image, scale, rotation, position: newPosition});

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
    // const extendedInfo = artefact.querySelector('[name="extended-info"]');
    const extendedSideInfo = artefact.querySelector('[name="extended-side-info"]');
    
    const infoVisibiity = info.getAttribute('visible') === true ? false : true;
    // const extendedInfoVisibiity = extendedInfo.getAttribute('visible') === true ? false : true;
    const extendedSideInfoVisibiity = extendedSideInfo.getAttribute('visible') === true ? false : true;
    
    info.setAttribute("visible",infoVisibiity);
    // extendedInfo.setAttribute("visible",extendedInfoVisibiity);
    extendedSideInfo.setAttribute("visible",extendedSideInfoVisibiity);
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
    const image = artefact.querySelector('[name="artefact-image"]');

    if(activeItem === artefact){
        const activeItemImage = activeItem.querySelector('[name="artefact-image"]');
        transformImage(activeItemImage, 'backInLine');
        toggleInfo(activeItem);
        activeItem = false;
        return;
    }
    
    if(activeItem !== false){
        const activeItemImage = activeItem.querySelector('[name="artefact-image"]');
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

