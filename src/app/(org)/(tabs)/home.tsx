import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState, Platform, RefreshControl, SafeAreaView, ScrollView, View } from "react-native";

import { Layout } from "@/components";
import {
  OrgActiveRiders,
  OrgDetails,
  OrgQuickActions,
  OrgShipmentOrderList,
  OrgStats,
} from "@/components/org-components/home";
import { useRouter } from "expo-router";
import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";
import { ACTIONS } from "@/store/Actions";
import { removeToken } from "@/utils/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from 'react-native-device-info';
import AppUpdates from "@/components/app-updates";

// 

const Home = () => {
  const { state, dispatch } = useContext(DataContext)
  const { user } = state
  const router = useRouter()
  const appState = useRef(AppState.currentState);
  const appVersion = DeviceInfo.getVersion();
  const [version, setVersion] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);


  const getVersion = async () => {

    const res = await GetRequest('/app-versions', state?.token);
    if (res?.status === 200 || res?.status === 201) {

      const ios = res?.data?.data?.find(item => item?.platform === "iosBusiness")
      const android = res?.data?.data?.find(item => item?.platform === "androidBusiness")


      if (
        Platform.OS === 'android' &&
        android?.versionNumber !== appVersion
      ) {
        setVersion(android.versionNumber)
        setIsModalVisible(true);
      }

      if (
        Platform.OS === 'ios' &&
        ios?.versionNumber !== appVersion
      ) {
        setVersion(ios.versionNumber)
        setIsModalVisible(true);
       
      }
    }

  };

  

  useEffect(() => {
    if (state?.token) {
      getVersion();
    }
  }, [state?.token]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        getVersion()
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getVersion]);


  // get user profile
  const getProfile = useCallback(async () => {
    const res = await GetRequest("/partner/profile", state?.token)

    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.USER, payload: res?.data?.data })
      dispatch({ type: ACTIONS.PROFILE_LOADING, payload: false })
    }
    else {
      await AsyncStorage.removeItem("token")
      router.replace("/(auth)/sign-in")

    }
  }, [state?.token, state?.callback, state?.approval])


  useEffect(() => {
    if (state?.token) {
      getProfile()
    }
  }, [state?.token, state?.callback, state?.approval])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {

        if (user?.metadata?.verificationStatus !== "VERIFIED") {
          getProfile();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getProfile]);

  // get user wallet
  const getWallet = async () => {
    const res = await GetRequest("/partner/wallet-dashboard", state?.token);
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.WALLETS, payload: res?.data?.data })
    }

  };

  useEffect(() => {
    if (state?.token) {
      getWallet();
    }
  }, [state?.token, state?.packageDelivered, state?.callback]);


    const onRefresh = useCallback(() => {
      setRefreshing(true);
      dispatch({type:ACTIONS.CALLBACK, payload: !state?.callback})
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }, [refreshing]);


  // if (state?.profileLoading) return null

  // 

  return (
    <SafeAreaView style={{ backgroundColor: 'white', paddingTop: 30 }}>

      <OrgDetails />

      {!state?.profileLoading &&
        <ScrollView style={{ backgroundColor: '#F3F3F3', paddingHorizontal: 15 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <OrgStats />
          <OrgQuickActions />
          <OrgShipmentOrderList />
          <OrgActiveRiders />
        </ScrollView>}

      {isModalVisible && <AppUpdates isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} version={version} />}

    </SafeAreaView>
  );
};

export default Home;
