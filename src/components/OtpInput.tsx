import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
  StyleSheet,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '@/theme'

export const OtpInput = ({ onComplete }: any) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<Array<TextInput | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (text: string, index: number) => {
    // Allow only numbers
    if (!/^\d?$/.test(text)) return

    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={[
            styles.input,
            focusedIndex === index && { borderColor: colors.primary },
          ]}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="numeric"
          maxLength={1}
          ref={(ref) => (inputRefs.current[index] = ref)}
          selectTextOnFocus
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
})
