# Snagd iOS Release Guide

## Release identity

- App name: Snagd
- Bundle ID: `app.snagd.mobile`
- Version: `1.0`
- Build: `1`
- Primary category: Business
- Secondary category: Productivity
- Age rating target: 4+
- Support URL: `https://snagd.app/support/`
- Privacy URL: `https://snagd.app/legal/privacy/`

The bundle ID must match the App Store Connect record. Change it in both `capacitor.config.ts` and the Xcode target before the first upload if another ID is required.

## Suggested store copy

Subtitle: `Flip smarter. Buy with data.`

Promotional text: `Analyze local finds, estimate resale value, scan items, and keep every opportunity organized from one mobile workspace.`

Keywords: `reselling,flipping,deals,profit,scanner,comps,marketplace,VIN,inventory,resale`

Description:

> Snagd is a mobile command center for resellers. Evaluate a listing before you buy, estimate profit and risk, save promising finds, build watchlists, and track outcomes in one focused workspace.
>
> Use Field Scan to photograph an item, run a Deal Check from listing details, or open Vehicle Mode for VIN-focused research. Snagd keeps the current workspace private on your device and lets you delete it at any time.
>
> Estimates are decision-support tools, not guarantees of resale value or profit.

Review notes:

> Snagd 1.0 is a local-first app and does not require login. Profile, preferences, saved deals, and scan activity remain on the device. The camera is optional and is requested only from Field Scan or VIN scan workflows. The app has no in-app purchases in this build. Account > Delete local data removes all locally stored Snagd data.

## Current privacy answers

Complete the App Privacy questionnaire from the behavior of the exact submitted build. VIN lookups are transmitted to the Snagd Cloudflare endpoint and NHTSA in real time. Confirm Cloudflare logging and retention settings before deciding whether this qualifies as collected data under Apple's definitions.

- Tracking: No
- Advertising: No
- Account required: No
- In-app purchases: No
- Camera: Optional, user initiated
- Photo library: Optional, user initiated
- Non-exempt encryption: No

## Windows workflow

Run these before every native upload:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run mobile:sync
npm.cmd run assets:ios
```

Windows can prepare and sync the complete Xcode project. Apple signing, archiving, and uploading require macOS/Xcode. Use one of these routes:

1. A hosted macOS CI runner connected to the repository and Apple signing credentials.
2. A rented cloud Mac opened through remote desktop.
3. Temporary access to any supported Mac for the final Xcode archive and upload.

Do not upload Apple certificates, private keys, or App Store Connect API keys to the repository.

## Final submission checklist

- Test the production build on at least one physical iPhone through TestFlight.
- Replace all seeded opportunity data and placeholder provider results before public App Review.
- Confirm every button in screenshots is functional.
- Confirm support and privacy URLs are publicly reachable.
- Have the privacy policy and terms reviewed for the actual business and data practices.
- Add required iPhone and iPad screenshots in App Store Connect.
- Complete age rating, content rights, pricing, availability, and app privacy.
- Upload build `1`, wait for processing, attach it to version `1.0`, and add it for review.
