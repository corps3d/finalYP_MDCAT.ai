import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

const FormInput = (props) => {
  const { label, placeholder, error } = props;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{label}</Text>
        {error && (
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {error}
          </Text>
        )}
      </View>
      <TextInput
        {...props}
        style={styles.input}
        placeholder={placeholder}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#1b1b33",
    height: 40,
    borderRadius: 8,
    fontSize: 20,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default FormInput;
