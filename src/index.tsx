import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.scss';

require('dotenv').config();

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);
