import { BottomSheetView } from '@gorhom/bottom-sheet'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet'
import { useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

export const renderPickupSheet = () => {
  const pickupSheetRef = useRef<BottomSheet>(null)
  const snapPoints = ['85%', '80%']
  return (
    <BottomSheet
      ref={pickupSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ScrollView style={styles.sheetContent}>
          <View style={{ marginTop: 35 }}>
            <Text style={styles.label}>Pickup Location</Text>
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => {
                pickupSheetRef.current?.collapse()
                setTimeout(() => {
                  locationSheetRef.current?.expand()
                }, 300)
              }}
            >
              <Text style={styles.locationPlaceholder}>
                {locationData.address || 'Enter pickup location'}
              </Text>
              {/* <SvgXml xml={locationPrompt} /> */}
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 35 }}>
            <Text style={styles.label}>Sender’s Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) =>
                updateFormData('pickup', 'senderName', value)
              }
              placeholder='Who is shipping this package?'
              placeholderTextColor='#63636380'
            />
          </View>
          <View style={{ marginTop: 35 }}>
            <TextInput
              style={styles.input}
              onChangeText={(value) =>
                updateFormData('pickup', 'senderPhone', value)
              }
              placeholder='+234 | 80 020 0012'
              placeholderTextColor='#63636380'
            />
          </View>

          <View style={{ marginTop: 35, marginBottom: 10 }}>
            <Text style={styles.label}>Schedule Pickup Date & Time</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => updateFormData('pickup', 'date', value)}
              placeholder='Select date and time'
              placeholderTextColor='#63636380'
            />
          </View>

          <CustomButton
            style={{ gap: 5 }}
            title='Continue'
            icon={<AntDesign name='arrowright' size={18} color='white' />}
            onPress={handleContinue}
          />
          <View style={styles.bottomPadding} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  )
}

export const renderDeliverySheet = () => (
  <BottomSheet
    ref={deliverySheetRef}
    index={-1}
    snapPoints={snapPoints}
    enablePanDownToClose={false}
  >
    <BottomSheetView style={styles.contentContainer}>
      <ScrollView style={styles.sheetContent}>
        <View style={{ marginTop: 35 }}>
          <Text style={styles.label}>Delivery Location</Text>
          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => {
              deliverySheetRef.current?.collapse()
              setTimeout(() => {
                deliveryLocationSheetRef.current?.expand()
              }, 300)
            }}
          >
            <Text style={styles.locationPlaceholder}>
              {locationData.address || 'Enter delivery location'}
            </Text>
            {/* <SvgXml xml={deliveryPrompt} /> */}
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 35 }}>
          <Text style={styles.label}>Recipient’s Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) =>
              updateFormData('delivery', 'recipientName', value)
            }
            placeholder='Who is receiving this package?'
            placeholderTextColor='#63636380'
          />
        </View>
        <View style={{ marginTop: 35 }}>
          <Text style={styles.label}>Recipient’s Phone number</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) =>
              updateFormData('delivery', 'recipientPhone', value)
            }
            placeholder='+234 | 80 020 0012'
            placeholderTextColor='#63636380'
          />
        </View>

        <View style={{ marginTop: 35, marginBottom: 10 }}>
          <Text style={styles.label}>Schedule Pickup Date & Time</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => updateFormData('delivery', 'date', value)}
            placeholder='Select date and time'
            placeholderTextColor='#63636380'
          />
        </View>

        <CustomButton
          style={{ gap: 5 }}
          title='Proceed to Summary'
          icon={<AntDesign name='arrowright' size={18} color='white' />}
          onPress={handleContinue}
        />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </BottomSheetView>
  </BottomSheet>
)

export const renderLocationSheet = () => (
  <BottomSheet
    ref={locationSheetRef}
    index={-1}
    snapPoints={snapPoints}
    enablePanDownToClose={false}
  >
    <BottomSheetView style={styles.contentContainer}>
      <ScrollView style={styles.sheetContent}>
        <View>
          <Text style={styles.label}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            value={locationData.address}
            onChangeText={(value) =>
              setLocationData((prev) => ({ ...prev, address: value }))
            }
            placeholder='Enter a new location'
            placeholderTextColor='#63636380'
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.input}
            value={locationData.landmark}
            onChangeText={(value) =>
              setLocationData((prev) => ({ ...prev, landmark: value }))
            }
            placeholder='Choose landmark (Optional)'
            placeholderTextColor='#63636380'
          />
        </View>
        <View style={styles.locationHeader}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              useGetCurrentLocation()
            }}
          >
            {/* <SvgXml xml={sendLocation} /> */}
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheetView>
  </BottomSheet>
)
export const renderDeliveryLocationSheet = () => (
  <BottomSheet
    ref={deliveryLocationSheetRef}
    index={-1}
    snapPoints={snapPoints}
    enablePanDownToClose={false}
  >
    <BottomSheetView style={styles.contentContainer}>
      <ScrollView style={styles.sheetContent}>
        <View>
          <Text style={styles.label}>Delivery Location</Text>
          <TextInput
            style={styles.input}
            value={locationData.address}
            onChangeText={(value) =>
              setLocationData((prev) => ({ ...prev, address: value }))
            }
            placeholder='Enter a new location'
            placeholderTextColor='#63636380'
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.input}
            value={locationData.landmark}
            onChangeText={(value) =>
              setLocationData((prev) => ({ ...prev, landmark: value }))
            }
            placeholder='Choose landmark (Optional)'
            placeholderTextColor='#63636380'
          />
        </View>
      </ScrollView>
    </BottomSheetView>
  </BottomSheet>
)

export const renderSummarySheet = () => (
  <BottomSheet
    ref={summarySheetRef}
    index={-1}
    snapPoints={snapPoints}
    enablePanDownToClose={false}
  >
    <BottomSheetView style={styles.contentContainer}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Shipping Summary</Text>
        <TouchableOpacity
          onPress={() => summarySheetRef.current?.collapse()}
          style={styles.closeButton}
        >
          <AntDesign name='close' size={24} color='#636363' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sheetContent}>
        {/* Package Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Package Name:</Text>
            <Text style={styles.itemValue}>{shippingSummary.package.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Size:</Text>
            <Text style={styles.itemValue}>{shippingSummary.package.size}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Security Shipping:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.package.securityShipping ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Fragile:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.package.isFragile ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Pickup Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Location:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.pickup.location}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Sender:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.pickup.senderName}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Phone:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.pickup.senderPhone}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Date & Time:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.pickup.pickupDateTime}
            </Text>
          </View>
        </View>

        {/* Delivery Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Location:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.delivery.location}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Recipient:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.delivery.recipientName}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Phone:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.delivery.recipientPhone}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Date & Time:</Text>
            <Text style={styles.itemValue}>
              {shippingSummary.delivery.deliveryDateTime}
            </Text>
          </View>
        </View>

        <CustomButton
          style={{ marginTop: 20, gap: 5 }}
          title='Find Rider'
          icon={<AntDesign name='search1' size={18} color='white' />}
          onPress={() => {
            // Add your find rider logic here
            console.log('Finding rider...')
          }}
        />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </BottomSheetView>
  </BottomSheet>
)
