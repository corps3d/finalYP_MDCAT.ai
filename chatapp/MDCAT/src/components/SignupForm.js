import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";

import { Formik } from "formik";
import * as Yup from "yup";

import { storeAuthData } from "../utils/storage";
import client from "../utils/api/client";

const SignupForm = ({ navigation }) => {
  const [serverError, setServerError] = useState("");

  const userInfo = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .trim()
      .min(3, "Please enter a valid name!")
      .required("Full Name is required"),
    email: Yup.string()
      .trim()
      .email("Please enter a valid email!")
      .required("Email is required!"),
    password: Yup.string()
      .trim()
      .min(8, "Password must be at least 8 characters long!")
      .required("Password is required!"),
    confirmPassword: Yup.string().equals(
      [Yup.ref("password"), null],
      "Passwords do not match!"
    ),
  });

  const signUp = async (values, formikActions) => {
    try {
      setServerError(""); // Clear any previous errors
      const res = await client.post("/create-user", { ...values });
  
      const { user } = res.data;  // Only store user data (no token here)
        
      formikActions.resetForm();  // Reset the form
      formikActions.setSubmitting(false);  // Disable submitting state
  
      // Navigate to login screen (since no token exists after sign-up)
      navigation.replace("AuthForm");
    } catch (error) {
      console.log(error);
      formikActions.setSubmitting(false);  // Disable submitting state
      if (error.response) {
        setServerError(
          error.response.data.message || "An error occurred during sign up. Please try again."
        );
      } else if (error.request) {
        setServerError("No response from server. Please check your internet connection.");
      } else {
        setServerError("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const { fullName, email, password, confirmPassword } = values;
          return (
            <>
              {serverError ? (
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {serverError}
                </Text>
              ) : null}
              <FormInput
                value={fullName}
                error={touched.fullName && errors.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                label={"Full Name"}
                placeholder={"John Doe"}
              />
              <FormInput
                value={email}
                error={touched.email && errors.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                autoCapitalize="none"
                label={"Email"}
                placeholder={"example@email.com"}
              />
              <FormInput
                value={password}
                error={touched.password && errors.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                autoCapitalize="none"
                secureTextEntry
                label={"Password"}
                placeholder={"********"}
              />
              <FormInput
                value={confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                autoCapitalize="none"
                secureTextEntry
                label={"Confirm Password"}
                placeholder={"********"}
              />
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={handleSubmit}
                label={"Sign Up"}
              />
            </>
          );
        }}
      </Formik>
    </FormContainer>
  );
};

export default SignupForm;
