'use strict';

const _textInsert = function() {
    const input = document.querySelector('#input'),
        text = document.querySelector('#text');
    return function() {
        text.textContent = input.value;
    }
}

const debounce = function(f, t) {
    return function(args) {
        let previousCall = this.lastCall || undefined;
        this.lastCall = Date.now();
        if (previousCall && ((this.lastCall - previousCall) <= t)) {
            clearTimeout(this.lastCallTimer);
        }
        this.lastCallTimer = setTimeout(() => f(args), t);
    };
};

const textInsert = _textInsert();

input.addEventListener('input', debounce(textInsert, 300));