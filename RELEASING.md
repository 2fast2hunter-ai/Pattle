# Releasing Pattle for Android

## Overview

CI/CD automatically builds and publishes signed Android App Bundles (AAB) to Google Play on every push to `main` and on every version tag. No manual steps are required once the pipeline is running.

## Pipeline Architecture

```
push to main / version tag
        │
        ▼
.github/workflows/build-android.yml
        │
        ├── Build web assets (npm run build)
        ├── Sync Capacitor (npx cap sync android)
        ├── Decode PKCS12 keystore from ANDROID_KEYSTORE_BASE64
        ├── ./gradlew bundleRelease  →  app-release.aab (signed)
        ├── Upload AAB artifact
        └── Upload to Google Play internal track
                (via r0adkll/upload-google-play)
```

## GitHub Actions Secrets

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded PKCS12 upload keystore |
| `ANDROID_STORE_PASSWORD` | Keystore store password |
| `ANDROID_KEY_ALIAS` | Key alias within the keystore (`upload`) |
| `ANDROID_KEY_PASSWORD` | Key password |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY` | Google Play service account JSON for API access |

All secrets are stored in GitHub Actions and never committed to the repo.

## Google Play Service Account

- **Project**: `pattle-6edea`
- **Service Account**: `release-manager@pattle-6edea.iam.gserviceaccount.com`
- **Permissions required in Play Console**: Release Manager on the Pattle app

If the service account loses access, re-grant it in [Google Play Console → Setup → API access](https://play.google.com/console).

## Upload Keystore

The upload keystore (`pattle-upload.p12`) is a PKCS12 keystore generated during initial CI setup. It is stored **only** in the `ANDROID_KEYSTORE_BASE64` GitHub secret. Keep a secure backup.

If the keystore is lost:
1. Contact Google Play support to reset the upload key
2. Generate a new keystore and update the secrets (see "Rotating the Keystore" below)

## Rotating the Keystore

1. Generate a new PKCS12 keystore:
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
     -days 10000 -passout pass:NEW_KEY_PASS \
     -subj "/CN=Pattle/OU=Mobile/O=Pattle/C=US"

   openssl pkcs12 -export -out pattle-upload.p12 \
     -inkey key.pem -in cert.pem -name upload \
     -passin pass:NEW_KEY_PASS -passout pass:NEW_STORE_PASS
   ```
2. Base64-encode it: `base64 -w 0 pattle-upload.p12`
3. Update all 4 signing secrets in GitHub: `ANDROID_KEYSTORE_BASE64`, `ANDROID_STORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`
4. In Google Play Console, reset the upload key with the new certificate

## Tracks

| Track | Trigger | Action |
|-------|---------|--------|
| `internal` | Every push to `main` or tag | Automatic upload via CI |
| `alpha` / `beta` / `production` | Manual | Promote from internal in Play Console |

To change the track, edit the `track:` field in the "Upload to Google Play internal track" step in `.github/workflows/build-android.yml`.

## Version Bumping

Before releasing, update `versionCode` and `versionName` in `android/app/build.gradle`:

```gradle
versionCode 2         // must be strictly increasing integer
versionName "1.1.0"  // human-readable version
```

The `versionCode` must be strictly higher than the previously uploaded build.

## Creating a GitHub Release

Tag the commit with a version tag to trigger a GitHub Release alongside the Play Store upload:

```bash
git tag v1.1.0
git push origin v1.1.0
```

## Troubleshooting

**Build fails with "Signing not configured"**: Verify `ANDROID_KEYSTORE_BASE64` secret is set and the base64 value decodes cleanly (`echo $SECRET | base64 --decode | file -`).

**Play upload fails with 401**: The `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY` secret is invalid or the account lost Play Console access. Re-check at Google Play Console → Setup → API access.

**Play upload fails with "APK not valid"**: The `versionCode` must be higher than the last uploaded build. Bump it in `android/app/build.gradle`.

**Play upload fails with "Package name does not match"**: Confirm `packageName: com.pattle.app` in the workflow matches `applicationId` in `android/app/build.gradle`.
