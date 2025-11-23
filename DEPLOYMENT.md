## Deployment checklist — Vercel (Hobby)

This file lists the minimal steps and environment variables required to deploy the project to Vercel.

1) Security (must do before public deploy)
   - DO NOT commit secrets. This repo previously contained an `.env.local` with credentials — those values have been removed from the repository.
   - Rotate any credentials that may have been pushed (database password, Cloudinary API secret, etc.).

2) Environment variables (set these in Vercel Project → Settings → Environment Variables)
   - DATABASE_URL (postgres connection string for production)
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (if used)
   - NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION (optional)
   - NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN (optional)
   - NEXT_PUBLIC_WHATSAPP_NUMBER
   - NEXT_PUBLIC_PHONE_NUMBER
   - NEXT_PUBLIC_EMAIL
   - NEXT_PUBLIC_SITE_URL
   - Any other `NEXT_PUBLIC_*` keys used in the codebase

   Notes:
   - Keep DB credentials secret (do NOT prefix with NEXT_PUBLIC_).
   - Set values separately for Production and Preview if needed.

3) Recommended Build Command

   - If you only need Prisma client generation during build (recommended):

     npx prisma generate && npm run build

   - If you want to run Prisma migrations during deployment (use with caution):

     npx prisma generate && npx prisma migrate deploy && npm run build

   - Vercel default install command (npm install) and output directory (.next) are fine.

4) Local verification (PowerShell)

   npm ci
   npx prisma generate
   npm run build

5) Post-deploy checks
   - Visit the site and verify critical pages: `/`, `/de`, `/tours`, `/destinations`.
   - Check Vercel logs for runtime errors (missing env vars, Prisma connection errors).
   - Verify images load from Cloudinary.

6) If you want me to automate these repo edits
   - I can add a `.env.example` with placeholder keys, remove any tracked env files, and create a small PR.

   7) Cloudinary Upload Preset (recommended for admin uploads)

      If you want uploads from the admin panel to go into a specific preset/folder and be signed, create an Upload Preset in your Cloudinary console with these settings:

      - Preset name: `uploadfromsite`
      - Signed: true
      - Overwrite: true
      - Use filename: false
      - Unique filename: false
      - Use filename as display name: true
      - Use asset folder as public id prefix: false
      - Type: upload
      - Asset folder: `zamzam-tours/uploads`

      Then set the following environment variables in Vercel (or your host):

      - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=uploadfromsite`
      - Ensure `CLOUDINARY_API_SECRET` is configured in the server environment (do NOT expose this value to the browser).

      The app includes a server endpoint at `/api/cloudinary/sign` that generates signatures for the Cloudinary Upload Widget. Signed uploads will POST `paramsToSign` to that endpoint to obtain the signature.

--
Committed changes: removed tracked `.env.local` and added this deployment checklist (non-sensitive). If you want a separate example env file or a short PR description for rotation steps, tell me and I'll add it.
