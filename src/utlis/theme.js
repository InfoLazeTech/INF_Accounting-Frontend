import { theme } from "antd";

// Professional Color Palette
const colors = {
  // Primary Colors
  primary: {
    50: "#E6F4FA",
    100: "#CCE9F5",
    200: "#99D3EA",
    300: "#66BDE0",
    400: "#33A7D5",
    500: "#1785B6", // main primary
    600: "#136F99",
    700: "#0F597C",
    800: "#0B4360",
    900: "#072D43",
  },

  // Secondary Colors
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b", // Main secondary color
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Success Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main success color
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Warning Colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main warning color
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Error Colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main error color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Brand Colors (Custom for your business)
  brand: {
    blue: "#1785B6", // Your current primary
    teal: "#0d9488",
    indigo: "#6366f1",
    purple: "#8b5cf6",
    pink: "#ec4899",
  },
};

// Light Theme Configuration
const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Color Tokens
    colorPrimary: colors.primary[500],
    // colorPrimaryHover: colors.primary[600],
    colorPrimaryActive: colors.primary[700],
    colorPrimaryBg: colors.primary[50],
    colorPrimaryBgHover: colors.primary[100],
    colorPrimaryBorder: colors.primary[200],
    colorPrimaryBorderHover: colors.primary[300],

    // Success Colors
    colorSuccess: colors.success[500],
    colorSuccessHover: colors.success[600],
    colorSuccessActive: colors.success[700],
    colorSuccessBg: colors.success[50],
    colorSuccessBgHover: colors.success[100],
    colorSuccessBorder: colors.success[200],
    colorSuccessBorderHover: colors.success[300],

    // Warning Colors
    colorWarning: colors.warning[500],
    colorWarningHover: colors.warning[600],
    colorWarningActive: colors.warning[700],
    colorWarningBg: colors.warning[50],
    colorWarningBgHover: colors.warning[100],
    colorWarningBorder: colors.warning[200],
    colorWarningBorderHover: colors.warning[300],

    // Error Colors
    colorError: colors.error[500],
    colorErrorHover: colors.error[600],
    colorErrorActive: colors.error[700],
    colorErrorBg: colors.error[50],
    colorErrorBgHover: colors.error[100],
    colorErrorBorder: colors.error[200],
    colorErrorBorderHover: colors.error[300],

    // Text Colors
    colorText: colors.neutral[900],
    colorTextSecondary: colors.neutral[600],
    colorTextTertiary: colors.neutral[500],
    colorTextQuaternary: colors.neutral[400],

    // Background Colors
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: colors.neutral[50],
    colorBgSpotlight: colors.neutral[800],
    colorBgMask: "rgba(0, 0, 0, 0.45)",

    // Border Colors
    colorBorder: colors.neutral[200],
    colorBorderSecondary: colors.neutral[100],

    // Font Settings
    fontFamily:
      "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Border Radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,

    // Motion
    motionDurationFast: "0.1s",
    motionDurationMid: "0.2s",
    motionDurationSlow: "0.3s",

    // Shadow
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    boxShadowSecondary: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    boxShadowTertiary: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  components: {
    // Layout Components
    Layout: {
      headerBg: "#ffffff",
      headerColor: colors.neutral[900],
      headerHeight: 64,
      siderBg: colors.neutral[700],
      siderColor: colors.neutral[100],
      bodyBg: colors.neutral[50],
      footerBg: "#ffffff",
      footerPadding: "24px 50px",
    },

    // Menu Component
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: colors.primary[50],
      itemSelectedColor: colors.primary[600],
      itemHoverBg: colors.neutral[100],
      itemHoverColor: colors.neutral[900],
      itemActiveBg: colors.primary[100],
      itemActiveColor: colors.primary[700],
      subMenuItemBg: "transparent",
      popupBg: "#ffffff",
      darkItemBg: "transparent",
      darkItemSelectedBg: colors.primary[600],
      darkItemSelectedColor: "#ffffff",
    },

    // Button Component
    Button: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 16,
      paddingInlineLG: 20,
      paddingInlineSM: 12,
      fontWeight: 500,
    },

    // Input Components
    Input: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
      colorBgContainer: "#ffffff",
      colorBorder: colors.neutral[300],
      colorBorderHover: colors.primary[400],
      colorBorderFocus: colors.primary[500],
      colorTextPlaceholder: colors.neutral[400],
    },

    // Select Component
    Select: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      colorBgContainer: "#ffffff",
      colorBorder: colors.neutral[300],
      colorBorderHover: colors.primary[400],
      colorBorderFocus: colors.primary[500],
      colorTextPlaceholder: colors.neutral[400],
      optionSelectedBg: colors.primary[50],
      optionActiveBg: colors.neutral[100],
    },

    // Table Component
    Table: {
      headerBg: colors.neutral[50],
      headerColor: colors.neutral[900],
      headerSplitColor: colors.neutral[200],
      colorBgContainer: "#ffffff",
      rowHoverBg: colors.primary[50],
      rowSelectedBg: colors.primary[100],
      rowSelectedHoverBg: colors.primary[200],
      borderColor: colors.neutral[200],
      borderRadius: 8,
    },

    // Card Component
    Card: {
      borderRadius: 8,
      colorBgContainer: "#ffffff",
      colorBorderSecondary: colors.neutral[100],
      paddingLG: 11,
      padding: 16,
      paddingSM: 12,
    },

    // Modal Component
    Modal: {
      borderRadius: 8,
      colorBgElevated: "#ffffff",
      paddingLG: 24,
      padding: 16,
      paddingSM: 12,
    },

    // Form Component
    Form: {
      verticalLabelPadding: "0 0 4px 0",
      horizontalLabelPadding: "0 8px 0 0",
      labelColor: colors.neutral[700],
      labelFontSize: 14,
      labelFontWeight: 500,
    },

    // Tabs Component
    Tabs: {
      colorBgContainer: "#ffffff",
      colorBorderSecondary: colors.neutral[200],
      itemSelectedColor: colors.primary[500],
      itemHoverColor: colors.neutral[700],
      itemActiveColor: colors.primary[700],
    },

    // Tag Component
    Tag: {
      borderRadius: 4,
      colorBgContainer: colors.neutral[100],
      colorBorder: colors.neutral[200],
      colorText: colors.primary[500],
    },

    // Badge Component
    Badge: {
      colorBgContainer: "#ffffff",
      colorError: colors.error[500],
      colorSuccess: colors.success[500],
      colorWarning: colors.warning[500],
      colorInfo: colors.primary[500],
    },

    // Drawer Component
    Drawer: {
      colorBgElevated: "#ffffff",
      paddingLG: 24,
      padding: 16,
      paddingSM: 12,
    },

    // Collapse Component
    Collapse: {
      colorBgContainer: "#ffffff",
      colorBorder: colors.neutral[200],
      borderRadius: 6,
      contentPadding: "16px",
      headerPadding: "12px 16px",
    },

    // DatePicker Component
    DatePicker: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      colorBgContainer: "#ffffff",
      colorBorder: colors.neutral[300],
      colorBorderHover: colors.primary[400],
      colorBorderFocus: colors.primary[500],
    },
  },
};

