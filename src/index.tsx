import ReactDOM from 'react-dom/client';
import {App} from './App';
import 'dotenv/config';

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<App />);
