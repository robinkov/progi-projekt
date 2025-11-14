# React Native Expo Frontend

## Dependencies
```bash
npm install -g expo-cli
npm install
```

## Create a .env
```bash
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3Fnb2ZlZ3NocWNybXdicXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTkxNzksImV4cCI6MjA3NzMzNTE3OX0.Yzwssz1RUS93uwIUtpFJgc1GJHCCLp_dHV0Z5NxzMAo
EXPO_PUBLIC_BACKEND_URL=https://progi-projekt-l6px.onrender.com
```

## Usage

**Important:** Make sure when using app on web that you use mobile view (Toggle Device Toolbar - Ctrl + Shift + M).

App is designed for mobile devices but deployment on iOS/Android is not finished.

## Run the app
```bash
npx expo start --clear
```

You might need to use `--tunnel` flag if you're running on a physical device.
