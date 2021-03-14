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
            // this.
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

    dataReceived() {
        this.heroes = Cards.heroes.data;
        this.heroes.forEach(card => {
            Object.keys(card).forEach(i => this.fields.add(i));
            if (card.movies && card.movies.length) {
                card.movies.forEach(i => this.movies.add(i));
            }
        });
        this.render();
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
            <div class="heroes__card-item heroes__card-item--photo overflow-hidden relative" style="padding-bottom: 125%">
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

    render() {
        this.renderCards(this.heroes);
        console.log(this.fields);
        console.log(this.movies);
    }

}

export default Cards;