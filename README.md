# DetoxAppTesting

A React Native app built as a playground for Detox E2E testing. It has a simple auth flow — Welcome → Sign Up / Log In → Home — with tests that cover navigation, form validation, and logout.

Stack: React Native 0.84, TypeScript, Detox 20.47, Jest, Node >= 22.11

---

## Setup

Make sure you've gone through the [RN environment setup](https://reactnative.dev/docs/set-up-your-environment) first. You'll also need:

- **Detox CLI** — `npm install -g detox-cli`
- **applesimutils** (iOS only) — `brew tap wix/brew && brew install applesimutils`
- **Android Studio** with an AVD set up (the config uses `Medium_Phone_API_36.0` — change `avdName` in `.detoxrc.js` if yours is different)

```sh
yarn install

# iOS only — run once, then again whenever you change native deps
bundle install
bundle exec pod install --project-directory=ios
```

---

## Running the app

```sh
yarn start        # start Metro
yarn ios          # run on iOS simulator
yarn android      # run on Android emulator
```

---

## E2E tests

Always build before running tests. The built binary is cached so you only need to rebuild when native code changes.

### iOS

```sh
yarn build:ios-debug
yarn test:ios-debug

# or release build
yarn build:ios-release
yarn test:ios-release

# run on iPhone 16 instead of 16 Pro
yarn test:ios-pro-debug

# run on both simulators in parallel
yarn test:ios-both-debug
```

### Android

Start your emulator first, then:

```sh
yarn build:android-debug
yarn test:android-debug
```

---

## What's tested

Tests live in `e2e/starter.test.js` — 16 tests across 4 suites.

**Welcome** — screen loads, both buttons are visible

**Sign Up** — navigates from welcome, empty form shows all 3 errors, invalid email is caught, short password is caught, valid submission goes to Home, the "Log In" link works

**Login** — navigates from welcome, empty form shows both errors, invalid email is caught, valid login goes to Home, the "Sign Up" link works

**Home** — welcome message is visible after login, logout button is there, tapping logout sends you back to Welcome

---

## testID reference

Handy if you're adding new tests and need to know what's already set up in `App.tsx`.

```
welcome_screen          goto_signup_button      goto_login_button

signup_screen           signup_name_input       signup_email_input
signup_password_input   signup_submit_button
signup_name_error       signup_email_error      signup_password_error
goto_login_link

login_screen            login_email_input       login_password_input
login_submit_button     login_email_error       login_password_error
goto_signup_link

home_screen             home_welcome_text       logout_button
```

---

## Other commands

```sh
yarn test    # unit tests
yarn lint    # ESLint
```

---

## Common issues

**Pod install errors** — make sure you've run `bundle install` first and that your Ruby version matches the Gemfile.

**Emulator not found** — run `emulator -list-avds`, pick one, and update `avdName` in `.detoxrc.js`.

**applesimutils missing** — `brew tap wix/brew && brew install applesimutils`

**Tests timing out** — bump `testTimeout` in `e2e/jest.config.js` or `setupTimeout` in `.detoxrc.js`.
