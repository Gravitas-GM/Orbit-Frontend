import ReactDOM from 'react-dom/client';
import {App} from './App';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production')
	dotenv.config();

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<App />);
