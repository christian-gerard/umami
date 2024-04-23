import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Error from './Error'
import Auth from '../components/Auth'
import Recipe from '../pages/recipes/Recipe'
import FindRecipe from '../pages/recipes/FindRecipe'


const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <Error />,
		children: [
            {
                path: '/',
                element: <Auth />,
            },
            {
                path: '/findrecipes',
                element: <FindRecipe />,
            },
            {
                path: '/recipes',
                element: <Recipe />,
            }

		]
	}
])

export default router