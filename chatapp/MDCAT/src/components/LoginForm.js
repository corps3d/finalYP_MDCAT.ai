import { View, Text, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import FormContainer from "./FormContainer";

import { Formik } from "formik";
import * as Yup from "yup";

import { storeAuthData } from "../utils/storage";
import client from "../utils/api/client";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ navigation }) => {
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const userInfo = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter a valid email!")
      .required("Email is required!"),
    password: Yup.string().trim().required("Password is required!"),
  });

  const signIn = async (values, formikActions) => {
    try {
      setServerError("");
      const res = await client.post("/sign-in", {
        ...values,
      });
      const { user, token } = res.data;

      formikActions.resetForm();
      formikActions.setSubmitting(false);

      await login(user, token);
      

    
      navigation.replace("MainTabs");
    } catch (error) {
      console.log(error);
      formikActions.setSubmitting(false);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setServerError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else if (error.request) {
        // The request was made but no response was received
        setServerError(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setServerError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signIn}
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
          const { email, password } = values;
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
                value={email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && errors.email}
                label={"Email"}
                placeholder={"example@email.com"}
              />
              <FormInput
                value={password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
                secureTextEntry
                label={"Password"}
                placeholder={"********"}
              />
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={handleSubmit}
                label={"Login"}
              />
            </>
          );
        }}
      </Formik>
    </FormContainer>
  );
};

export default LoginForm;