// Dark Theme Configuration
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...lightTheme.token,
    colorBgContainer: colors.neutral[800],
    colorBgElevated: colors.neutral[700],
    colorBgLayout: colors.neutral[900],
    colorText: colors.neutral[100],
    colorTextSecondary: colors.neutral[300],
    colorTextTertiary: colors.neutral[400],
    colorBorder: colors.neutral[600],
    colorBorderSecondary: colors.neutral[700],
  },
  components: {
    ...lightTheme.components,
    Layout: {
      ...lightTheme.components.Layout,
      headerBg: colors.neutral[800],
      headerColor: colors.neutral[100],
      siderBg: colors.neutral[800],
      siderColor: colors.neutral[100],
      bodyBg: colors.neutral[900],
      footerBg: colors.neutral[800],
    },
    Table: {
      ...lightTheme.components.Table,
      headerBg: colors.neutral[700],
      headerColor: colors.neutral[100],
      colorBgContainer: colors.neutral[800],
      rowHoverBg: colors.neutral[700],
    },
    Card: {
      ...lightTheme.components.Card,
      colorBgContainer: colors.neutral[800],
    },
  },
};

// Export the theme configuration
const customTheme = lightTheme;

// Export color palette for use in components
export const colorPalette = colors;

// Export theme variants
export const themeVariants = {
  light: lightTheme,
  dark: darkTheme,
};

export default customTheme;
