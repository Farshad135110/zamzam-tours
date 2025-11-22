# ZamZam Tours — Next.js Starter

This is a minimal starter scaffold for the ZamZam Tours website.

Features included:
- Next.js + TypeScript starter
- Tailwind CSS
- Simple client-side i18n (English, German)
- Fleet & Tours pages
- Booking form that opens WhatsApp with a pre-filled message (uses +94701888993)

How to run locally:

```powershell
cd "c:\ZamZam tours\zamzam-tours"
npm install
npm run dev
```

Deploy:
- For best SEO and dynamic features, deploy to Vercel (recommended) and point domain from Namecheap.
- To host on Namecheap shared hosting, build a static export:

```powershell
npm run export
# Upload the `out` folder to your Namecheap hosting via cPanel/FTP
```

Next steps:
- Integrate a headless CMS (Sanity / Strapi / Firebase) for admin content.
- Add image/video hosting (Cloudinary/Vimeo) and optimize media.
- Implement SSR/ISR on Vercel for better SEO and performance.
