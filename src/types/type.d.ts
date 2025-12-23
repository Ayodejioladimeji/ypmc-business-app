import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "success"
    | "disabled";
  textVariant?:
    | "primary"
    | "default"
    | "secondary"
    | "danger"
    | "success"
    | "disabled";
  icon?: any;
  style?: object;
  iconProps?: Partial<IconProps<string>>;
  disabled?: boolean;
  loading?: boolean;
  onPress: any;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  style?: object;
  disabled?:boolean
}

export interface ReactHookFormFunctionTypes {
  control?: any;
  watch?: any;
  errors?: any;
  handleSubmit?: any;
  onSubmit?: any;
  prevStep?: () => void;
  nextStep?: () => void;
  goToBusinessHours?: () => void;
  goToDeliveryRate?: () => void;
  skipBusinessHoursScreen?: () => void;
  skipDeliveryRateScreen?: () => void;
}

export interface SelectComponentProps {
  onValueChange: (value: string) => void;
  value: string;
  items: { label: string; value: string }[];
  placeholder: { label: string; value?: string };
  labelText: string;
}

export interface TabIconProps {
  icon?: any;
  color?: any;
  name?: string;
  focused?: any;
}

export interface UserAvatarProps {
  onPress?: () => void | VoidFunction | void;
  size: number;
  source: { uri: string } | any
}

export interface GenericData {
  backgroundColor?: string;
  header?: string;
  subtitle?: string;
  icon?: any;
  iconName?: any;
  iconColor?: string;
  iconBackgroundColor?: string;
  title?: string;
  value?: any;
  currencyIcon?: any;
  loading:boolean,
  route:string
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    userId: string;
    userRole: "PARTNER" | "RIDER";
  };
}
