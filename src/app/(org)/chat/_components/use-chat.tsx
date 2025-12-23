import { useContext, useEffect, useState } from "react";

import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";

const UseChat = ({ riderId }: any) => {
    const { state, dispatch } = useContext(DataContext);


    // ----------------EMITTERS-----------------
    // ==============Request partner/rider chat history
    useEffect(() => {

        if (!state?.socket) return;
        state?.socket.emit("getActiveChats", { limit: 10 });

        state.socket.emit("getPartnerRiderHistory", {
            partnerId: state?.user?.id,
            riderId ,
            limit: 20, 
        });
        console.log("history emitted")
    }, [state?.socket]);


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

                
            });
           
            setTimeout(() => {
                dispatch({
                    type: ACTIONS.PARTNER_CHAT_LOADING,
                    payload: false,
                });
            }, 3000)

        }
    }, [state?.socket, dispatch]);

    return <></>;
};

export default UseChat;
