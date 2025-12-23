import {
  StyleSheet,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

interface PProps {
  coordinate: any;
}
export default function CustomMarker3({coordinate}: PProps) {
  return (
    <Marker coordinate={coordinate}>
      <MaterialIcons name="location-history" size={34} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 50,
    borderRadius: 1000,
  },
});
