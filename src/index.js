import './css/style.css';
import './scss/style.scss';
import './index.html';

import imageJpg from './img/house.jpg';

'use strict';
(() => {
    const btnClick = document.getElementById('click');
    const str = 'world!';
    btnClick.addEventListener('click', () => {
        btnClick.textContent = `Hello ${str}`;
    });

    const block = document.createElement('div');
    block.innerHTML = `<img src="${imageJpg}">`;
    document.body.append(block);
})()