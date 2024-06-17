import { App } from './app';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Create the skills assessment app
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
