import ReactDOM from 'react-dom/client';
import {App} from './App';
import 'dotenv/config';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);
