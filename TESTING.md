# Testing Snagd From Windows and a Phone

## Local Windows test

Build the same static bundle Cloudflare will serve, then run it with Pages Functions:

```powershell
npm.cmd run build
npm.cmd run pages:dev
```

Open `http://127.0.0.1:8788/app/vehicle-mode/` on the Windows computer. Localhost is treated as a secure camera context by modern desktop browsers.

Use the `Use test VIN` button to verify the full API/report path with `1HGCM82633A004352`. It should decode as a 2003 Honda Accord and load NHTSA recall campaigns.

## Phone test from Windows

Phone browsers require HTTPS for live camera access. The simplest repeatable loop is a Cloudflare Pages preview:

1. Push the project to GitHub.
2. In Cloudflare, create or open a Pages project and connect that repository.
3. Set the build command to `npm run build`.
4. Set the output directory to `out`.
5. If the GitHub repository contains only `snagd-web`, leave the root directory blank. If it contains the parent workspace, set root directory to `snagd-web`.
6. Push work to a non-production branch to receive an HTTPS preview URL.
7. Open the preview URL on the phone and choose Add to Home Screen for an app-like launch surface.

Cloudflare Pages automatically discovers `functions/api/vin/[vin].ts` and serves it with the static export.

## VIN scan test

1. Open Vehicle Mode and tap Open VIN Scanner. This user action primes audio so iPhone and Android browsers permit the success sound later.
2. Allow camera access.
3. Aim at the barcode on the driver-side door-jamb label. Hold the phone close enough that the barcode fills most of the frame.
4. A successful scan stops the camera, plays the two-tone confirmation, triggers a short vibration where supported, and loads the vehicle report.
5. Confirm year, make, model, trim, engine, fuel, body, and recall campaigns.
6. Enter asking price, target resale, repair budget, and desired profit to calculate a max offer.

The current scanner reads VIN barcodes. Plain windshield VIN text requires manual entry until OCR is added.

## Regression checklist

- Invalid or short VIN returns a clear validation error.
- Denying camera permission leaves manual VIN entry available.
- Camera stream stops after success and when the scanner closes.
- Success sound occurs only after a valid decode.
- No market value, title history, accident history, or odometer history is shown as verified without a licensed provider.
- Save Vehicle survives a page refresh on the same device.
- Account > Delete local data clears the workspace.
- Light and black themes remain readable.
- Bottom navigation respects the phone safe area.
- Production build completes before every deployment.
