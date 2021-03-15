import './style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import watcher from './modules/watcher';
import Cards from './modules/cards';

watcher();

const cards = new Cards('.heroes');
cards.init();