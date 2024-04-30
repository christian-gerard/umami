import { useState, useEffect } from "react";
import { useFormik, FieldArray, Formik, Field } from "formik";
import toast from "react-hot-toast";
import { object, string, array } from "yup";
import { useNavigate } from "react-router-dom";

function FindRecipe() {
  const nav = useNavigate();

  const [ingFields, setIngFields] = useState(2);

  const ingredientSearchSchema = object();

  const initialValues = [
    {
      settings: "aksdjf",
      erdfw: "kdfjlsdkfj",
      ingredients: [
        {
          name: "Christian",
          amount: "123",
          measurement: "1232",
        },
      ],
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: ingredientSearchSchema,
    onSubmit: (formData) => {
      console.log(formData);
    },
  });

  return (
    <div className="p-6 flex flex-row">
      <div className="bg-shittake text-white p-6 rounded-lg">
        <h2 className="text-2xl">Enter Ingredients</h2>

        <Formik initialValues={initialValues} onSubmit={formik.handleSubmit}>
          <form className="flex flex-col mt-2">
            <label htmlFor="name">Ingredients</label>

            <FieldArray name="ingredients" validateOnChange={false}>
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values } = form;
                const ingredients = values[0].ingredients || [];

                const handleAddIngredient = () => {
                  push({ name: "", amount: "", measurement: "" });
                };

                return (
                  <div>
                    {ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <Field
                          name={`ingredients[${index}].name`}
                          placeholder="Name"
                        />
                        <Field
                          name={`ingredients[${index}].amount`}
                          placeholder="Amount"
                        />
                        <Field
                          name={`ingredients[${index}].measurement`}
                          placeholder="Measurement"
                        />
                        <button type="button" onClick={handleAddIngredient}>
                          ADD
                        </button>
                        <button type="button" onClick={() => remove(index)}>
                          REMOVE
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

      <div className="border-1">
        <h1>RESULTS</h1>
      </div>
    </div>
  );
}

export default FindRecipe;
