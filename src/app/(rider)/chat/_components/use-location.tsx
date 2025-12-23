import { useContext, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";

const UseLocation = ({ shippingId }: any) => {
    const { state, dispatch } = useContext(DataContext);
    const appState = useRef<AppStateStatus>(AppState.currentState);

    const emitLocationRequest = () => {
        if (state?.riderSocket && shippingId) {
            console.log("Emitting getRiderLocation");
            state.riderSocket.emit("getRiderLocation", { shippingId });
        }
    };

    // Listen to riderLocation updates
    useEffect(() => {
        if (!state?.riderSocket) return;

        const handleLocation = (location: any) => {
            dispatch({ type: ACTIONS.RIDER_LOCATION, payload: location });
        };

        state.riderSocket.on("riderLocation", handleLocation);

        return () => {
            state.riderSocket.off("riderLocation", handleLocation);
        };
    }, [state?.riderSocket]);

    useEffect(() => {
        emitLocationRequest();
    }, [state?.riderSocket, shippingId]);

    
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                console.log("App in foreground: re-emitting getRiderLocation");
                emitLocationRequest();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [state?.riderSocket, shippingId]);

    return null;
};

export default UseLocation;
