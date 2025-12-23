import React, { ReactNode } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView
      edges={["right", "left", "top",]}
      style={{
        backgroundColor: "#F3F3F3",
        flex: 1,
        paddingHorizontal: 12,
        height: "100%",
      }}
    >
      {children}
    </SafeAreaView>
  );
};
