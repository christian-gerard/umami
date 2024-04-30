import { useState, useEffect } from "react";
import { useFormik, FieldArray, Formik, Field } from "formik";
import toast from "react-hot-toast";
import { object, string, array, number } from "yup";

function FindRecipe() {
  const ingredientSearchSchema = object({
    settings: string(),
    ingredients: array().of(
      object({
        name: string(),
        amount: number(),
        measurement: string(),
      }),
    ),
  });

  const initialValues = {
    settings: "",
    ingredients: [
      {
        name: "",
        amount: "",
        measurement: "",
      },
      {
        name: "",
        amount: "",
        measurement: "",
      },
    ],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ingredientSearchSchema,
    onSubmit: (formData) => {
      console.log(formData);
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
                          name={`ingredients[${index}].measurement`}
                          placeholder="Measurement"
                          value={
                            formik.values.ingredients[index]
                              ? formik.values.ingredients[index].measurement
                              : ""
                          }
                          onChange={formik.handleChange}
                          className="m-1 p-1 rounded-lg w-[40px]"
                        />

                        <button
                          type="button"
                          onClick={() => remove(index)}
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

      <div className="border-1">
        <h1>RESULTS</h1>
      </div>
    </div>
  );
}

export default FindRecipe;
