import { useState, useEffect } from "react";
import { useFormik, FieldArray } from "formik";
import toast from "react-hot-toast";
import { object, string, array } from "yup";
import { useNavigate } from "react-router-dom";

function FindRecipe() {
  const nav = useNavigate();

  const [ingFields, setIngFields] = useState(2);

  const ingredientSearchSchema = object({
    name: string(),
    amount: string(),
    measurement: string(),
  });

  const initialValues = {
    name: "",
    amount: "",
    measurement: "",
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
      <div className="bg-shittake text-white p-6 rounded-lg">
        <h2 className="text-2xl">Enter Ingredients</h2>

        <form className="flex flex-col mt-2" onSubmit={formik.handleSubmit}>
          <label htmlFor="name">Ingredients</label>

          <FieldArray name="ingredients" validateOnChange={false}>
            {(fieldArrayProps) => {
              console.log(fieldArrayProps);
            }}
          </FieldArray>

          <button className="bg-champagne text-black rounded-lg" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="border-1">
        <h1>RESULTS</h1>
      </div>
    </div>
  );
}

export default FindRecipe;
