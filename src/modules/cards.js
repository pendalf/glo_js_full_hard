class Cards {
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
            this.heroesList.className = "grid grid-cols-4 gap-4";
            this.filters = document.createElement('div');
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
                classes,
                attributes
            } = settings;

        if (attributes) {
            Object.entries(attributes).forEach(([k, v]) => select.setAttribute(k, v));
        }
        if (classes) {
            select.classList.add(classes);
        }
        if (items?.length) {
            items.forEach(i => select.insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`));
        }

        return select;
    }

    renderChekbox(name) {

        const { label, checked } = name instanceof Object ? name : { checked: false, label: name };
        const checkbox = `<div class="heroes__form-item">
                <label><input class="heroes__checkbox" type="checkbox" value="${label}"${checked ? ' checked' : ''}>${this.camelToNorm(label)}</label>
            </div>`;
        return checkbox;
    }

    renderFilterMovies() {
        const items = [...this.movies].sort().reverse();
        items.push('--Choose film--');
        items.reverse();

        const select = this.renderSelect({
            classes: 'filter-movie',
            items,
            attributes: {
                name: 'filterMovie',
            }
        });
        return select;
    }

    renderSearch() {
        let search = `<div class="heroes__search">`;
        search += `<div class="relative"> <input type="text" class="heroes__search-input h-14 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none" placeholder="Search anything...">`;
        search += `<div class="absolute top-4 right-3"> <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i> </div>`;
        search += `</div>`;
        search += `<div class="heroes__search-extra">`;
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
        cardElement.className = 'heroes__card';

        let output = '';
        output += name ? `<div class="heroes__card-item heroes__card-item--title">${name}</div>` : '';
        output += photo ? `
            <div class="heroes__card-item heroes__card-item--photo overflow-hidden relative" style="padding-bottom: ${this.paddingImg}%">
                <img class="absolute top-0 right-0 left-0" src="https://github.com/Quper24/dbHeroes/raw/master/${photo}"${name ?
    ' title="' + name + '"' : ''}>
            </div>` : '';
        output += realName ?
            `<div class="heroes__card-item heroes__card-item--title">Real name: ${realName}</div>` : '';
        output += species ? `<div class="heroes__card-item heroes__card-item--title">Species: ${species}</div>` : '';
        output += gender ? `<div class="heroes__card-item heroes__card-item--title">Gender: ${gender}</div>` : '';
        output += citizenship ? `<div class="heroes__card-item heroes__card-item--title">Citizenship: ${citizenship}</div>` : '';
        output += birthDay ? `<div class="heroes__card-item heroes__card-item--title">Date of birth: ${birthDay}</div>` : '';
        output += deathDay ? `<div class="heroes__card-item heroes__card-item--title">Date of death: ${deathDay}</div>` : '';
        output += status ? `<div class="heroes__card-item heroes__card-item--title">Статус: ${status}</div>` : '';
        output += actors ? `<div class="heroes__card-item heroes__card-item--title">Actors: ${actors}</div>` : '';
        output += movies ? `<div class="heroes__card-item heroes__card-item--title">Movies: ${movies}</div>` : '';

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
            phrase = target.value,
            regexp = new RegExp(`(${phrase})`, 'gi'),
            search = [...this.heroes].map(i => ({ ...i })).filter(i => [...this.search].filter(s => {
                if (regexp.test(i[s])) {
                    i[s] = i[s] && phrase !== '' ? i[s].replace(regexp, '<b>$1</b>') : i[s];
                    return true;
                }
            }).length);
        this.renderCards(search);

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
    }

}

export default Cards;
