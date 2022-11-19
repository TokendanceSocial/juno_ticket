import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routers from './routes';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// const vConsole = document.createElement('script');
// vConsole.src = 'https://unpkg.com/vconsole@3.15.0/dist/vconsole.min.js'

// const head = document.getElementsByTagName('head');
// head[0].appendChild(vConsole);

// vConsole.onload = function() {
//   const newVConsole = document.createElement('script');
//   newVConsole.textContent = 'new window.VConsole();'
//   head[0].appendChild(newVConsole);

// }


root.render(
  <HashRouter>
    <Routers />
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
