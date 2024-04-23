import {  RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import router from './utils/routes'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
);



