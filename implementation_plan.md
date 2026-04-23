# PantryPal Implementation Plan

This is the implementation plan for **PantryPal**, an AI-powered recipe suggestion mobile app. As requested, this plan outlines both the frontend and future backend phases, but we will focus right now exclusively on the frontend MVP implementation.

## User Review Required
The app brief specifies calling the Anthropic Claude API directly from the React Native frontend. For a production environment, this exposes the API key to users. I will implement the API call in the frontend for this phase to meet the MVP requirement, but please be aware of this security consideration. You will need to provide your Antropic API Key or allow me to create a mock service if you prefer to test without a real key.

Please approve this plan so we can begin coding the frontend!

## Proposed Changes

### Phase 1: Frontend Application (Current Phase)
The frontend will be built using **React Native + Expo** for easy testing via Android Studio, matching the specifications in the provided document.

- **Initialization**: Generate a new Expo project (`npx create-expo-app PantryPal`).
- **Dependencies**: 
  - `react-native-svg` for donut charts.
  - `@expo-google-fonts/dm-sans` & `@expo-google-fonts/lora` for typography.
- **Architecture**:
  - Single `App.js` container using state-based navigation (`home` | `results` | `detail`).
  - Strict adherence to the provided design system (Primary Green: `#1D9E75`, Dark Green: `#085041`, etc.).
- **Components to Build**:
  - **Screens**: Splash Screen, Home Dashboard, Results Screen, Recipe Detail Screen.
  - **Shared UI**: `TopBar`, `SideNav`, `FilterRow`, `DonutChart`.
- **API Integration**: Implement `fetch()` to Anthropic's Claude API `claude-sonnet-4-20250514`.

### Phase 2: Backend & Infrastructure (Future Phase)
To scale PantryPal securely and robustly, a dedicated backend is recommended down the line.

- **Tech Stack**: Node.js + Express.js + PostgreSQL (or MongoDB).
- **Core Responsibilities**:
  - **API Proxy**: Proxy requests to Anthropic's Claude API from the secure backend to prevent leaking API keys to the mobile client.
  - **Authentication**: Implementing JWT authentication or Firebase Auth for secure user sign-up/login.
  - **Database Persistence**: Storing user preferences, saved recipes, and meal goals across devices.
  - **Rate Limiting**: Preventing abuse of the AI API generation endpoints.

---

## Open Questions
1. **API Key**: Since the frontend calls Anthropic API directly, do you want to provide a real Claude API key for testing, or should I mock the API response initially?
2. **Setup Location**: I will create the Expo app folder (`PantryPal`) directly inside `c:\Users\NITRO\Documents\HW App`. Is this correct?

## Verification Plan
### Automated Tests
- No automated testing tools (like Jest/Detox) are requested for this MVP.
- I will verify the initialization of the Expo app and the installation of core packages using `run_command`.

### Manual Verification
- Once built, you can run the app directly in your Android Studio environment by using `npx expo run:android` or running it in the Expo Go app. 
- You will be able to verify the multi-screen navigation (Home -> Results -> Details), filtering functionality, and UI components accuracy.
