import imageResize from './imageResize';
import cookie from './cookies';

class Cards {
    /**
     * TODO:
     * [x] - исправить работу поиска при отключении всех фильтров
     * [x] - Исправить работу фильтра по фильмам при переключении на "--Choose film--"
     * [x] - поиск по фильмам
     * [ ] - сворачивание фильмов
     * [ ] - добавить сортировку
     * [x] - добавить конвертацию картинок при помощи js
     * [ ] - реализовать хранение карточек в localStorage
     * [x] - оформить страницу до старта JS
     */

    constructor(selector) {
        this.error = false;
        if (!selector) {
            this.error = 'Требуется передать селектор для инициализации';
        } else {
            this.cardsContainer = document.querySelector(selector);
        }
        if (!this.error && !this.cardsContainer) {
            this.error = `Элемент '${selector}' не найден на странице`;
        }
        if (!this.error) {
            this.fields = new Set();
            this.movies = new Set();
            this.search = new Set();
            this.images = new Map();
            this.canvas = new Map();
            this.colWidth = 400;
            this.paddingImg = 125;
            this.heroesList = document.createElement('div');
            this.heroesList.className = "heroes__cards grid grid-cols-1 3xl:grid-cols-6 2xl:grid-cols-5 gap-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 smm:grid-cols-1";
            this.filters = document.createElement('div');
            this.filters.className = 'heroes__filters relative flex justify-between flex-col lg:flex-row mb-6';
            this.id = Cards.count;
            this.filterMovieFirstOption = '-- Choose film --';
            this.imgsContainer = document.createElement('div');
            this.imgsContainer.className = 'absolute w-0 h-0 hidden';
            this.hidePromoVar = false;
            this.dataLoaded = false;
            this.mode = 'hover'; // hover, static
            this.cookie = false;
        }
    }

    // объект с карточками для всех экземпляров класса
    static heroes = {
        _data: null,
        get data() { return this._data; },
        set data(val) {
            this._data = val;
            this.dataListener(val);
        },
        dataListener(val) {},
        registerNewListener(externalListenerFunction) { this.dataListener = externalListenerFunction; }
    }
    // счетчик экземпляров класса
    static get count() {
        Cards._counter = (Cards._counter || 0) + 1;
        return Cards._counter;
    }

    // отслеживаем запуск fetch
    static fetching = false

    init() {
        if (this.error) {
            console.error(this.error);
            return;
        }
        this.promo();
        this.cardsContainer.append(this.imgsContainer);
        this.cardsContainer.append(this.filters);
        this.cardsContainer.append(this.heroesList);
        if (true) {
            this.heroesList.classList.add('heroes__cards--actions');
        }
        this.getData();

    }

    // Добалвение в localStorage
    setLocalstorage(list) {
        localStorage.heroes = JSON.stringify(list);
    }

    // удаление из localStorage
    removeLocalStorage() {
        localStorage.removeItem('heroes');
    }

    // проверка наличия куки для подгрузки данных
    getHeroesLoaded() {
        const heroesLoaded = cookie.get('heroes-loaded');
        this.cookie = !!heroesLoaded;
    }

