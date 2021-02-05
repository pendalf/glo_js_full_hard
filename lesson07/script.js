'use strict';

/*
Создать массив week и записать в него дни недели в виде строк

·        Вывести на экран все дни недели
·        Каждый из них с новой строчки
·        Выходные дни - курсивом
·        Текущий день - жирным шрифтом(использовать объект даты)
*/

const week = ['Понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

week.forEach(function(item, i) {
    const br = document.createElement('br');
    const today = new Date();
    const weekDayToday = today.getDay();
    console.log(weekDayToday);
    if (i > 4) {
        item = item.italics();
    }
    if (i === weekDayToday - 1) {
        item = item.bold();
    }
    document.body.insertAdjacentHTML('beforeend', item);
    document.body.append(br);
});