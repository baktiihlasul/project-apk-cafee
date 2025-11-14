import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface CustomTextInputProps extends TextInputProps {}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    width: '90%',
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
    color: COLORS.black,
  },
});

export default CustomTextInput;