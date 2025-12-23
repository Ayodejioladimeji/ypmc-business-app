import React, { useCallback, useContext, useEffect, useRef } from "react";
import { RiderBottomSheet, RiderMap } from "@/components/rider-components";
import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";
import { ACTIONS } from "@/store/Actions";
import { removeToken } from "@/utils/helper";
import { useRouter } from "expo-router";
import { AppState } from "react-native";

const Home = () => {
  const { state, dispatch } = useContext(DataContext)
  const { user } = state
  const router = useRouter()
  const appState = useRef(AppState.currentState);

  // get user profile
  const getProfile = useCallback(async () => {
    const res = await GetRequest("/rider/profile", state?.token)

    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.USER, payload: res?.data?.data })
      dispatch({ type: ACTIONS.PROFILE_LOADING, payload: false })
    }
    else {
      await removeToken("token")
      router.replace("/onboarding")
      dispatch({ type: ACTIONS.USER, payload: null })
    }
    dispatch({type:ACTIONS.PROFILE_LOADING, payload: false})
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

  if (state?.profileLoading) return null

  return (
      <RiderBottomSheet />
  );
};

export default Home;
