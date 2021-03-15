class Cards {
    /**
     * TODO:
     * [ ] - исправить работу поиска при отключении всех фильтров
     * [ ] - Исправить работу фильтра по фильмам при переключении на "--Choose film--"
     * [ ] - поиск по фильмам
     * [ ] - сворачивание фильмов
     * [ ] - добавить конвертацию картинок при помощи js
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
            this.paddingImg = 125;
            this.heroesList = document.createElement('div');
            this.heroesList.className = "grid grid-cols-5 gap-5";
            this.filters = document.createElement('div');
            this.filters.className = 'heroes__filters flex justify-between';
            this.id = Cards.count;
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
        this.cardsContainer.append(this.filters);
        this.cardsContainer.append(this.heroesList);
        this.getData();

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

    getData() {
        if (!Cards.heroes.data && !Cards.fetching) {
            Cards.fetching = true;
            const heroes = this.fetchHeroes();
            heroes
                .then(res => {
                    Cards.heroes.data = res;
                    this.dataReceived();
                })
                .catch(err => console.error(err));
        } else if (Cards.fetching) {
            Cards.heroes.registerNewListener(() => this.dataReceived());
        }
    }

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

    renderFilterMovies() {
        const items = [...this.movies].sort().reverse();
        const selectWraper = document.createElement('div');
        items.push('--Choose film--');
        items.reverse();

        const select = this.renderSelect({
            classes: 'filter-movie form-select h-14 pr-5 pl-5 rounded z-0 focus:shadow focus:outline-none',
            items,
            attributes: {
                name: `filter-movie-${this.id}`,
                id: `filter-movie-${this.id}`
            }
        });
        selectWraper.className = 'heroes__filter-movie-wrapper';
        selectWraper.innerHTML = `<label for="filter-movie-${this.id}" class="mr-4">Filter by movie</label>`;
        selectWraper.append(select);
        return selectWraper;
    }

    renderSearch() {
        let search = `<div class="heroes__search flex-grow max-w-3xl mr-5">`;
        search += `<div class="relative">`;
        search += `<input type="text" class="heroes__search-input h-14 pr-16 pl-5 rounded w-full z-0 focus:shadow focus:outline-none" placeholder="Search anything...">`;
        search += `<div class="absolute top-4 right-3"> <i class="fa fa-search text-gray-400 z-20 "></i> </div>`;
        search += `<div class="heroes__search-close absolute top-4 right-10 hidden cursor-pointer"> <i class="fa fa-times-circle text-gray-400 z-20 hover:text-gray-500"></i> </div>`;
        search += `</div>`;
        search += `<button class="heroes__search-advanced focus:outline-none cursor-pointer hover:underline mt-2 mb-2">Advanced search</button>`;
        search += `<div class="heroes__search-extra grid grid-cols-4 gap-3 overflow-hidden transition-all max-h-0 duration-700">`;
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
        this.filters.insertAdjacentHTML('beforeend', search);
    }

    renderFilters() {
        const moviesSelect = this.renderFilterMovies();
        this.filters.append(moviesSelect);
    }

    dataReceived() {
        this.heroes = Cards.heroes.data;
        this.heroes.forEach(card => {
            Object.keys(card).forEach(i => this.fields.add(i));
            if (card.movies && card.movies.length) {
                card.movies.forEach(i => this.movies.add(i));
            }
        });
        this.render();
        this.handlers();
    }

    renderCard(card) {
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
        const cardElement = document.createElement('div');
        cardElement.className = 'heroes__card overflow-hidden rounded-3xl bg-black bg-opacity-80 shadow-lg';

        let output = '';
        output += photo ? `<div class="heroes__card-promo relative overflow-hidden rounded-3xl">` : '';
        output += photo ? `
            <div class="heroes__card-item heroes__card-item--photo overflow-hidden relative" style="padding-bottom: ${this.paddingImg}%">
                <img class="absolute top-0 right-0 left-0" src="https://github.com/Quper24/dbHeroes/raw/master/${photo}"${name ?
    ' title="' + name + '"' : ''}>
            </div>` : '';
        output += photo ? `<div class="heroes__card-promo-summary 
                absolute bottom-0 left-0 right-0 text-center text-blue-100 uppercase px-8 pb-4 pt-10
                bg-gradient-to-b from-transparent via-black to-black divide-y divide-blue-100
            ">` : '<div class="heroes__card-summary py-4 px-8 text-blue-100  divide-y divide-blue-100">';
        output += name ? `<div class="heroes__card-item heroes__card-item--title py-2">${name}</div>` : '';
        output += realName ?
            `<div class="heroes__card-item heroes__card-item--title py-2">${realName}</div>` : '';
        output += photo ? `</div>` : ''; // .heroes__card-promo-summary
        output += photo ? `</div>` : ''; // .heroes__card-promo


        output += photo ? `<div class="heroes__card-summary py-4 px-8 text-blue-100 divide-y divide-blue-100">` : '';
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

        return cardElement;
    }

    renderCards(list) {
        const cards = list.map(card => this.renderCard(card));
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

    searchHandler(e) {
        const target = e.target,
            close = this.filters.querySelector('.heroes__search-close'),
            phrase = target.value,
            regexp = new RegExp(`(${phrase})`, 'gi'),
            search = [...this.heroes].map(i => ({ ...i })).filter(i => [...this.search].filter(s => {
                if (regexp.test(i[s])) {
                    i[s] = i[s] && phrase !== '' ? i[s].replace(regexp, '<b>$1</b>') : i[s];
                    return true;
                }
            }).length);
        if (phrase) {
            close.classList.remove('hidden');
        } else {
            close.classList.add('hidden');
        }
        this.renderCards(search);

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
    }

    render() {
        this.renderSearch();
        this.renderFilters();
        this.renderCards(this.heroes);
        console.log(this.fields);
        console.log(this.movies);
    }

    changeHandler(e) {
        const target = e.target;
        if (target.classList.contains('filter-movie')) {
            this.filteringByMovie(target.value);
        }
        if (target.classList.contains('heroes__checkbox')) {
            if (target.checked) {
                this.search.add(target.value);
            } else {
                this.search.delete(target.value);
            }
        }
    }

    handlers() {
        this.cardsContainer.addEventListener('change', this.changeHandler.bind(this));
        this.cardsContainer.addEventListener('input', this.searchHandler.bind(this));
        this.cardsContainer.addEventListener('click', this.clickHandler.bind(this));
    }

}

export default Cards;
