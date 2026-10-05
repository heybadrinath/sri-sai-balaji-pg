# Selected glass hero · 26 September 2026

Restored the hero selected in the owner’s screenshot: 144 square glass panes, blue/violet light, “Luxury PG. For ladies.” headline, italic home line, frosted “Take a look inside” button and location/directions details. Previous production is preserved in `design/live-v7/`.

## Scope check

Compared against the saved previous production source: all non-hero HTML, amenity scripts/styles, app.js, site.js, room styles, gallery scripts/styles and lower-page styles are byte-for-byte unchanged. Current wordmark, opening reveal fixes and native chapter scrolling remain. No dependencies or external assets added.

## Browser checks

- Visually matched the restored desktop hero at 1440 × 900 to the supplied screenshot. At that width, the headline is 118.08 px with the original purple accent and full-width glass field.
- Inspected 390 × 844 mobile composition: readable headline, visible frosted button, clear directions link, no horizontal overflow.
- “Take a look inside” navigated to #rooms, with the section aligned below the header.
- Verified the directions link still uses the supplied Google Maps URL.
- Inspected 320 × 667: the headline, button and bottom links fit with no horizontal overflow.
- Reduced-motion emulation stopped the ambient animation and kept the headline/button fully visible. No browser console errors were recorded. Test overrides were restored.

## Build and deployment

`npm run check` and `npm run build` passed. Design archives and research remain excluded from the production upload.

Production deployment `dpl_61Bx4Ttvnyi1AKK3DiduFnr76Yen` is ready at https://sri-sai-balaji-pg.vercel.app/. HTML, entrance styles, glass surfaces and the unchanged native chapter script were verified with HTTP 200 and matching SHA-256 against the local build. Deployed using CLI 60.1.3.

## Wavy reading progress

The header reading-progress indicator now reveals a repeating 48 × 12 px SVG wave, with a 2 px violet stroke. Width is clamped from 0% to 100%; the wave keeps its shape as progress changes. Only entrance.css changes the rendered site; existing scrolling JavaScript stays intact. Prior source is saved in design/live-v8/.

Browser checks passed at 390 × 844 and 1440 × 900. At 32.33% progress the mobile wave measured 126.09 px; desktop progress reached exactly 1440 px at the bottom and returned to 0 px at the top. No horizontal overflow or console errors were recorded. The indicator remains hidden from assistive technology and does not intercept pointer events. Static checks and the public build passed.

Wave deployment `dpl_4vV2BejSNdMCnhMRUA2ZT9PhWnin` is ready at https://sri-sai-balaji-pg.vercel.app/. Production entrance.css returned HTTP 200 and matched the local build exactly.

## Navbar wave edge

Removed the straight header border and shadow. The navbar background now ends on the same 48 × 12 px curve as the progress stroke, so the wave forms its lower edge. Only entrance.css changes the rendered site; prior source is preserved in design/live-v9/.

Local checks and build passed. Visually checked desktop and 390 × 844 mobile, including opening the mobile menu and navigating to the gallery. Header border is 0 px, shadow is none, and mobile has no horizontal overflow or console errors.

Production deployment https://sri-sai-balaji-72o5n3iva-heybadrinathwork-5305s-projects.vercel.app is live at https://sri-sai-balaji-pg.vercel.app/. The production stylesheet returned HTTP 200 and matched the local build exactly. The deployed wave edge was visually verified; screenshot saved to design/navbar-wave-edge-live.png.

## Continuous wave, repeatable text reveals and room corrections

Replaced the separately masked navbar surfaces with a full-width SVG: the surface, pale track and violet progress stroke share the same curve. Progress uses a rounded stroke endpoint and is clamped at both ends. The curve is recalculated on header resize, not on every scroll.

The hero grid now moves upward an extra 0.48 px per scroll pixel; the light field moves 0.28 px. Heading reveals reset only once fully outside the viewport and replay on return. Hero supporting copy has its own visibility threshold so the call-to-action can reappear before the heading while scrolling upward. Reduced-motion styles remain immediate and static.

WhatsApp links now use Sri Sai Balaji PG, include the selected sharing option, and retain move-in preferences in the visit form. Study tables and chairs are described as available only in 2-sharing rooms across the room card, inclusions, room dialog, amenities and FAQ. Removed the single-room desk implication.

Validation: static checks and production build passed. Mobile at 390 × 844 replayed the room heading after leaving and returning: blur restarted at 7.99 px before resolving to zero. Hero supporting copy reset offscreen and returned to full opacity with the heading still outside view. At 320 × 667 there was no horizontal overflow. Desktop at 1440 × 900 showed a continuous curve and a rounded progress endpoint; a 288 px scroll moved the grid an additional 138.24 px upward. Reduced-motion emulation removed the grid transform and text blur. Room-dialog and visit-form links were inspected without sending any messages; 4 sharing, next-month and help-me-choose options produced correct text. No browser console errors were recorded.

Deployment dpl_D4onpNP1vCM8yq1YAvAyQe5kNJ1m is READY at https://sri-sai-balaji-pg.vercel.app/. All five changed production files returned HTTP 200 and matched the local build by SHA-256. Live curve screenshot: design/continuous-wave-live.png. Previous versions of the five changed files are preserved in design/live-v10/.

## Curated gallery · 28 September 2026

Reviewed all 12 photos in the owner's Drive folder, including four new uploads. Selected two new room views and kept four existing photos that show the shared-room layout, washroom access, common area and terrace view. Removed three repetitive older room views from the displayed gallery. Source images remain untouched in Drive; prior site files are saved in design/live-v11/.

The gallery now has six photos, accurate captions and counters, responsive WebP sizes for the new images, a complete desktop grid and a mobile sequence of one photo, two pairs and a final terrace photo. No sharing category was inferred from a photograph. The existing statement that study tables and chairs are available only in 2-sharing rooms remains intact.

Validation: npm run check and npm run build passed. Inspected the gallery at 1280 × 720, 390 × 844 and 320 × 667. All six photos loaded, mobile had no horizontal overflow, and the staggered pairs displayed correctly. The lightbox opened both new photos, moved forwards and backwards, wrapped from photo 1 to photo 6, and restored focus on Escape. No browser warnings or errors were recorded during these checks.

Deployment dpl_Cf8hx4Rg6Cia1kwEHqxx6pz78mJs is READY at https://sri-sai-balaji-pg.vercel.app/. The HTML, gallery stylesheet and script, plus all six new WebP files returned HTTP 200 and matched the local build by SHA-256. Verified all six images rendered on production. Live screenshot: design/curated-gallery-live.png. Deployed with CLI 60.1.3.
