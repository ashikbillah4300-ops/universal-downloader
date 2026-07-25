# Implement Dynamic Color (Material You) for Android APK

The goal is to convert the current web-based "Downloader" project into an Android APK that supports **Dynamic Colors (Material You)**. This will allow the app's theme to automatically match the user's phone wallpaper and system theme.

## User Review Required

> [!IMPORTANT]
> To create an APK from a Next.js project, we will use **Capacitor**. This will add an `android` directory to your `client` folder.
> We will also need to modify your Tailwind configuration to support these dynamic colors.

## Proposed Changes

### [Component] Client (Web Frontend)

#### [MODIFY] [tailwind.config.ts](file:///D:/project/d +a/Downloader/client/tailwind.config.ts)
- Update color definitions to use CSS variables (e.g., `var(--md-sys-color-primary)`) instead of hardcoded hex values.

#### [MODIFY] [globals.css](file:///D:/project/d +a/Downloader/client/app/globals.css)
- Define default CSS variables for the color palette.
- Add utility classes for Material 3 color roles.

#### [NEW] [DynamicColorProvider.tsx](file:///D:/project/d +a/Downloader/client/components/DynamicColorProvider.tsx)
- A React component that listens for color updates from the Android system (via a JavaScript bridge) and updates the CSS variables in the DOM.

---

### [Component] Android Module (New)

#### [NEW] [Capacitor Initialization]
- Run `npx cap init` and `npx cap add android` in the `client` directory.

#### [MODIFY] [MainActivity.kt] (Inside the new android module)
- Implement a custom bridge to fetch **Material You** colors using the Android `DynamicColors` API (Material 3).
- Inject these colors into the WebView.

#### [MODIFY] [styles.xml / themes.xml]
- Use `Theme.Material3.DynamicColors` as the base theme for the Android app.

## Verification Plan

### Automated Tests
- Since this involves hardware-level system colors, manual verification is primary.
- I will check if the Android build compiles successfully.

### Manual Verification
1. Build the Android app using Android Studio.
2. Run it on an Android 12+ device/emulator.
3. Change the phone's wallpaper and verify that the app's primary/secondary colors change accordingly.
