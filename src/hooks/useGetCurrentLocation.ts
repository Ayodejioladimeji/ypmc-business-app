import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

type Coordinates = {
  latitude: number
  longitude: number
}

export const useGetCurrentLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [coordinatesFetching, setCoordinatesFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null

    const setupLocation = async () => {
      setCoordinatesFetching(true)
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
          setError('Location permission not granted')
          return
        }

        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })

        // Watch for location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setCoordinates({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            })
          }
        )
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to get location')
      } finally {
        setCoordinatesFetching(false)
      }
    }

    setupLocation()

    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [])

  return {
    coords: coordinates,
    coordinatesFetching,
    error,
  }
}
