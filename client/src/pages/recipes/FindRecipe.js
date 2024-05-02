import { useState, useEffect } from "react";
import { useFormik, FieldArray, Formik, Field } from "formik";
import toast from "react-hot-toast";
import { object, string, array, number } from "yup";
import {OpenAI} from 'openai'




const API_KEY = 'sk-proj-6HhzpbwE7c99W72OJ2pfT3BlbkFJeej945KkuCu6sDyKC5ey'

const openai = new OpenAI({

  apiKey: API_KEY,
  dangerouslyAllowBrowser: true

})


function FindRecipe() {
  const [aiRecipes, setAiRecipes] = useState('')
  const ingredientSearchSchema = object({
    settings: string(),
    ingredients: array().of(
      object({
        name: string(),
        amount: number(),
        measurement_unit: string(),
      }),
    ),
  });

  const initialValues = {
    settings: "",
    ingredients: [
      {
        name: "",
        amount: "",
        measurement_unit: "",
      }
    ],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ingredientSearchSchema,
    onSubmit: (formData) => {
      console.log(formData)
      const response = openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{role: "user", content: `

        
          Could you generate a recipe for me based on the following ingredients? I only have these ingredients and NOTHING ELSE.
          Do not add any ingredients that I do not list as available ingredients. I DO NOT HAVE ANYTHING OTHER THAN WHAT I LIST BELOW. ONLY PUT THOSE IN THE RECIPE. 

          ONLY INCLUDE THE JSON

          Please return the recipe in a parseable JSON format 
          {
            "name": "recipeName", 
            "ingredients": [{"name": "ingredientName", "amount": "amount", "measurement_unit": ""}], 
            "steps":""}

          ${formData.ingredients.map((ingredient) =>  `${ingredient.amount} ${ingredient.measurement_unit} of ${ingredient.name} `)}

        
        `
        }]
      }).then(resp => {
        const json = resp.choices[0].message.content
        const parsedJson = JSON.parse(json)

        setAiRecipes(parsedJson)
        
        
      })
      
      
    },
  });

  return (
    <div className="p-6 flex flex-row">
      <div className="bg-shittake text-black p-6 rounded-lg">
        <h2 className="text-2xl text-white">Enter Ingredients</h2>

        <Formik initialValues={initialValues} onSubmit={formik.handleSubmit}>
          <form
            className="flex flex-col mt-2 text-white"
            onSubmit={formik.handleSubmit}
          >
            <label htmlFor="name">Ingredients</label>

            <FieldArray name="ingredients" validateOnChange={true}>
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values } = form;
                const ingredients = values.ingredients || [];

                const handleAddIngredient = () => {
                  push({ name: "", amount: "", measurement: "" });
                };

                const handleDeleteIngredient = (index) => {
                  remove(index)
                  const updatedIngredients = [...formik.values.ingredients]
                  updatedIngredients.splice(index, 1)
                  formik.setFieldValue('ingredients',updatedIngredients)

                }

                return (
                  <div>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="text-black">
                        <Field
                          name={`ingredients[${index}].name`}
                          value={
                            formik.values.ingredients[index]
                              ? formik.values.ingredients[index].name
                              : ""
                          }
                          onChange={formik.handleChange}
                          placeholder="Name"
                          className="m-1 p-1 rounded-lg w-[250px]"
                        />
                        <Field
                          name={`ingredients[${index}].amount`}
                          placeholder="Amount"
                          value={
                            formik.values.ingredients[index]
                              ? formik.values.ingredients[index].amount
                              : ""
                          }
                          onChange={formik.handleChange}
                          className="m-1 p-1 rounded-lg w-[40px]"
                        />
                        <Field
                          name={`ingredients[${index}].measurement_unit`}
                          placeholder="Measurement"
                          value={
                            formik.values.ingredients[index]
                              ? formik.values.ingredients[index].measurement_unit
                              : ""
                          }
                          onChange={formik.handleChange}
                          className="m-1 p-1 rounded-lg w-[40px]"
                        />

                        <button
                          type="button"
                          onClick={() => handleDeleteIngredient(index)}
                          className="p-1 m-1 bg-champagne text-black rounded-lg"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={handleAddIngredient}
                          className="p-1 m-1 bg-champagne text-black rounded-lg"
                        >
                          ➕
                        </button>
                      </div>
                    ))}
                  </div>
                );
              }}
            </FieldArray>

            <button
              className="bg-champagne text-black rounded-lg"
              type="submit"
            >
              Search
            </button>
          </form>
        </Formik>
      </div>

      <div className="border-1 w-[50%] justify-center m-12 ">
        {
          aiRecipes ? 
          <div className='bg-champagne p-4 rounded-lg'>
            <h1 className='text-4xl'>
              {aiRecipes.name}
            </h1>
            <div>
              {aiRecipes.ingredients.map((ingredient) => 
              <div className='flex flex-row m-2'> 
                <h3 className='text-xl'>{ingredient.name}</h3> 
                <p>{ingredient.amount}</p> 
                <p>{ingredient.measurement_unit}</p> 
              </div>) }
            </div>
            <div>

              {aiRecipes.steps}
            </div>
          </div>
          :
          <>
            <h1>Search for Recipes</h1>
          </>
        }
      </div>
    </div>
  );
}

export default FindRecipe;
