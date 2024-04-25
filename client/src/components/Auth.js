import { useContext, useState } from 'react'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { object, string } from 'yup'
import { Formik, Form, Field, useFormik } from 'formik'

// // // // // Signup
const signupSchema = object({
	username: string()
		.min(3, 'Username must be at least 3 characters long.')
		.max(20, 'Username must be 20 characters or less.')
		.required('Username is required.'),

    email: string(),

	password_hash: string()
		.min(8, 'Password must be at least 8 characters long.')
		.matches(/[a-zA-Z0-9]/, 'Password should contain letters and numbers.'),
		// .minLowercase(1, 'Password must contain at least 1 lowercase letter.')
		// .minUppercase(1, 'Password must contain at least 1 uppercase letter.')
		// .minNumbers(1, 'Password must contain at least 1 number.'),
		// .minSymbols(1, 'Password must contain at least 1 special character.')
		// .required('Password is required.'),

	confirmPassword: string()
		.oneOf([Yup.ref('password_hash'), null], 'Passwords must match.')
		.required('Confirm Password is required.')
})

// // // // // Login
const loginSchema = object({
	username: string().required('Username is required.'),
	// Add additional password requirements
	password_hash: string()
})

// // // // // Initial Values
const initialValues = {
	username: '',
    email: '',
	password_hash: '',
	confirmPassword: '',
	role: 1
}

function Auth() {
	const { login } = useContext(UserContext)
	const [isLogin, setIsLogin] = useState(true)
	const navigate = useNavigate()

	const requestUrl = isLogin ? '/login' : '/signup'

	const formik = useFormik({
		initialValues,
		validationSchema: isLogin ? loginSchema : signupSchema,
		onSubmit: (formData) => {
			fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			}).then((res) => {
				if (res.ok) {
					res.json()
						.then((userData) => {
							login(userData)
						})
						.then(() => {
							isLogin ? navigate('/cookbook') : navigate('/cookbook')
							toast.success('Logged in')
						})
				} else if (res.status === 422) {
					toast.error('Invalid Login')
				} else {
					return res
						.json()
						.then((errorObj) => toast.error(errorObj.Error))}
			})
		}
	})

    return (
        <div className='text-3xl '>
			<h2>{isLogin ? 'Login':'Sign Up'}</h2>
			<Formik onSubmit={formik.handleSubmit}>
				<Form className='flex justify-center flex-col' onSubmit={formik.handleSubmit}>
					<Field
						type='text'
						name='username'
						placeholder='Username'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.username}
						className='input'
						autoComplete='username'
					/>
					{formik.errors.username && formik.touched.username && (
						<div className='error-message show'>
							{formik.errors.username}
						</div>
					)}
					<Field
						type='password'
						name='password_hash'
						placeholder='Password'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.password_hash}
						className='input'
						autoComplete='current-password'
					/>
					{formik.errors.password_hash &&
						formik.touched.password_hash && (
							<div className='error-message show'>
								{formik.errors.password_hash}
							</div>
						)}
					{!isLogin && (
						<>
							<Field
								type='password'
								name='confirmPassword'
								placeholder='Confirm Password'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.confirmPassword}
								className='input'
							/>
							{formik.errors.confirmPassword &&
								formik.touched.confirmPassword && (
									<div className='error-message show'>
										{formik.errors.confirmPassword}
									</div>
								)}
                            <Field
								type='email'
								name='email'
								placeholder='Email'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
								className='input'
							/>
							{formik.errors.email &&
								formik.touched.email && (
									<div className='error-message show'>
										{formik.errors.email}
									</div>
								)}
						</>
					)}
					<input  type='submit' className='submit bg-blue-500' value={isLogin ? 'Login' : 'Sign up'} />
		
					<button type='button' className='change-form' onClick={() => setIsLogin(!isLogin)} >{isLogin ? "Create New Account" : "Login"}</button>
					
				</Form>
			</Formik>
		</div>

    )
    
}

export default Auth