'use strict';

/*
Переменная lang может принимать 2 значения: 'ru' 'en'.
Написать условия при котором в зависимости от значения lang будут выводится дни недели на русском или английском языке. Решите задачу
    через if, 
    через switch-case 
    через многомерный массив без ифов и switch.
*/

const lang = confirm('Показывать дни недели на русском?') ? 'ru' : 'en';
const days = {
    ru: 'Понедельник, вторник, среда, четверг, пятница, суббота, воскресенье',
    en: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
};

if (lang === 'ru') {
    console.log(days.ru);
} else {
    console.log(days.en);
}

switch (lang) {
    case 'ru':
        console.log(days.ru);
        break;
    case 'en':
        console.log(days.en);
        break;

    default:
        break;
}

console.log(days[lang]);

/*
    У нас есть переменная namePerson. Если значение этой переменной “Артем” то вывести в консоль “директор”, если значение “Максим” то вывести в консоль “преподаватель”, с любым другим значением вывести в консоль “студент”
    Решить задачу с помощью нескольких тернарных операторов, без использования if или switch
*/

const namePerson = 'Артем01';
const position = namePerson === 'Артем' ? 'директор' : namePerson === 'Максим' ? 'преподаватель' : 'студент';
console.log(position);