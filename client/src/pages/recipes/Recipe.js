import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFormik, FieldArray } from "formik";
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
  const [ingredientFields, setIngredientFields] = useState(1);
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
            (recipe) => currentRecipe.id !== route.id,
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
    ingredients: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: recipeSchema,
    onSubmit: (formData) => {
      fetch(`/recipes/${currentRecipe.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          return res.json().then((data) => {
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
              setCurrentRecipe(data);
              formik.setValues({
                name: currentRecipe.name,
                steps: currentRecipe.steps,
                ingredients: currentRecipe.ingredients,
              });
            })
            .then(() => {});
        } else if (res.status === 422) {
          toast.error("Invalid Login");
        } else {
          return res.json().then((errorObj) => toast.error(errorObj.Error));
        }
      });
    }
  }, [editMode]);

  return (
    <>
      {route.id ? (
        <div>
          <div>
            <button
              className="bg-shittake rounded-lg p-2 text-white"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-white rounded-lg p-2 text-shittake "
              onClick={handleDelete}
            >
              Delete
            </button>
            <p className="text-4xl">{currentRecipe.name}</p>
            <p className="text-lg">{currentRecipe.steps}</p>

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

                <FieldArray
                  validateOnChange={false}
                  name="ingredients"
                  render={(arrayHelpers) => (
                    <div>
                      {currentRecipe.ingredients &&
                      currentRecipe.ingredients.length > 0 ? (
                        currentRecipe.ingredients.map((ingredient, index) => (
                          <div key={index}>
                            <input
                              name={`name.${index}`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder={ingredient.food.name}
                              value={formik.values.ingredients[index].food.name}
                              className="border rounded-lg p-1 m-1 "
                            />
                            <input
                              name={`serving.${index}`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder={
                                formik.values.ingredients[index].amount
                              }
                              className="border rounded-lg p-1 m-1 "
                            />
                            <input
                              name={`measurement.${index}`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder={
                                formik.values.ingredients[index]
                                  .measurement_unit
                              }
                              className="border rounded-lg p-1 m-1 "
                            />
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                />

                <button type="button">Add Ingredient Field +</button>

                <button
                  className="bg-shittake rounded-lg text-white "
                  type="submit"
                >
                  Update Recipe
                </button>
              </form>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <NavLink to={`/recipes/${id}`}>
          <div className="p-2 bg-champagne text-black m-2 rounded-lg">
            <div className="flex flex-row justify-between">
              <p className="text-2xl font-bold">{name}</p>
            </div>

            <p className="text-m">{steps.slice(0, 25)}...</p>

            {ingredients ? (
              <>
                <p>Ingredients: {ingredients.length}</p>
                <div>
                  {ingredients.map((ingredient) => (
                    <>
                      <p>{ingredient.food.name}</p>
                      <p>
                        {ingredient.amount} {ingredient.measurement_unit}
                      </p>
                    </>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </NavLink>
      )}
    </>
  );
}

export default Recipe;
