import { useRef, useContext, useEffect, useState } from "react";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";


export const UseChat = ({shippingId}: any) => {
    const { state, dispatch } = useContext(DataContext)

    useEffect(() => {
        if (!state?.token) return;
        // Request chat history when connected
        state?.socket.emit("getHistory", { shippingId, limit: 10 });
      

    }, [shippingId,state?.socket, state?.token])


    return <></>;
};

export default UseChat
