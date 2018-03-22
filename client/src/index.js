import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppView from './Components/AppView';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<AppView />, document.getElementById('root'));
registerServiceWorker();
