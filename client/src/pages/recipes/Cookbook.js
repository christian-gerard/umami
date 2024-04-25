import Recipe from './Recipe'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../../App'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import { date as yupDate } from 'yup'

function Cookbook() {
    const nav = useNavigate()
    const { user } = useContext(UserContext)
    const [pages, setPages] = useState(1)
    const [recipeForm, setRecipeForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const startIndex = (currentPage - 1) * 10
    const endIndex = currentPage * 10

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((currentPage) => currentPage - 1)
    }}

    const handleNext = () => {
        if (pages > currentPage) {
            setCurrentPage((currentPage) => currentPage + 1)
    }}

    const newRecipe = () => {
        setRecipeForm(!recipeForm)
    }

    
    const recipeSchema = object({
        name: string(),
        steps: string()
    })

    const initialValues = {
        name: '',
        steps: ''
    }

	const formik = useFormik({
		initialValues,
		validationSchema: recipeSchema,
		onSubmit: (formData) => {
			fetch('/recipes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.name,
                    steps: formData.steps
				})
			})
				.then((res) => {
					if (res.ok) {
						return res.json().then((data) => {
                            newRecipe()
							nav('/cookbook')
							toast.success("Recipe Created")
						})
					} else {
						return res
							.json()
							.then((errorObj) => toast.error(errorObj.message))
					}
				})
		}
	})

    return (
        <div className='p-6 mt-6 '>
            <div className='flex flex-col flex-grow  '>

                <div className='flex flex-row justify-between'>
                    <h1 className='text-4xl '>Cookbook</h1>
                    <button className='text-2xl bg-pink-200 hover:bg-transparent rounded-lg p-1 ' onClick={newRecipe}>New Recipe +</button>
                </div>

                {user ? user.recipes.slice(startIndex, endIndex).map((recipe) => <Recipe key={recipe.id} {...recipe} />) : <h1>LOADING</h1>}

                <div className=' text-xl fixed bottom-10 left-0 right-0 flex justify-center'>
                    <button  className='bg-green-100' onClick={handlePrev}>Prev</button>
                        &nbsp; {currentPage} of {pages} &nbsp;
                    <button className='bg-green-100' onClick={handleNext}>Next</button>
                </div> 

            </div>

            {
                recipeForm ?
                <div className='fixed inset-0 flex justify-center items-center transition-colors '> 

                    <form onSubmit={formik.handleSubmit} className='bg-white p-12  flex flex-col text-2xl rounded-xl border-2 border-shittake'>
                    <button className='bg-shittake text-white rounded-xl 'type='button' onClick={newRecipe} >X</button>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='text'
                        name='name'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        id = 'name'
                        placeholder='Existing Name here'
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div className='error-message show'>{formik.errors.name}</div>
                    )}

                    <label htmlFor='steps'>Steps</label>
                    <input
                        type='text'
                        name='steps'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.steps}
                        id = 'steps'
                        placeholder='Existing Steps here'
                    />
                    {formik.errors.steps && formik.touched.steps && (
                        <div className='error-message show'>{formik.errors.steps}</div>
                    )}
{/* 
                    <label htmlFor='ingredients'>Ingredients</label>
                    <input
                        type='text'
                        name='ingredients'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ingredients}
                        id = 'steps'
                        placeholder='Existing Steps here'
                    />
                    {formik.errors.ingredients && formik.touched.ingredients && (
                        <div className='error-message show'>{formik.errors.ingredients}</div>
                    )} */}

                    <button className='text-2xl bg-shittake text-white hover:bg-transparent rounded-xl'>
                        Add Recipe
                    </button>
                </form>

                </div>
            :
            <></>

            }
        </div>
    )
}

export default Cookbook