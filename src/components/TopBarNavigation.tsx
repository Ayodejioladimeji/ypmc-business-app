import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { s } from 'react-native-size-matters';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

interface Props {
  title: string;
  item?: any;
  ellipsis?: boolean;
  arrow?: boolean;
}

const TopBarNavigation = (props: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    router.back()
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity
          onPress={handleRoute}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 50,
            borderWidth: 0.2
          }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

      <Text style={{ fontSize: s(16) }}>{props?.title}</Text>

      <TouchableOpacity onPress={() => router.push("/(rider)/notification-settings")}>
        <Octicons name="gear" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth:5,
    borderColor:"#F3F3F3",
    marginTop:Platform.OS === "android" ? 20 : 0
  },
  left: {
  }
});

export default TopBarNavigation;
