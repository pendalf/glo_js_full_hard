'use strict';
const elem = document.querySelector('#animation'),
    start = document.querySelector('#start'),
    reset = document.querySelector('#reset'),
    endPos = 100;

let direction = 1,
    play = 0,
    count = 0,
    animation;


function render() {

    if (count === endPos) {
        direction = -1;
    } else if (count === 0) {
        direction = 1;
    }

    count += direction;

    elem.style.left = count + 'px';

}


const animationLoop = function(e) {
    render();
    if (e.target && play) {
        cancelAnimationFrame(animation);
        play = 0;
    } else {
        animation = requestAnimationFrame(animationLoop, elem);
        play = 1;
    }
};

reset.onclick = function(e) {
    count = -1;
    direction = 1;
    play = 0;
    cancelAnimationFrame(animation);
    render();
};


start.onclick = function(e) {
    animationLoop(e);
};