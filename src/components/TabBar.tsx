import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, EvilIcons, Ionicons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

type TabBarIcon = {
  name: string
  size?: number
  color?: string
}

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const getTabBarIcon = (routeName: string): TabBarIcon => {
    switch (routeName) {
      case 'home':
        return { name: 'home', size: 18, color: '#636363' }
      case 'ship':
        return { name: 'bicycle-sharp', size: 18, color: '#636363' }
      case 'track':
        return { name: 'location', size: 18, color: '#636363' }
      case 'account':
        return { name: 'user', size: 18, color: '#636363' }
      default:
        return { name: '' }
    }
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        const { name, size, color } = getTabBarIcon(route.name)

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {name !== '' && (
              <>
                {name === 'home' && (
                  <AntDesign
                    name={name}
                    size={size}
                    color={isFocused ? '#F97216' : color}
                  />
                )}
                {name === 'bicycle-sharp' && (
                  <Ionicons
                    name={name}
                    size={size}
                    color={isFocused ? '#F97216' : color}
                  />
                )}
                {name === 'location' && (
                  <EvilIcons
                    name={name}
                    size={size}
                    color={isFocused ? '#F97216' : color}
                  />
                )}
                {name === 'user' && (
                  <AntDesign
                    name={name}
                    size={size}
                    color={isFocused ? '#F97216' : color}
                  />
                )}
              </>
            )}
            <Text
              style={{ color: isFocused ? '#F97216' : '#636363', fontSize: 12 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
