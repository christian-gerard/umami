import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFormik, FieldArray, Formik, Field } from "formik";
import toast from "react-hot-toast";
import { object, string, array, number } from "yup";
import { date as yupDate } from "yup";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import RecipeForm from "../recipes/RecipeForm";
import Nav from "../../components/Nav";

function Recipe({ id, name, steps, ingredients, cookbooks }) {
  const { user, updateRecipes } = useContext(UserContext);
  const route = useParams();
  const [editMode, setEditMode] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});
  const nav = useNavigate();

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    fetch(`/recipes/${route.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          const newRecipes = user.recipes.filter(
            (recipe) => recipe.id !== currentRecipe.id,
          );
          updateRecipes(newRecipes);
          nav("/cookbook");
          toast.success("Deleted");
        } else {
          return res.json().then((errorObj) => toast.error(errorObj.message));
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const recipeSchema = object({
    name: string(),
    steps: string(),
    ingredients: array().of(
      object().shape({
        name: string(),
        amount: number(),
        measurement: string(),
      }),
    ),
  });

  const initialValues = {
    name: "",
    steps: "",
    ingredients: [
      {
        name: "",
        amount: "",
        measurement_unit: "",
      }
    ]
  };

  const formik = useFormik({
    initialValues,
    validationSchema: recipeSchema,
    onSubmit: (formData) => {
      console.log(formData)
      fetch(`/recipes/${currentRecipe.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            console.log(data)
            const updatedRecipes = user.recipes.map((recipe) => recipe.id === currentRecipe.id ? data : recipe)
            updateRecipes(updatedRecipes)
            nav("/cookbook");
            toast.success("Recipe Updated");
          });
        } else {
          return res.json().then((errorObj) => toast.error(errorObj.message));
        }
      });
    },
  });

  useEffect(() => {
    if (route.id) {
      fetch(`/recipes/${route.id}`).then((res) => {
        if (res.ok) {
          res
            .json()
            .then((data) => {
              console.log(data)
              setCurrentRecipe(data);
              formik.setValues({
                name: data.name,
                steps: data.steps,
                ingredients: data.ingredients.map((ingredient) => ({
                  name: ingredient.food.name,
                  amount: ingredient.amount,
                  measurement_unit: ingredient.measurement_unit
                }))
              });
            })
        } else if (res.status === 422) {
          toast.error("Invalid Login");
        } else {
          return res.json().then((errorObj) => toast.error(errorObj.Error));
        }
      });
    }
  }, [route.id, editMode]);


  return (
    <>
      {route.id ? (
        <div>
          <div className='bg-champagne p-6 m-2 rounded-lg'>
          <button
              className=" border rounded-lg p-2 m-2 text-black"
              onClick={ () => nav('/cookbook')}
            >
              Back
            </button>
            <button
              className="bg-shittake rounded-lg p-2 m-2 text-white"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-white rounded-lg p-2 m-2 text-shittake "
              onClick={handleDelete}
            >
              Delete
            </button>
            <p className="text-4xl m-2 ">{currentRecipe.name}</p>
            <h1 className='text-2xl italic'>Instructions</h1>
            <p className="text-lg">{currentRecipe.steps}</p>

            <h1 className='text-2xl italic'>Ingredients</h1>
            {currentRecipe.ingredients ? (
              <ul>
                {currentRecipe.ingredients.map((ingredient) => (
                  <li>
                    {ingredient.food.name} {ingredient.amount}{" "}
                    {ingredient.measurement_unit}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Ingredients</p>
            )}
          </div>

          {editMode ? (
            <div className="fixed inset-0 flex justify-center items-center transition-colors backdrop-blur">
            <Formik
              onSubmit={formik.handleSubmit}
              initialValues={initialValues}
            >
                <form
                  className=" bg-white p-12 w-[1000px] flex flex-col text-lg text-black rounded-xl border-2 border-shittake"
                  onSubmit={formik.handleSubmit}
                >
                  <button
                    className="bg-shittake text-white rounded-xl "
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                  >
                    X
                  </button>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className="border rounded-lg p-1 m-1 "
                    placeholder="Name"
                  />
                  {formik.errors.name && formik.touched.name && (
                    <div className="error-message show">{formik.errors.name}</div>
                  )}

                  <label htmlFor="steps">Instructions</label>
                  <input
                    type="text"
                    name="steps"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.steps}
                    className="border rounded-lg p-1 m-1"
                    placeholder="Instructions"
                  />

                  {formik.errors.steps && formik.touched.steps && (
                    <div className="error-message show">
                      {formik.errors.steps}
                    </div>
                  )}

                  <label htmlFor="ingredients">Ingredients</label>

                  <FieldArray name="ingredients" validateOnChange={true}>
                    {(fieldArrayProps) => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form;
                      const ingredients = values.ingredients || [];

                      const handleAddIngredient = () => {
                        push({ name: "", amount: "", measurement_unit: "" });
                      };

                      const handleDeleteIngredient = (index) => {

                        if (index !== 0) {
      
                          remove(index)
                          const updatedIngredients = [...formik.values.ingredients]
                          updatedIngredients.splice(index, 1)
                          formik.setFieldValue('ingredients',updatedIngredients)
      
                        }
      
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
                                className="m-1 p-1 rounded-lg border w-[250px]"
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
                                className="m-1 p-1 rounded-lg border w-[40px]"
                              />
                              <Field
                                as='select'
                                name={`ingredients[${index}].measurement_unit`}
                                placeholder="Measurement"
                                value={
                                  formik.values.ingredients[index]
                                    ? formik.values.ingredients[index].measurement_unit
                                    : ""
                                }
                                onChange={formik.handleChange}
                                className="border m-1 p-1 rounded-lg w-[100px]"
                              >
                                <option value=''>Measur.</option>
                                <option value='pints'>Pint</option>
                                <option value='quarts'>Quart</option>
                                <option value='cups'>Cup</option>
                                <option value='oz'>Ounce</option>
                                <option value='fl oz'>Fluid Ounce</option>
                                <option value='tbsp'>Tablespoon</option>
                                <option value='tsp'>Teaspoon</option>
                              </Field>

                              <button
                                type="button"
                                onClick={() => handleDeleteIngredient(index)}
                                className="p-1 m-1 w-[30px] bg-champagne text-black rounded-lg"
                              >
                                −
                              </button>
                              <button
                                type="button"
                                onClick={handleAddIngredient}
                                className="p-1 m-1 w-[30px] bg-champagne text-black rounded-lg"
                              >
                                +
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  </FieldArray>


                  <button
                    className="bg-shittake rounded-lg text-white "
                    type="submit"
                  >
                    Update Recipe
                  </button>
                </form>

            </Formik>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (




            <NavLink to={`/recipes/${id}`}>
              <div className="p-2 bg-champagne text-black m-2 rounded-lg w-[300px] h-[100px]">
                <div className="flex flex-row justify-between">
                  <p className="text-lg font-bold">{name}</p>
                </div>
    
                <p className="text-m">{steps.slice(0, 25)}...</p>
    
                {ingredients ? (
                  <>
                    <p>Ingredients: {ingredients.length}</p>

                  </>
                ) : (
                  <>
                    <h1 className='text-black'>No Recipes</h1>
                  </>
                )}
              </div>
            </NavLink>

      )}
    </>
  );
}

export default Recipe;
