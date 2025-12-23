import React, { forwardRef, useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Input from "../ui/input";
import { colors, spacing } from "@/theme";
import { Button, ButtonText } from "../ui/button";
import { PutRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { toast } from "sonner-native";
import { ACTIONS } from "@/store/Actions";

type UpdateProfileProps = {
  user: any;
};

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

const UpdateProfile = forwardRef<BottomSheetModal, UpdateProfileProps>(
  ({ user }, ref) => {
    const headerHeight = useHeaderHeight();
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const { state, dispatch } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [snapPoints, setSnapPoints] = useState(["50%", "70%"]);
    const [focusedField, setFocusedField] = useState<null | string>(null);

    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.user?.phoneNumber || "",
      },
      mode: "onSubmit",
    });

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setSnapPoints(["70%"]);
        if (ref && "current" in ref && ref.current) {
          ref.current.expand();
        }
      });

      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setSnapPoints(["50%", "70%"]);
        if (ref && "current" in ref && ref.current) {
          ref.current.snapToIndex(0);
        }
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          enableTouchThrough
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    async function handleSubmit(data: z.infer<typeof schema>) {
      setLoading(true);

      const res = await PutRequest("/rider/profile", data, state?.token);
      if (res?.status === 200 || res?.status === 201) {
        dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback });
        toast.success(res?.data?.message);

        setTimeout(() => {
          if (ref && "current" in ref && ref.current) ref.current.dismiss();
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    }

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDismissOnClose
        enablePanDownToClose
        topInset={headerHeight}
        backdropComponent={renderBackdrop}
        style={styles.shadow}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.scrollViewContentContainer,
            { paddingBottom: bottomSafeArea + 44 },
          ]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <Form {...form}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: 16 }}>First Name</FormLabel>
                    <Input
                      autoCapitalize="words"
                      autoCorrect={false}
                      placeholder="Enter First Name"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      returnKeyType="next"
                      autoFocus
                      style={[
                        styles.input,
                        focusedField === "firstName" && { borderColor: colors.primary, borderWidth: 1 },
                      ]}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: 16 }}>Last Name</FormLabel>
                    <Input
                      autoCapitalize="words"
                      autoCorrect={false}
                      placeholder="Enter Last Name"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      returnKeyType="next"
                      style={[
                        styles.input,
                        focusedField === "lastName" && { borderColor: colors.primary, borderWidth: 1 },
                      ]}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: 16 }}>Phone Number</FormLabel>
                    <Input
                      autoCorrect={false}
                      placeholder="08012345678"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      returnKeyType="done"
                      keyboardType="numeric"
                      style={[
                        styles.input,
                        focusedField === "phone" && { borderColor: colors.primary, borderWidth: 1 },
                      ]}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button style={{ marginTop: 10, backgroundColor: "#000" }} disabled={loading} onPress={form.handleSubmit(handleSubmit)}>
                <ButtonText>Update Account Name</ButtonText>
                {loading && <ActivityIndicator size="small" color="white" />}
              </Button>
            </Form>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  shadow: {
    shadowColor: "#636363",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
  input: {
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: colors.muted,
    marginBottom: 20,
  },
});
