'use strict';

/*
Создать массив week и записать в него дни недели в виде строк

·        Вывести на экран все дни недели
·        Каждый из них с новой строчки
·        Выходные дни - курсивом
·        Текущий день - жирным шрифтом(использовать объект даты)
*/

const week = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

week.forEach(function(item, i) {
    const br = document.createElement('br');
    const today = new Date();
    const weekDayToday = today.getDay();
    console.log(weekDayToday);
    if (i === 0 || i === 6) {
        item = item.italics();
    }
    if (i === weekDayToday) {
        item = item.bold();
    }
    document.body.insertAdjacentHTML('beforeend', item);
    document.body.append(br);
});