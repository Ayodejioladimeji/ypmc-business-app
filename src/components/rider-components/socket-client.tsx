import { useContext, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { io, Socket } from "socket.io-client";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

export const SocketClient = () => {
    const { state, dispatch } = useContext(DataContext);
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const socketRef = useRef<Socket | null>(null);

    const connectSocket = () => {
        if (!state?.token) return;

        // Disconnect existing socket if present
        socketRef.current?.disconnect();

        const newSocket = io(`${SOCKET_URL}/chat`, {
            transports: ["websocket"],
            auth: { token: `Bearer ${state?.token}` },
        });

        newSocket.on("connect", () => {
            console.log("Connected to socket WebSocket");
            dispatch({ type: ACTIONS.SOCKET, payload: newSocket });
        });

        newSocket.on("reconnect", () => {
            console.log("Socket reconnected");
        });

        const handleError = (err: any) => console.error("WebSocket error:", err);
        newSocket.on("connect_error", handleError);
        newSocket.on("connect_failed", handleError);

        // Store in ref for cleanup
        socketRef.current = newSocket;
    };

    // Initial connection and cleanup
    useEffect(() => {
        if (!state?.token) return;

        connectSocket();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [state?.token]);

    // Reconnect when app becomes active
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                console.log("App has come to the foreground. Reconnecting socket...");
                connectSocket();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return null;
};
