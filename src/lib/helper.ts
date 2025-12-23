import { addDays, addHours, addMinutes } from 'date-fns'
import { ParsedURL } from 'expo-linking'
import { Dimensions, Platform, PressableStateCallbackType } from 'react-native'

export const windowHeight = Dimensions.get('window').height
export const windowWidth = Dimensions.get('window').width

export const IS_IOS = Platform.OS === 'ios'
export const IS_ANDROID = Platform.OS === 'android'

export const ASPECT_RATIO = windowWidth / windowHeight
export const LATITUDE_DELTA = 0.04
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export function isTextChildren(
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode)
) {
  return Array.isArray(children)
    ? children.every((child) => typeof child === 'string')
    : typeof children === 'string'
}

export function formatPhoneNumber(phoneNumber: string) {
  // Remove any non-numeric characters
  phoneNumber = phoneNumber.replace(/\D/g, '')

  // Check if country code is missing
  if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('234')) {
    // Add country code
    phoneNumber = '+234' + phoneNumber
  }

  return phoneNumber
}

export function formatPhoneNumberIntoGroups(phoneNumber: string) {
  if (!phoneNumber) return ''
  // Remove non-numeric characters from the phone number
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '')

  // Check if the phone number has a country code and remove it
  const cleanedPhoneNumber = numericPhoneNumber.replace(/^(\+?234|0)?/, '')

  // Split the phone number into groups of digits
  const formattedPhoneNumber = cleanedPhoneNumber.replace(
    /(\d{4})(\d{3})(\d{4})/,
    '$1 $2 $3'
  )

  // Return the formatted phone number
  return formattedPhoneNumber
}

export function getFirstName(fullName: string) {
  if (!fullName) return ''
  const parts = fullName.split(' ')
  return parts[0]
}

export const addCommasToNumber = (number: string | number) => {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export interface TruncateOptions {
  length?: number
  omission?: string
}

export function truncate(str: string, options: TruncateOptions = {}): string {
  const DEFAULT_TRUNC_LENGTH = 30
  const DEFAULT_OMISSION = '...'

  const { length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_OMISSION } = options

  if (str === undefined) return ''

  if (str && str?.length <= length) {
    return str
  }

  const truncatedString = str.slice(0, length - omission.length) + omission

  return truncatedString
}

export function convertToSlug(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-')
}

const averageSpeedInMPS = 10

// Function to calculate ETA based on duration string and current time
export function calculateETA(durationString: string, created_at?: string) {
  const createdAt = created_at ? new Date(created_at) : new Date()

  // Parse duration string to extract hours and minutes
  const hoursRegex = /(\d+)\s*hour/i
  const minutesRegex = /(\d+)\s*min/i

  let hours = 0
  let minutes = 0

  const hoursMatch = durationString.match(hoursRegex) as RegExpExecArray
  const minutesMatch = durationString.match(minutesRegex)

  if (hoursMatch) {
    hours = parseInt(hoursMatch?.[1] as string)
  }
  if (minutesMatch) {
    minutes = parseInt(minutesMatch?.[1] as string)
  }

  // Calculate ETA based on parsed hours and minutes
  let arrivalTime

  if (hours === 0) {
    arrivalTime = addMinutes(createdAt, minutes)
  } else {
    arrivalTime = addMinutes(addHours(createdAt, hours), minutes)
  }

  // If arrival time goes beyond the current day, adjust the date
  if (arrivalTime.getDate() !== new Date().getDate()) {
    arrivalTime = addDays(arrivalTime, 1)
  }

  // Format arrival date and time
  const formattedArrivalDate = arrivalTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedArrivalTime = arrivalTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return {
    dateOfArrival: formattedArrivalDate,
    timeOfArrival: formattedArrivalTime,
  }
}

/**
 * Normalizes a link to a string.
 *
 * @param {ParsedURL} link Link to normalize.
 * @returns Normalized link.
 */
export function normalizeLink(link: ParsedURL | null) {
  if (!link || !link?.path) return '/'

  let newLink = link.path

  if (!link.queryParams) return newLink

  const params = Object.entries(link.queryParams)
  if (params.length === 0) return newLink

  newLink += '?'
  params.forEach(([key, value], index) => {
    newLink += `${key}=${value}`
    if (index !== params.length - 1) newLink += '&'
  })

  return newLink
}
