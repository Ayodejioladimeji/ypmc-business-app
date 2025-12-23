import {StyleSheet} from 'react-native';
import React from 'react';
import {Marker} from 'react-native-maps';
import { NavigatorIcon } from '@/assets/images/svgs';
import { Image } from 'expo-image';

interface PProps {
  coordinate: any;
}

export default function NavigatorMarker({coordinate}: PProps) {
  //
  return (
    <Marker coordinate={coordinate} title="Your Location"
      description="This is your current location">
      <Image source={require("@/assets/images/navigator.svg")} alt="" style={{ height: 40, width: 40, transform: [{ rotate: `120deg` }] }}/>
    </Marker>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 35,
    height: 35,
    backgroundColor: '#FFC619',
    borderRadius: 1000,
    // Additional styles for your custom icon
  },
  iconbig: {
    width: 30,
    height: 30,
    backgroundColor: '#FFF9E6',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
