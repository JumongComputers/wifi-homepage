"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Required"),
  });

  const handleSignIn = async (values: FormData) => {
    try {
      const res = await signInWithEmailAndPassword(values.email, values.password);
      console.log({ res });
      sessionStorage.setItem("user", "true");
      setFormData({ email: "", password: "" });
      router.push('https://rfcabeokuta.com/')
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="flex justify-between p-4">
          <h1 className="text-xl">Sign In</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-gray-800 text-white px-2 py-1 rounded dark:bg-gray-200 dark:text-black"
          >
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </header>
        <main className="flex justify-center items-center h-full">
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({ handleChange, handleBlur, values }) => (
              <Form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none"
                >
                  Sign In
                </button>
                Dont have an account? <Link href="/sign-in" className="text-indigo-600 hover:underline">Sign In</Link>
              </Form>
            )}
          </Formik>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error.message}</p>}
          
        </main>
        
      </div>
    </div>
  );
};

export default SignIn;
