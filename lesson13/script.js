'use strict';

const colorH1 = document.querySelector('#color'),
    change = document.querySelector('#change');

const colorRandom = function() {
    const r = Math.floor(Math.random() * 256).toString(16),
        g = Math.floor(Math.random() * 256).toString(16),
        b = Math.floor(Math.random() * 256).toString(16);

    return `#${r}${g}${b}`;
};

const render = function() {
    const color = colorRandom();
    document.body.style.background = color;
    change.style.color = color;
    colorH1.textContent = color;
};

change.addEventListener('click', render);

render();