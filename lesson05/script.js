'use strict';
/*
Создать массив arr = []

— Записать в него 7 любых многозначных чисел в виде строк
— Вывести в консоль только те, что начинаются с цифры 2 или 4 (Должны присутствовать в массиве)

*/
let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const arr = ['1651461651', '498651611', '4164169', '694168768', '291316541498', '46416541', '76314693'];

for (let i = 0; i < arr.length; i++) {
    if (isNumber(arr[i]) && /^[2,4]/.test(+arr[i])) {
        console.log(arr[i]);
    }
}

/*

2) Вывести в столбик все простые числа от 1 до 100 (сделать при помощи цикла)

— Статья про простые числа - КЛИК
— Рядом с каждым числом написать оба делителя данного числа
    Например: “Делители этого числа: 1 и n”

*/

let isSimple = num => {
    let i = num;

    do {
        --i;
        if (num === 2) {
            return true;
        } else if (!(num % i)) {
            return false;
        }
    } while (i > 2);
    return true;
}

for (let index = 2; index < 101; index++) {
    if (isSimple(index)) {
        const br = document.createElement('br');
        document.body.append(`${index} - Делители этого числа: 1 и ${index}`);
        document.body.append(br);
    }
}