import Recipe from "./Recipe";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useFormik, Field, FieldArray, Formik } from "formik";
import toast from "react-hot-toast";
import { object, string, array, number } from "yup";

function Cookbook() {
  const nav = useNavigate();
  const { user, updateRecipes } = useContext(UserContext);
  const [pages, setPages] = useState(1);
  const [recipeForm, setRecipeForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = currentPage * 10;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pages > currentPage) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  const newRecipe = () => {
    setRecipeForm(!recipeForm);
  };

  const recipeSchema = object({
    name: string(),
    steps: string(),
    ingredients: array().of(
      object({
        name: string(),
        amount: number(),
        measurement_unit: string(),
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
    ],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: recipeSchema,
    onSubmit: (formData) => {
      fetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            updateRecipes([...user.recipes, data])
            newRecipe();
            nav("/cookbook");
            toast.success("Recipe Created");
          });
        } else {

          return res.json().then((data) => {


            const message = data.Error
            toast.error(message)
          })
        }
      });
    },
  });

  useEffect(() => {
    user ? (
      setPages((pages) => Math.ceil(user.recipes.length / 10))
    ) : (
      <h1>Loading</h1>
    );
  }, [user]);

  return (
    <div className="p-6 mt-6 ">
      <div className="flex flex-col flex-grow ">
        <div className="flex flex-row justify-between">
          <h1 className="text-5xl tracking-widest">My Cookbook</h1>
    
          <button
            className="text-lg bg-shittake hover:text-black rounded-lg p-2 text-white "
            onClick={newRecipe}
          >
            New Recipe +
          </button>
        </div>

        <div className=" mt-10 rounded-xl text-white flex flex-wrap align-center ">
          {user ? (
            user.recipes
              .slice(startIndex, endIndex)
              .map((recipe) => <Recipe key={recipe.id} {...recipe} />)
          ) : (
            <h1>LOADING</h1>
          )}
        </div>

        <div className=" text-xl flex justify-center pt-6">
          <button className="bg-champagne p-1 rounded-lg" onClick={handlePrev}>
            Prev
          </button>
          <div className="text-xl">
            &nbsp;{currentPage} of {pages}&nbsp;
          </div>{" "}
          &nbsp;
          <button className="bg-champagne p-1 rounded-lg" onClick={handleNext}>
            Next
          </button> 
        </div>
      </div>

      {recipeForm ? (
        <div className="fixed inset-0 flex justify-center items-center transition-colors backdrop-blur"> 
        <Formik
          onSubmit={formik.handleSubmit}
          initialValues={initialValues}
          className=""
        >
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white border border-shittake rounded-lg p-2"
          >
            <button
              className="bg-shittake text-white rounded-xl mb-6 flex justify-center w-full "
              type="button"
              onClick={newRecipe}
            >
              X
            </button>

            <div className='flex flex-row'>

              <div className="flex flex-col mr-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="border p-1 m-1 rounded-lg"
                  placeholder="Name"
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="error-message show">{formik.errors.name}</div>
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
                              className="m-1 p-1 border rounded-lg w-[250px]"
                            />
                            <Field
                              name={`ingredients[${index}].amount`}
                              placeholder="#"
                              value={
                                formik.values.ingredients[index]
                                  ? formik.values.ingredients[index].amount
                                  : ""
                              }
                              onChange={formik.handleChange}
                              className="m-1 p-1 border rounded-lg w-[40px]"
                            />
                            <Field
                              as='select'
                              name={`ingredients[${index}].measurement_unit`}
                              placeholder="Unit"
                              value={
                                formik.values.ingredients[index]
                                  ? formik.values.ingredients[index].measurement_unit
                                  : ""
                              }
                              onChange={formik.handleChange}
                              className="m-1 p-1 border rounded-lg w-[120px]"
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
                              -
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
              </div>

              <div className="flex flex-col  align-top ml-3">
                <label htmlFor="steps">Instructions</label>

                <textarea
                  name="steps"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.steps}
                  className="resize-none border rounded-lg overflow-y-auto w-[600px] h-full m-1 p-1"
                  placeholder="Existing Steps here"
                /> 


                

                {formik.errors.steps && formik.touched.steps && (
                  <div className="error-message show">{formik.errors.steps}</div>
                )}

              </div>

            </div>

            <button className="text-lg bg-shittake text-white hover:bg-transparent rounded-lg w-full mt-6">
              Add Recipe
            </button>

          </form>
        </Formik>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Cookbook;
