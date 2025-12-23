import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

const progress = 75
const duration = 2000
const height = 28
const springAnimation = false
const onAnimationComplete = () => {}

export default function ProgressBar() {
  // Using shared value for better performance
  const progressValue = useSharedValue(0)

  useEffect(() => {
    // Animate to new progress value
    if (springAnimation) {
      progressValue.value = withSpring(
        progress,
        {
          damping: 15,
          stiffness: 90,
        },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)()
          }
        }
      )
    } else {
      progressValue.value = withTiming(
        progress,
        {
          duration,
        },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)()
          }
        }
      )
    }
  }, [progress, duration, springAnimation])

  // Create animated style for the progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
      height: '100%',
      backgroundColor: '#1E83C5',
      borderTopRightRadius: height / 2,
      borderBottomRightRadius: height / 2,
    }
  })

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={[animatedStyle, { justifyContent: 'center', paddingRight: 4 }]}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 100,
            alignSelf: 'flex-end',
            padding: 2,
          }}
        >
          <Ionicons name='bicycle-outline' size={16} color='#1E83C5' />
        </View>
      </Animated.View>
      {/*       */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    height,
    backgroundColor: '#6363631A',
    overflow: 'hidden',
    // marginVertical: 10,
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
})
