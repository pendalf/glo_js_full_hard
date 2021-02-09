'use strict';

// Функция для добавления первого нуля к числу, если число однозначное
const addZerroBefore = num => {
    return num < 10 ? '0' + num : num + '';
};

// Для вывода в формате (а) напишите функцию, которая будет менять склонение слов в зависимости от числа, "час, часов, часа"
/* 
 * Функция склонения элементов времени принимает переменные
 * digit - цифра
 * oneName - строка: час
 * secondName - строка: часа
 * thirdName - строка: часов
 */
const timeDeclension = (digit, oneName, secondName, thirdName) => {

    let lastDigit = +digit.toString().slice(-1);
    let output = `${digit} `;

    if (
        (lastDigit > 4 && lastDigit < 10) ||
        lastDigit === 0 ||
        (digit > 10 && digit < 15)

    ) {
        output += thirdName;
    } else if (lastDigit > 1 && lastDigit < 5) {
        output += secondName;
    } else {
        output += oneName;
    }

    return output;
};

const timeFormatString = (h, m, s) => {
    let output = '';
    output += timeDeclension(h, 'час', 'часа', 'часов');
    output += ' ' + timeDeclension(m, 'минута', 'минуты', 'минут');
    output += ' ' + timeDeclension(s, 'секунда', 'секунды', 'секунд');

    return output;
}

const start = () => {
    const today = new Date();
    const fullDate = document.querySelector('.full-date');
    const shortDate = document.querySelector('.short-date');
    const timeUpdate = today => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Ноября', 'Декабря', ]
        const YY = today.getFullYear();
        const MM = today.getMonth();
        const DD = today.getDate();
        const HH = today.getHours();
        const ii = today.getMinutes();
        const ss = today.getSeconds();
        // const ms = today.getMilliseconds();
        const day = days[today.getDay()];
        const monthLong = months[MM - 1].toLowerCase();
        // const day = 
        fullDate.innerHTML = `Сегодня ${day}, ${DD} ${monthLong} ${YY} года, ${timeFormatString(HH, ii, ss)}`;
        shortDate.innerHTML = `${addZerroBefore(DD)}.${addZerroBefore(MM)}.${YY} - ${addZerroBefore(HH)}:${addZerroBefore(ii)}:${addZerroBefore(ss)}`;
    };
    timeUpdate(today);
    setTimeout(() => {
        setInterval(() => {
            timeUpdate(new Date());
        }, 1000);
    }, 1000 - today.getMilliseconds());
};

start();