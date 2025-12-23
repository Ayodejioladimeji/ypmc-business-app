import React from "react";

import { Appbar } from "react-native-paper";

import { GoBackButton } from "./GoBackButton";

export const AppBar = ({ title }: { title: string }) => {

  return (
    <Appbar.Header
      mode="center-aligned"
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 12,
        shadowColor: "#00000",
        shadowOffset: {
          width: 100,
          height: 100,
        },
      }}
    >
      <GoBackButton />
      <Appbar.Content
        title={title}
        titleStyle={{ color: "black", fontSize: 16 }}
      />
    </Appbar.Header>
  );
};
