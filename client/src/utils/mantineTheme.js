import { createTheme, NavLink, Checkbox } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export const theme = createTheme({
  colors: {
    primary: [
      "#d2e8d8",
      "#a5d1b1",
      "#79ba8a",
      "#4ca363",
      "#208c3d",
      "#098029",
      "#007516",
      "#006902",
      "#005e00",
      "#005200",
    ],
    secondary: [
      "#fdf7dc",
      "#fbefba",
      "#fae798",
      "#f8df76",
      "#f7d754",
      "#f6d342",
      "#f5cf31",
      "#f4cb20",
      "#f3c70f",
      "#f3c300",
    ],
    tertiary: [
      "#ccedff",
      "#99dbff",
      "#66c9ff",
      "#33b7ff",
      "#00a6ff",
      "#009dff",
      "#0094ff",
      "#008bff",
      "#0082ff",
      "#0079ff",
    ],
    quarternary: [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
    ],
    dark: [
      "#d9d9d9",
      "#b4b4b4",
      "#8f8f8f",
      "#6a6a6a",
      "#454545",
      "#323232",
      "#1f1f1f",
      "#0d0d0d",
      "#000000",
      "#000000",
    ],
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    red: [
      "#ffebee", // Lightest - very soft pink-red, good for backgrounds
      "#ffcdd2", // Light red, suitable for alerts/warnings
      "#ef9a9a", // Soft muted red, good for hover states
      "#e57373", // Medium red, useful for non-critical errors
      "#ef5350", // Standard error red, professional and clear
      "#f44336", // Bold red, strong indication of error
      "#e53935", // Deep red, for critical errors or important warnings
      "#d32f2f", // Dark professional red, serious tone
      "#c62828", // Very dark red, maximum emphasis
      "#b71c1c", // Darkest red, representing extreme urgency
    ],
  },
  breakpoints: {
    xs: "24em", //480px
    sm: "48em", //768px
    md: "64em", //1024px
    lg: "74em", //1184px
    xl: "90em", //1440px
  },
  white: "#ffffff",
  black: "#000000",
  primaryColor: "primary",
  primaryShade: 4,
  luminanceThreshold: 0.3,
  components: {
    NavLink: NavLink.extend({
      defaultProps: {
        variant: "filled",
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        variant: "default",
      },
    }),
    Notifications: Notifications.extend({
      defaultProps: {
        position: "top-right",
        autoClose: 6000,
      },
    }),
  },
});
