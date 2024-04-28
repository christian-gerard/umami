import Recipe from './Recipe'
import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'

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

    useEffect(() => {
        user ? setPages((pages) => Math.ceil(user.recipes.length / 10)) : <h1>Loading</h1>



    }, [user])

    return (
        <div className='p-6 mt-6 '>
            <div className='flex flex-col flex-grow '>

                <div className='flex flex-row justify-between'>
                    <h1 className='text-5xl tracking-widest'>My Cookbook</h1>
                    <select
                        className='border border-black p-2' 
                        placeholder='Filter'
                    >
                        <option>Choose Type</option>
                        <option>Breakfast</option>
                        <option>Brunch</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                        <option>Dessert</option>
                        <option>Baking</option>
                    </select>
                    <select
                        className='border border-black p-2' 
                        placeholder='Filter'
                    >
                        <option>Sort By</option>
                        <option>Name</option>
                        <option>Type</option>
                        <option>Name</option>
                        <option>Name</option>
                        
                    </select>
                    <button className='text-lg bg-shittake hover:text-black rounded-lg p-2 text-white ' onClick={newRecipe}>New Recipe +</button>
                </div>

                <div className=' mt-10 rounded-xl text-white flex flex-wrap'>

                    {user ? user.recipes.slice(startIndex, endIndex).map((recipe) => <Recipe key={recipe.id} {...recipe} />) : <h1>LOADING</h1>}

                </div>


                <div className=' text-xl flex justify-center pt-6'>
                    <button  className='bg-champagne p-1 rounded-lg' onClick={handlePrev}>Prev</button>
                        <div className='text-xl'>&nbsp;{currentPage} of {pages}&nbsp;</div>  &nbsp;
                    <button className='bg-champagne p-1 rounded-lg' onClick={handleNext}>Next</button>
                </div> 

            </div>

            {
                recipeForm 
                
                ?


                <div className='fixed inset-0 flex justify-center items-center transition-colors backdrop-blur'> 

                    <form onSubmit={formik.handleSubmit} className='bg-white p-12  flex flex-row text-lg rounded-xl border-2 border-shittake'>

                            <button className='bg-shittake text-white rounded-xl mb-6 'type='button' onClick={newRecipe} >X</button>

                        <div className='flex flex-col'>

                            
                            <label htmlFor='name'>Name</label>
                            <input
                                type='text'
                                name='name'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                className='border rounded-lg p-1'
                                placeholder='Name'
                            />
                            {formik.errors.name && formik.touched.name && (
                                <div className='error-message show'>{formik.errors.name}</div>
                            )}

                            <label htmlFor='steps'>Ingredients</label>

                            <div>

                                <input
                                    type='text'
                                    name='ingredient'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.ingredient}
                                    className = 'border rounded-lg'
                                    placeholder='ingredient'
                                />


                                <input
                                    type='text'
                                    name='amount'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.amount}
                                    className = 'border rounded-lg'
                                    placeholder='amount'
                                />

                                <input
                                    type='text'
                                    name='measurement'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.measurement}
                                    className = 'border rounded-lg'
                                    placeholder='measurement'
                                />

                            </div>

                            <div>

                                <input
                                    type='text'
                                    name='ingredient'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.ingredient}
                                    id = 'name'
                                    placeholder='ingredient'
                                />


                                <input
                                    type='text'
                                    name='amount'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.amount}
                                    id = 'name'
                                    placeholder='amount'
                                />

                                <input
                                    type='text'
                                    name='measurement'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.measurement}
                                    id = 'name'
                                    placeholder='measurement'
                                />

                            </div>

                            <button type='button'>Add Ingredient +</button>


                        </div>
                        



                        <div className='flex flex-col w-[600px]'>


                            <label htmlFor='steps'>Instructions</label>
                            <input
                                type='text'
                                name='steps'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.steps}
                                className = 'border rounded-lg h-[500px]'
                                placeholder='Existing Steps here'
                            />
                            {formik.errors.steps && formik.touched.steps && (
                                <div className='error-message show'>{formik.errors.steps}</div>
                            )}


                            <button className='text-2xl bg-shittake text-white hover:bg-transparent rounded-xl'>
                                Add Recipe
                            </button>

                        </div>


                    </form>

                </div>
            :
            <></>

            }
        </div>
    )
}

export default Cookbook