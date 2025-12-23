
import { Redirect } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/store/GlobalState";
import { retrieveData, retrieveToken } from "@/utils/helper";
import { ActivityIndicator, Text, View } from "react-native";
import { ACTIONS } from "@/store/Actions";

// 

export default function Index() {
  const { dispatch } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<any>(null)
  const [role, setRole] = useState<any>(null)
  const [kyc, setKyc] = useState("true")

  useEffect(() => {
    (async () => {
      const userRole = await retrieveData("role")
      const token = await retrieveToken("token")
      const kyc = await retrieveData("kyc")

      dispatch({ type: ACTIONS.TOKEN, payload: token })

      setToken(token)
      setKyc(kyc)
      setRole(userRole)

      setLoading(false)
    })() 
  }, [])


  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color="black" size="large" />
  </View>


  if (token) {

    if (role === "PARTNER") {
      return <Redirect href="/(org)/(tabs)/home" />
    }
    else {
      return <Redirect href="/(rider)/home" />
    }
  }
  else {
    return <Redirect href="/onboarding" />;
  }

}
