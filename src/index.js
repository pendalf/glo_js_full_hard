import './style.css';

import watcher from './modules/watcher';
import Cards from './modules/cards';

watcher();

const cards = new Cards('.heroes');
cards.init();
const cards1 = new Cards('.heroes1');
cards1.init();
console.log(cards);