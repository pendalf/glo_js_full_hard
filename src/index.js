'use strict';
(() => {
    const btnClick = document.getElementById('click');
    const str = 'world!';
    btnClick.addEventListener('click', () => {
        btnClick.textContent = `Hello ${str}`;
    });
})()