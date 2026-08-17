var indicatorDragMap = new Map();


function drags(box , event) {// This is for sharable indicators
    let boundaries =  box.getBoundingClientRect();
    let newleft = ((event.clientX - event.currentTarget.offsetWidth/2) - boundaries.left)/box.offsetWidth*100;
    let newtop = ((event.clientY - event.currentTarget.offsetHeight/2) - boundaries.top)/box.offsetHeight*100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop >95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
} 


const pressMarkerDrag = (map, draggable, e)=> {
    let dragHandler = (e) => drags(map ,e);
    draggable.addEventListener('mousemove', dragHandler)
    indicatorDragMap.set(draggable, dragHandler);
};
const liftMarkerDrag =  (draggable, event)=> {
    for ( const [key, value] of indicatorDragMap){
        key.removeEventListener('mousemove', value);
        indicatorDragMap.delete(key);
    }
};
