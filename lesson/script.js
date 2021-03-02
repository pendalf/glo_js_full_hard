'use strict';

/* 

[x] 1.Написать скрипт, которые заменяет слово "функция" и его однокоренные слова в div с id=task1 на «<strong>функция</strong>». 

[x] 2. Написать скрипт который в div с id=task2 найдет время. Время имеет формат часы:минуты. И часы, и минуты состоят из двух цифр, пример: 09:00.
заключить найденное время в тег <b></b>

[x] 3. Создать запрос во всем документе найти текст в кавычках и заключить его в теги <mark></mark>

[x] 4. Замените в документе домены вида http://site.ru на <a href="http://site.ru">site.ru</a>, 

[x] 5. Напишите регулярное выражение для поиска цвета, заданного как #ABCDEF, вывести цвет в консоль

[X] 6. Ссылки такого вида http://site.ru/aaaa/bbbb.html заменить
на <a href="http://site.ru/aaaa/bbbb.html">site.ru</a>


Попрактикуйтесь на кроссвордах https://regexcrossword.com/
и на задачках https://habr.com/ru/post/167015/
 */

const task1 = document.getElementById('task1'),
    task2 = document.getElementById('task2'),
    body = document.body;

task1.innerHTML = task1.innerHTML.replace(/(функци.*?)(?= )/g, '<strong>$1</strong>');
task2.innerHTML = task2.innerHTML.replace(/([\d]{2}:[\d]{2})/g, '<b>$1</b>');

const replaceQuotes = (match) => match.replace(/(?<=[«'"])(.*?)(?=[»'"])/g, '<mark>$1</mark>');

body.innerHTML = body.innerHTML.replace(
    /(?<=<([^\s]*).*?>)[\s\S]*?(?=<\/\1>)/g,
    (match, i) => i !== 'script' && i !== 'style' ? replaceQuotes(match) : match);

body.innerHTML = body.innerHTML.replace(/([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\/?(?![-a-zA-Z0-9@:%_\+~#?&//=]))/g, '<a href="$1">$1</a>');

const colors = body.innerHTML.match(/#[\da-fA-F]{6}/g);
console.log(colors);

body.innerHTML = body.innerHTML.replace(/(https?:\/\/([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4})\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*))/g, '<a href="$1">$2</a>');