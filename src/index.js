import './style.css';

import watcher from './modules/watcher';
import Cards from './modules/cards';

watcher();

const cards = new Cards('.heroes');
cards.init();