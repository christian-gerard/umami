import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import { useNavigate } from 'react-router-dom'
 
function FindRecipe() {

    const nav = useNavigate()

    const [ingFields, setIngFields] = useState(2)

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
            console.log(formData)
		}
	})

    const addField = () => {
        setIngFields((ingFields) => ingFields + 1)
    }

    const renderIngFields = () => {

        const fields = []

        for(let i = 0; i < 3; i++) {
            fields.push(
            <div className='m-2 text-black'>

                <input
                    type='text'
                    name='ingredient'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ingredient}
                    className='border rounded-lg p-1 mr-2 w-[300px]'
                    placeholder='ingredient'
                />
    
    
                <input
                    type='dropdown'
                    name='amount'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    className='border rounded-lg p-1 mr-2 w-[50px]'
                    placeholder='amount'
                />
    
                <input
                    type='text'
                    name='measurement'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.measurement}
                    className='border rounded-lg p-1 mr-2 w-[50px]'
                    placeholder='measurement'
                />
            </div>

            )
        }

        return <div className='flex flex-col'>{fields}</div>
    }

    useEffect(() => {
       renderIngFields()

    }, [ingFields])

    return (
        <div className='p-6 flex flex-row'>
            
            <div className='bg-shittake text-white p-6 rounded-lg'>

                <h2 className='text-2xl'>Enter Ingredients</h2>

                <form className='flex flex-col mt-2'>

                    <label htmlFor='name'>Ingredients</label>
            
                    {renderIngFields()}

                </form>

                <button onClick={addField}>Add +</button>

            </div>

            <div className='border-1'>
                <h1>RESULTS</h1>
            </div>




        </div>
    )
}

export default FindRecipe