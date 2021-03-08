'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const select = document.getElementById('cars'),
        output = document.getElementById('output');

    const getCarData = url => new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.setRequestHeader('Content-type', 'application/json');
        request.send();
        request.addEventListener('readystatechange', () => {

            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                const data = JSON.parse(request.responseText);
                resolve(data);
            } else {
                reject('Произошла ошибка');
            }
        });
    });
    const carView = data => {
        data.cars.forEach(item => {
            if (item.brand === select.value) {
                const { brand, model, price } = item;
                output.innerHTML = `Тачка ${brand} ${model} <br>
                        Цена: ${price}$`;
            }
        });
    };

    select.addEventListener('change', () => {
        getCarData('./cars.json')
            .then(carView)
            .catch(err => output.innerHTML = err);
    });

});