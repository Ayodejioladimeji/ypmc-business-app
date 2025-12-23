import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

export default function ShipmentItem({
  status,
  onPress,
}: {
  status: string
  onPress: () => void
}) {
  const { width } = useWindowDimensions()
  const HORIZONTAL_PADDING = 16
  const AVAILABLE_WIDTH = width - HORIZONTAL_PADDING * 2
  const COLUMN_GAP = 10
  const boxWidth = (AVAILABLE_WIDTH - COLUMN_GAP) / 2

  return (
    <View
      style={{
        paddingVertical: 22,
        paddingHorizontal: 16,
        backgroundColor: '#F3F3F380',
        borderWidth: 1,
        borderColor: '#6363631A',
        borderRadius: 20,
        gap: 30,
        width: boxWidth,
      }}
    >
      <View>
        <View style={styles.iconContainer}>
          <Ionicons name='cube-outline' size={24} style={styles.icon} />
        </View>

        <Text style={{ fontFamily: 'interMedium', fontSize: 16, marginTop: 8 }}>
          Electronics
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
          }}
        >
          <Ionicons name='bicycle-outline' size={16} color='#636363' />
          <Text style={{ color: '#636363', fontSize: 12 }}>{status}</Text>
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: 'interMedium', fontSize: 16 }}>45257</Text>

        <Pressable onPress={onPress}>
          <Text style={{ fontSize: 12, color: '#F97216' }}>View details</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#1E83C51A',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#1E83C5',
  },
})
