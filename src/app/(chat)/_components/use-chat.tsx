import { useContext, useEffect, useState } from "react";

import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";

const UseChat = ({ recipientId }: any) => {
    const { state, dispatch } = useContext(DataContext);
    const [messages, setMessages] = useState<any>(null);


    // ----------------EMITTERS-----------------
    // ==============Request partner/rider chat history
    useEffect(() => {
        if (!state?.socket) return;
        state?.socket.emit("getActiveChats", { limit: 10 });

        state.socket.emit("getPartnerRiderHistory", {
            partnerId: recipientId,
            riderId: state?.user?.id,
            limit: 20,
        });


    }, [state?.socket]);


    // ================= get history for customer/rider chat
    useEffect(() => {
        if (!state?.socket) return;
        // Request chat history when connected
        state?.socket.emit("getActiveRiderCustomerChats", { limit: 10 });

        state?.socket.emit("getHistory", { shippingId: state?.recipient?.shippingId, limit: 10 });

    }, [state?.recipient?.shippingId, state?.socket, state?.customerChats])



    // ==============Listen for partner chats

    useEffect(() => {
        if (state?.socket) {

            // listen to active chats for rider/partner
            state.socket.on("activeChats", (active) => {
                // console.log("Active Chats received:", active);

                dispatch({
                    type: ACTIONS.ACTIVE_CHATS,
                    payload: active,
                });

                dispatch({
                    type: ACTIONS.PARTNER_CHAT_LOADING,
                    payload: false,
                });

            });

        }
    }, [state?.socket]);



    // ==============listen for customer 
    useEffect(() => {
        if (state?.socket) {
            state.socket.on("activeRiderCustomerChats", (active) => {
                // console.log("Active Customer Chats received:");

                dispatch({
                    type: ACTIONS.ACTIVE_CUSTOMER_CHATS,
                    payload: active,
                });

                dispatch({
                    type: ACTIONS.CUSTOMER_CHAT_LOADING,
                    payload: false,
                });

            });
        }
    }, [state?.socket]);

    return <></>;
};

export default UseChat;
