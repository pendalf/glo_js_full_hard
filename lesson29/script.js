'use strict';

class Exchange {

    constructor(selector) {
        const form = document.querySelector(selector);
        // Exchange.count = Exchange.count ? Exchange.count : 0;
        if (form) {
            this.form = form;
            this.id = Exchange.count++;
            this.mainCur = null;
            this.from = null;
            this.to = null;
        } else {
            console.warn(`DOM Element with selector "${selector}" is not found`);
        }
    }

    static count = 0;

    init() {
        if (this.form) {
            this.form.innerHTML = this.formsElements();

            this.form.classList.add('exchange');
            this.labelFrom = this.form.querySelector('.exchange__from');
            this.labelTo = this.form.querySelector('.exchange__to');
            this.inputFrom = this.form.querySelector('[name=from]');
            this.inputTo = this.form.querySelector('[name=to]');
            this.select = this.form.querySelector('.exchange__select');

            this.selectList();
            this.render();
            this.handlers();
        }
    }

    render() {
        this.labelFrom.textContent = `${this.getCurrencyName(this.from)} (${this.from})`;
        this.labelTo.textContent = `${this.getCurrencyName(this.to)} (${this.to})`;
        this.inputFrom.value = '';
        this.inputTo.value = '';

        this.getUrl();
    }

    handlers() {
        this.form.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('exchange__convert')) {
                e.preventDefault();
                this.convert();
            }
            if (target.classList.contains('exchange__reverse')) {
                e.preventDefault();
                this.reverse();
                this.render();
            }
        });
        this.select.addEventListener('change', e => {
            const currency = e.target.value;
            this.setSecondaryCurrency(currency);
            this.render();
        });
        this.inputFrom.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/^0/, '').replace(/^((\d+\.?\d{0,2})|.).*/, '$2');
        });
    }

    reverse() {
        const to = this.to;
        this.to = this.from;
        this.from = to;
    }

    convert() {
        const rates = this.rates();
        rates
            .then(res => {
                this.inputTo.value = (this.inputFrom.value * res[this.to]).toFixed(2);
            })
            .catch(err => console.error(err));
    }

    setSecondaryCurrency(cur) {
        if (this.from === this.mainCur) {
            this.to = cur;
        } else {
            this.from = cur;
        }
    }

    rates() {
        return fetch(this.getUrl())
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Service is unavailable!');
                }
                return res.json();
            })
            .then(data => data.rates);
    }

    getUrl() {
        const url = new URL('https://api.exchangeratesapi.io/latest');
        url.searchParams.append('base', this.from);
        url.searchParams.append('symbols', this.to);
        return url.toString();
    }

    currencySettings() {
        return {
            USD: {
                name: 'Доллар США',
                init: 'from'
            },
            RUB: {
                name: 'Российский Рубль',
                init: 'to',
                main: true //Основная валюта
            },
            EUR: {
                name: 'Евро'
            }
        };
    }

    getCurrencyName(cur) {
        return this.currencySettings()[cur].name;
    }

    selectList() {
        Object.entries(this.currencySettings()).forEach(([cur, opt]) => {
            switch (opt.init) {
                case 'from':
                    this.from = cur;
                    break;
                case 'to':
                    this.to = cur;
                    break;
                default:
                    break;
            }
            if (!opt.main) {
                this.select.insertAdjacentHTML('beforeend',
                    `<option value="${cur}"${opt.init === 'from' ? ' selected' : ''}>${opt.name}</option>`
                );
            } else {
                this.mainCur = cur;
            }
        });
    }

    formsElements() {
        return `
            <label for="exchange__select-${this.id}">Выберите валюту для обмена</label>
            <select class="exchange__select" id="exchange__select-${this.id}"></select>
            <div class="exchange__row">
                <div class="exchange__item">
                    <input type="text" name="from" />
                    <span class="exchange__from"></span>
                </div>
                <div class="exchange__item">
                    <button class="exchange__reverse" title="Изменить направление конвертации"><- -></button>
                </div>
                <div class="exchange__item">
                    <input type="text" name="to" disabled="disabled" />
                    <span class="exchange__to"></span>
                </div>
            </div>
            <button class="exchange__convert">Конвертировать</button>
        `;
    }
}

const form = new Exchange('#exchange');
form.init();