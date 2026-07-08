# Changelog

## [Unreleased]

## [2.0.0] - 2026-07-08

### Changed

- [BREAKING-CHANGES] **@janiscommerce/app-crashlytics peer dependency**: now requires `>=3.0.1` (previously `>=2.0.0`). Consumer apps must update to app-crashlytics v3.
- [BREAKING-CHANGES] **@react-native-firebase/app and @react-native-firebase/messaging peer dependencies**: now require `^21.6.1` (previously `^18.9.0`). Consumer apps must upgrade their react-native-firebase packages to v21.
- [BREAKING-CHANGES] **react-native peer dependency**: minimum version raised to `0.71.5` (previously `0.67.5`).

### Added

- Support for React Native up to 0.81 (tested with 0.80.2)
- Support for react 19 (`react >=17.0.2 <20.0.0`)

## [1.0.0] - 2026-01-30

### Changed

- [BREAKING-CHANGES] **Renamed function**: `updateSuscription` has been renamed to `updateSubscription` to fix typo. If you are using this function in your code, you need to update all references from `updateSuscription` to `updateSubscription`.

## [0.2.0] - 2025-11-13

### Added

- mmkv to persist notifications

## [0.2.0-beta.1] - 2025-11-13

### Added

- workflow to publish pkg beta version

## [0.1.0] - 2025-11-11

### Added

- Support up to react 19

## [0.0.7] - 2025-07-23

### Fixed

- The subscription request is only made when the user is not subscribed.

## [0.0.6] - 2025-07-13

### Added

- cancelNotificationSuscription method

## [0.0.5] - 2025-06-17

### Added

- Sound to notifications

## [0.0.4] - 2024-06-25

### Added

- Added notification channels

## [0.0.3] - 2024-06-13

### Added

- additional info to send in subscription

## [0.0.2] - 2024-05-03

### Added

- NotificationProvider (HOC) to receive notifications at background and foreground
- Github actions to deploy to npm
- Callback to handle notification
