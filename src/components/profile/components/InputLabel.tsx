import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';

type InputLabelProps = {
  children: string;
};

export default function InputLabel({ children }: InputLabelProps) {
  return <Text style={styles.inputLabel}>{children}</Text>;
}
