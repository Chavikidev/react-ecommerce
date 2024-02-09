import React, {useState} from "react";
import Layout from "../shared/layout";
import { Formik } from "formik";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../sign-up/sign-up.styles.scss';

const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  }



const SignIn=({history:{push}})=>{
    const [error,setError]=useState(null);
    const initialValues={
        email:'',
        password:'',
    };

    const handleSignIn=async (values,{setSubmitting})=>{
        const {email, password}=values;
        try {
            const auth=getAuth();
            await signInWithEmailAndPassword(auth,email,password)
            .then((userCredential) => {
                // Signed in 
                // const user = userCredential.user;
                setSubmitting(false);
                push('/shop');
              })
              .catch((error) => {
                setSubmitting(false);
                setError(error.code,error.message);
              });
        } catch (error) {
            setError(error)
        }
    }

    return (
        <Layout>
            <h1>Sign In</h1>
            <div className="form-container">
                <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSignIn}
                >
                    {
                        ({values, errors, handleChange, handleSubmit, isSubmitting})=>{
                            // const { email, password }=errors;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <input 
                                        type="email" 
                                        name="email" 
                                        value={values.email}
                                        onChange={handleChange} 
                                        placeholder="E-mail"
                                        className={"nomad-input"}/>
                                    </div>
                                    <div>
                                        <input 
                                        type="password" 
                                        name="password" 
                                        value={values.password}
                                        onChange={handleChange} 
                                        placeholder="Password"
                                        className={"nomad-input"}/>
                                    </div>
                                    <div className="submit-btn">
                                        <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="button is-black nomad-btn submit">
                                            Sign In
                                        </button>
                                    </div>
                                    <div className="error-message">
                                            {
                                                error && <p>{error.message}</p>
                                            }
                                        </div>
                                </form>
                            );
                        }
                    }
                </Formik>
            </div>
        </Layout>
    );
}


export default withRouter(SignIn);
