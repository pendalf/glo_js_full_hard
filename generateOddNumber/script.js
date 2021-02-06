'use strict';

// Функция для получения случайного чилса. Максимум и минимум включаются
const generateOddNumber = function(min, max) {
    const minNew = min < max ? Math.ceil(min) : Math.ceil(max);
    const maxNew = min < max ? Math.floor(max) : Math.floor(min);

    let random = Math.floor(Math.random() * (maxNew - minNew + 1)) + minNew;
    if (random === 0 || !(random % 2)) {
        random = generateOddNumber(min, max);
    }
    return random;
};

console.log(generateOddNumber(1, 100));
console.log(generateOddNumber(0, -10));
console.log(generateOddNumber(-7, -3));
console.log(generateOddNumber(-100, 100));
console.log(generateOddNumber(1, -1));