    // получение json с карточками
    fetchHeroes() {
        return fetch('/dbHeroes.json')
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Service is unavailable!');
                }
                return res.json();
            });
    }

    // Получение данных из localStorage или с сервера
    getData() {
        this.getHeroesLoaded();
        if (this.cookie && localStorage.heroes) {
            Cards.heroes.data = JSON.parse(localStorage.heroes);
            this.dataReceived();
            return;
        }
        if (!Cards.heroes.data && !Cards.fetching) {
            Cards.fetching = true;
            const heroes = this.fetchHeroes();
            heroes
                .then(res => {
                    cookie.set('heroes-loaded', true, {
                        'max-age': 3600 * 24
                    });
                    Cards.heroes.data = res;
                    this.setLocalstorage(res);
                    this.dataReceived();
                })
                .catch(err => console.error(err));
        } else if (Cards.fetching) {
            /**
             * если есть несколько экземпляров класса и началась загрущка данных,
             * то вешается слушатель на обнволение статического свойства класса
             *
             */
            Cards.heroes.registerNewListener(() => this.dataReceived());
        }
    }

    // рендер селекта
    renderSelect(settings) {
        const select = document.createElement('select'),
            {
                items,
                attributes
            } = settings;

        let  { classes } = settings;


        if (attributes) {
            Object.entries(attributes).forEach(([k, v]) => select.setAttribute(k, v));
        }
        if (classes) {
            classes = classes.split(' ');
            classes.forEach(i => select.classList.add(i));

        }
        if (items?.length) {
            items.forEach(i => select.insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`));
        }

        return select;
    }

    // рендер чекбокса
    renderChekbox(name) {

        const { label, checked } = name instanceof Object ? name : { checked: false, label: name };
        const checkbox = `<div class="heroes__form-item">
                <label class="flex items-center mr-2 cursor-pointer">
                    <input class="heroes__checkbox form-checkbox" type="checkbox" value="${label}"${checked ? ' checked' : ''}>
                    <span class="ml-2">${this.camelToNorm(label)}</span>
                </label>
            </div>`;
        return checkbox;
    }

    // рендер фильтра по фильмам
    renderFilterMovies() {
        const items = [...this.movies].sort().reverse();
        const selectWraper = document.createElement('div');
        items.push(this.filterMovieFirstOption);
        items.reverse();

        const select = this.renderSelect({
            classes: 'filter-movie form-select w-full sm:w-auto h-14 pr-5 pl-5 rounded z-0 focus:shadow focus:outline-none',
            items,
            attributes: {
                name: `filter-movie-${this.id}`,
                id: `filter-movie-${this.id}`
            }
        });
        selectWraper.className = 'heroes__filter-movie-wrapper mt-6';
        selectWraper.innerHTML = `<label for="filter-movie-${this.id}" class="inline-block mr-4 mb-4 lg:mb-0">Filter by movie</label>`;
        selectWraper.append(select);
        return selectWraper;
    }

    // рендер блока поиска
    renderSearch() {
        let search = `<div class="heroes__search flex-grow max-w-3xl lg:mr-5 mt-6">`;
        search += `<div class="relative">`;
        search += `<input type="text" class="heroes__search-input h-14 pr-16 pl-5 rounded w-full z-0 focus:shadow focus:outline-none" placeholder="Search anything...">`;
        search += `<div class="absolute top-4 right-3"> <i class="fa fa-search text-gray-400 z-20 "></i> </div>`;
        search += `<div class="heroes__search-close absolute top-4 right-10 hidden cursor-pointer"> <i class="fa fa-times-circle text-gray-400 z-20 hover:text-gray-500"></i> </div>`;
        search += `</div>`;
        search += `<button class="heroes__search-advanced focus:outline-none cursor-pointer hover:underline mt-4 mb-2">Advanced search</button>`;
        search += `<div class="heroes__search-extra grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-hidden transition-all max-h-0 duration-700">`;
        [...this.fields].forEach(i => {
            if (i === 'name' || i === 'realName') {
                this.search.add(i);
                i = {
                    checked: true,
                    label: i
                };
            }
            search += this.renderChekbox(i);
        });
        search += `</div></div>`;

        return search;
    }

    // рендер секции с фильтрами
    renderFilters() {
        const moviesSelect = this.renderFilterMovies(),
            search = this.renderSearch();
        this.filters.insertAdjacentHTML('beforeend', search);
        this.filters.append(moviesSelect);
        this.filters.insertAdjacentHTML('beforeend',
            `<div class="heroes__mode-switcher sm:absolute bottom-0 right-0 mt-4 float-right" title="Toggle hero description">
                <i class="fa fa-list-alt text-gray-400 z-20 transition-all  cursor-pointer text-2xl"></i>
            </div>`
        );
        const svgInterval = setInterval(() => {
            const path = this.filters.querySelector('.heroes__mode-switcher path');
            if (path) {
                path.classList.add('transition-all');
                path.classList.add('duration-300');
                clearInterval(svgInterval);
            }
            // console.log(this.filters.querySelector('.heroes__mode-switcher svg'));
        }, 10);
    }

    // рендер картинок в canvas
    renderCanvas(e) {
        if (e.target.tagName.toLowerCase() === 'img') {
            const url = e.target.src,
                canvas = this.canvas.get(url);
            imageResize({
                elem: canvas,
                img: this.images.get(url),
                MAX_WIDTH: this.colWidth
            });
            canvas.parentNode.querySelector('.loader').remove();
        }
    }

    // функция для выполнения операций после получения данных
    dataReceived() {
        this.dataLoaded = true;
        this.heroes = Cards.heroes.data;
        this.heroes.forEach(card => {
            Object.keys(card).forEach(i => this.fields.add(i));
            if (card.movies && card.movies.length) {
                card.movies.forEach(i => this.movies.add(i));
            }
        });
        this.render();
        this.handlers();
        this.hidePromo();
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // прелоадер для фото
    preloaderStar() {
        return `<div class="loader loader-2">
            <svg class="loader-star" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
                    <polygon points="29.8 0.3 22.8 21.8 0 21.8 18.5 35.2 11.5 56.7 29.8 43.4 48.2 56.7 41.2 35.1 59.6 21.8 36.8 21.8 " fill="#dbeafe" />
                </svg>
            <div class="loader-circles"></div>
        </div>`;
    }

    lazyLoad(photoUrl, name, i) {
        if (!this.images.get(photoUrl)) {
            const img = new Image(),
                canvas = document.createElement('canvas');

            img.src = photoUrl;
            // img.addEventListener('load', this.renderCanvas.bind(this));
            this.imgsContainer.append(img);

            canvas.className = 'absolute top-0 right-0 left-0 max-w-full';
            canvas.dataset.src = photoUrl;
            canvas.title = name ? name : '';

            if (i < 12) {
                this.images.set(photoUrl, img);
            } else {
                setTimeout(() => {
                    this.images.set(photoUrl, img);
                }, 0);
            }

            this.canvas.set(photoUrl, canvas);
        }
    }

    // рендер карточки героя

    renderCard(card, i) {
        const {
            name,
            species,
            gender,
            birthDay,
            deathDay,
            status,
            actors,
            photo,
            movies,
            realName,
            citizenship,

        } = card;
        const cardElement = document.createElement('div'),
            photoUrl = `https://github.com/Quper24/dbHeroes/raw/master/${photo}`;


        cardElement.className = 'heroes__card relative rounded-3xl bg-black bg-opacity-801 bg-gray-700 shadow-lg';

        let output = '';
        output += photo ? `<div class="heroes__card-promo relative overflow-hidden rounded-3xl z-20">` : '';
        output += photo ? `
            <div class="heroes__card-item heroes__card-item--photo overflow-hidden relative" style="padding-bottom: ${this.paddingImg}%">
            ${this.preloaderStar()}
            </div>` : '';
        output += photo ? `<div class="heroes__card-promo-summary 
                absolute bottom-0 left-0 right-0 text-center text-blue-100 uppercase px-8 pb-4 pt-10
                bg-gradient-to-b from-transparent via-black to-black divide-y divide-blue-100
            ">` : '<div class="heroes__card-summary pb-4 pt-14 px-8 text-blue-100  divide-y divide-blue-100">';
        output += name ? `<div class="heroes__card-item heroes__card-item--title py-2">${name}</div>` : '';
        output += realName ?
            `<div class="heroes__card-item heroes__card-item--title py-2">${realName}</div>` : '';
        output += photo ? `</div>` : ''; // .heroes__card-promo-summary
        output += photo ? `</div>` : ''; // .heroes__card-promo


        output += photo ? `<div class="heroes__card-summary pb-4 pt-14 px-8 text-blue-100 divide-y divide-blue-100">` : '';
        output += species ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Species">
            <i class="fa fa-smile-beam z-20 mr-2"></i>
            ${species}</div>` : '';
        output += gender ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Gender">
            <i class="fa fa-venus-mars z-20 mr-2"></i>
            ${gender}</div>` : '';
        output += citizenship ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Citizenship">
            <i class="fa fa-id-card z-20 mr-2"></i>
            ${citizenship}</div>` : '';
        output += birthDay ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Date of birth">
            <i class="fa fa-birthday-cake z-20 mr-2"></i>
            ${birthDay}</div>` : '';
        output += deathDay ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Date of death">
            <i class="fa fa-skull-crossbones z-20 mr-2"></i>
            ${deathDay}</div>` : '';
        output += status ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Status">
            <i class="fa fa-file-alt z-20 mr-2"></i>
            ${status}</div>` : '';
        output += actors ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Actors">
            <i class="fa fa-theater-masks z-20 mr-2"></i>
            ${actors}</div>` : '';
        output += movies ? `<div class="heroes__card-item heroes__card-item--title py-2" title="Movies">
            <i class="fa fa-film z-20 mr-2"></i>
            ${movies.join(', ')}</div>` : '';
        output += photo ? `</div>` : ''; // .heroes__card-summary

        cardElement.innerHTML = output;

        setTimeout(() => {
            this.lazyLoad(photoUrl, name, i);
            cardElement.querySelector('.heroes__card-item--photo').append(this.canvas.get(photoUrl));
        }, 0);

        return cardElement;
    }

    renderCards(list) {
        const cards = list.map((card, i) => this.renderCard(card, i));
        this.heroesList.innerHTML = '';
        this.heroesList.append(...cards);
    }

    filteringByMovie(movie) {
        const cards = this.heroes.filter(i => (i.movies ? i.movies.filter(i => i === movie).length : null));
        this.renderCards(cards);
    }

    camelToNorm(word) {
        return word.replace(/([A-Z])/g, ' $1').toLowerCase();
    }

    searchTest(phrase, item) {
        const regexp = new RegExp(`(${phrase})`, 'gi');
        return regexp.test(item) ? item && phrase !== '' ? item.replace(regexp, '<b>$1</b>') : item : false;
    }

    searchHandler(e) {
        const target = e.target,
            close = this.filters.querySelector('.heroes__search-close'),
            phrase = target.value,
            search = [...this.heroes].map(i => ({ ...i })).filter(i => [...this.search].filter(s => {
                if (typeof i[s] !== 'object') {
                    const test = this.searchTest(phrase, i[s]);
                    i[s] = test ? test : i[s];
                    return test;
                } else {
                    const test = i[s].map(i => this.searchTest(phrase, i));
                    i[s] = [...i[s]];
                    test.forEach((el, j) => {
                        if (el) {
                            i[s][j] = el;
                        }
                    });
                    return test.filter(i => i).length;
                }
            }).length);

        if (phrase) {
            close.classList.remove('hidden');
        } else {
            this.renderStart();
            close.classList.add('hidden');
        }
        setTimeout(() => {
            this.renderCards(search);
        }, 0);
    }

    inputHandler(e) {
        const target = e.target;
        if (target.classList.contains('heroes__search-input')) {
            this.searchHandler(e);
        }
    }

    clickHandler(e) {
        const target = e.target;
        if (target.closest('.heroes__search-close')) {
            const input = this.filters.querySelector('.heroes__search-input');
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (target.closest('.heroes__search-advanced')) {
            e.preventDefault();
            const advanced = this.filters.querySelector('.heroes__search-extra');
            advanced.classList.toggle('max-h-screen');
        }
        if (target.closest('.heroes__mode-switcher')) {
            target.classList.toggle('text-black');
            this.mode = this.mode === 'hover' ? 'static' : 'hover';
            this.heroesList.classList.toggle('heroes__cards--actions');
            if (this.mode === 'hover') {
                this.heroesList.classList.add('heroes__cards--processing');
                setTimeout(() => {
                    this.heroesList.classList.remove('heroes__cards--processing');
                }, 500);
            }
        }
    }

    renderStart() {
        this.renderCards(this.heroes);
    }

    render() {
        this.renderFilters();
        this.renderStart();
        // this.setColWidth();
    }

    changeHandler(e) {
        const target = e.target;
        if (target.classList.contains('filter-movie')) {
            if (target.value === this.filterMovieFirstOption) {
                this.renderStart();
            } else {
                this.filteringByMovie(target.value);
            }
        }
        if (target.classList.contains('heroes__checkbox')) {
            if (target.checked) {
                this.search.add(target.value);
            } else {
                this.search.delete(target.value);
            }
        }
    }

    mouseenterHandler(e) {
        const target = e.target;
        if (this.mode === 'hover' && target.classList.contains('heroes__card')) {
            target.classList.add('hover');
        }
    }

    mouseleaveHandler(e) {
        const target = e.target;
        if (this.mode === 'hover' && target.classList.contains('heroes__card')) {
            setTimeout(() => {
                target.classList.remove('hover');
            }, 1000);
        }
    }

    setColWidth() {
        const card = document.querySelector('.heroes__card'),
            canvas = card.querySelector('canvas');
        this.colWidth = card.clientWidth;
        if (canvas.width < this.colWidth) {
            // this.images = new Map();
            [...this.canvas.entries()].forEach(([k, v]) => {
                imageResize({
                    elem: v,
                    img: this.images.get(k),
                    MAX_WIDTH: this.colWidth
                });
            });
            // this.canvas.keys().forEach(k => console.log(k));
        }
    }

    getPromo() {
        return `<div class="heroes__promo fixed top-0 left-0 right-0 bottom-0 overflow-hidden z-50">
            <div class="flex bg-black absolute w-1/2 top-0 left-0 bottom-0 justify-end items-center transition-all duration-700">
                <canvas class=" transition-all duration-500 max-w-0" id="promo-canvas-l-${this.id}"></canvas>
            </div>
            <div class="flex bg-black absolute w-1/2 top-0 right-0 bottom-0 justify-start items-center transition-all duration-700">
                <canvas class=" transition-all duration-500 max-w-0" id="promo-canvas-r-${this.id}"></canvas>
            </div>
        </div>`;
    }

    hidePromo() {
        if (this.dataLoaded && this.hidePromoVar) {
            const promo = document.querySelector('.heroes__promo');
            promo.children[0].classList.add('-left-1/2');
            promo.children[1].classList.add('-right-1/2');
            setTimeout(() => {
                promo.classList.add('hidden');
            }, 1000);
        }
    }

    promo() {
        const promo = this.getPromo();
        document.body.classList.remove('bg-black');
        document.body.insertAdjacentHTML('beforeend', promo);

        window.addEventListener('load', () => {

            const canvasL = document.getElementById(`promo-canvas-l-${this.id}`);
            const canvasR = document.getElementById(`promo-canvas-r-${this.id}`);
            this.promoCanvasRender(canvasL, 'left');
            this.promoCanvasRender(canvasR, 'right');
            setTimeout(() => {
                this.hidePromoVar = true;
                this.hidePromo();
            }, 3000);
        });

    }

    promoCanvasRender(canvas, part) {
        canvas.width = 302;
        canvas.height = 104;
        const ctx = canvas.getContext('2d');
        const x = part ? (part === 'left' ? canvas.width : 0) : canvas.width / 2;
        ctx.font = "72px Elephantmen Aged";
        ctx.fillStyle = "#dbeafe";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText('Heroes', x, 36);
        ctx.font = "32px Elephantmen Aged";
        ctx.fillText('will show up soon', x, 88);

        canvas.classList.add('max-w-full');
    }

    handlers() {
        this.cardsContainer.addEventListener('change', this.changeHandler.bind(this));
        this.cardsContainer.addEventListener('input', this.inputHandler.bind(this));
        this.cardsContainer.addEventListener('click', this.clickHandler.bind(this));
        this.cardsContainer.addEventListener('load', this.renderCanvas.bind(this), true);
        this.cardsContainer.addEventListener('mouseenter', this.mouseenterHandler.bind(this), true);
        this.cardsContainer.addEventListener('mouseleave', this.mouseleaveHandler.bind(this), true);
        window.addEventListener('resize', this.setColWidth.bind(this));
        this.hidePromo();
    }

}

export default Cards;
