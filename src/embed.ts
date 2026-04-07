import { GameOfLife } from './core/game-of-life';
import { Theme, setTheme } from './theme/theme';

const params = new URLSearchParams(window.location.search);
const themeParam = params.get('theme');

const theme = themeParam === Theme.Light || themeParam === Theme.Dark ? themeParam : Theme.Dark;

setTheme(theme);

const game = new GameOfLife({
	canvasId: 'game-of-life__canvas',
});

game.randomize();
game.start();