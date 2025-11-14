import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;