import arrowRight from "@/assets/icons/arrow-right-white.png";
import arrowRightWhite from "@/assets/icons/arrow-right.png";
import cameraIcon from "@/assets/icons/camera.png";
import importIcon from "@/assets/icons/import.png";
import emailIcon from "@/assets/icons/message_light.png";
import nigeriaIcon from "@/assets/icons/nigeria-icon.png";
import Onboarding1s from "@/assets/icons/onboarding-1s.svg";
import referralIcon from "@/assets/icons/referral-icon.png";
import saveIcon from "@/assets/icons/save-icon.png";
import userIcon from "@/assets/icons/user-icon.png";
import map from "@/assets/images/map.png";
import onboarding1 from "@/assets/images/onboarding-pic-1.png";
import onboarding2 from "@/assets/images/onboarding-pic-2.png";
import onboarding3 from "@/assets/images/onboarding-pic-3.png";
import onboardingImage from "@/assets/images/onboarding.webp";
import packageBoxMultiple from "@/assets/images/package-box-multiple.png";
import packageBoxSingle from "@/assets/images/package-box.png";
import profile from "@/assets/images/profile.png";
import notificationImage from "@/assets/images/push-notifications.png";
import quickPackage from "@/assets/images/quick-package.png";
import requestQuote from "@/assets/images/request-quote.png";
import shipment from "@/assets/images/shipment.png";
import wallet from "@/assets/images/wallet.png";
import { Onboarding_1, Onboarding_2 } from "@/assets/svgs/onboarding-2";

export const images = {
  onboarding1,
  Onboarding1s,
  onboarding2,
  onboarding3,
  packageBoxSingle,
  packageBoxMultiple,
  quickPackage,
  requestQuote,
  map,
  notificationImage,
  onboardingImage,
  profile,
  shipment,
  wallet
};

export const icons = {
  arrowRight,
  arrowRightWhite,
  saveIcon,
  importIcon,
  cameraIcon,
  nigeriaIcon,
  userIcon,
  emailIcon,
  referralIcon,
};

export const onboarding = [
  {
    id: 1,
    title: "Easily Create Shipments and Get Instant Quotes.",
    description:
      "Schedule new shipments and optimize your logistics with just a few taps.",
    image: Onboarding_1,
  },
  {
    id: 2,
    title: "Track Your Shipments in Real-Time.",
    description:
      "Stay updated with live tracking and status updates for all your deliveries.",
    image: Onboarding_2,
  },
  {
    id: 3,
    title: "Streamline Your Deliveries",
    description:
      "Join us today to manage your shipments effortlessly. Sign in now!",
    image: Onboarding_2,
  },
];
export const data = {
  onboarding,
};
