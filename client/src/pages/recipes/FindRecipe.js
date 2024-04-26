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

		}
	})

    const addField = () => {
        setIngFields((ingFields) => ingFields + 1)
    }

    const renderIngFields = () => {
        const fields = []

        for(let i = 0; i < 3; i++) {
            fields.push(

            <input
                type='text'
                placeholder='Ingredient'
                className='p-2 m-2'
            />

            )
        }

        return <div className='flex flex-col'>{fields}</div>
    }

    useEffect(() => {
       renderIngFields()

    }, [ingFields])

    return (
        <div className='p-6 flex flex-row'>

            <div className='bg-shittake text-white p-6'>

                <form className='flex flex-col'>

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