# Website assets

## Property photographs

The original photographs were supplied for this website in the [owner's shared Google Drive folder](https://drive.google.com/drive/folders/1XIbaSORfB9unGbsghpzTCYxJ1cWi3bF0). Original files remain unchanged. These are property-specific assets, not a stock photography collection.

| Local original           | Supplied filename                          | Original dimensions |
| ------------------------ | ------------------------------------------ | ------------------- |
| `photos/room-01.webp`    | `unnamed.webp`                             | 1360 × 756          |
| `photos/room-02.webp`    | `unnamed (1).webp`                         | 1360 × 1020         |
| `photos/room-03.webp`    | `unnamed (2).webp`                         | 1360 × 450          |
| `photos/room-04.webp`    | `unnamed (3).webp`                         | 1360 × 664          |
| `photos/room-05.webp`    | `unnamed (5).webp`                         | 1360 × 516          |
| `photos/common-area.png` | `e330bf4a-fd0a-4969-8ffb-7086984157a7.png` | 1448 × 1086         |
| `photos/terrace.jpg`     | `20250626_153235-EDIT.jpg`                 | 2914 × 1670         |

Each image also has `-640.webp` and `-1280.webp` versions. These preserve the full composition and aspect ratio, with only resizing and WebP compression. The large PNG and JPEG also have WebP alternatives: `common-area.webp` at 1448 × 1086 and `terrace.webp` at 1920 × 1100. Prefer these alternatives for full-size viewing; the untouched originals remain available.

Responsive gallery example, with `sizes` adjusted to the final layout:

```html
<img
  src="assets/photos/room-01-640.webp"
  srcset="
    assets/photos/room-01-640.webp   640w,
    assets/photos/room-01-1280.webp 1280w
  "
  sizes="(max-width: 680px) 90vw, (max-width: 1000px) 48vw, 32vw"
  width="1360"
  height="756"
  loading="lazy"
  decoding="async"
  alt="Shared room with two beds, a wardrobe and windows"
/>
```

## Gallery selection · 28 September 2026

Reviewed all 12 files in the shared folder, including four images added on 27 September. The live gallery contains six selected views:

| Gallery asset | Drive source | Selection |
| --- | --- | --- |
| `photos/room-study-corner.webp` | `file_000000004aa882439440adb36fe62855.png` · `1k5hv29_DRj4r7k8pzbo9mpZ2h-3_m007` | New lead image: bed, window and study corner |
| `photos/room-bed-wardrobe.webp` | `file_000000000b608210ab563c4b9df58f5b.png` · `1oVeY_heI6Y2lU7tQWGXIKyihm3yUHFLi` | New complementary view: bed, wardrobe and entrance |
| `photos/room-01.webp` | `unnamed.webp` | Strongest existing shared-room overview |
| `photos/room-04.webp` | `unnamed (3).webp` | Distinct view of the attached washroom entrance |
| `photos/common-area.webp` | `e330bf4a-fd0a-4969-8ffb-7086984157a7.png` | Shared spaces and lift access |
| `photos/terrace.webp` | `20250626_153235-EDIT.jpg` | Outdoor context and distant lake view |

Both new source images are 1448 × 1086 PNGs. WebP copies preserve the full composition at 1448, 1280 and 640 px wide; no retouching or generated imagery was applied. The original PNGs, source mapping and comparison sheet are kept under `design/gallery-review-2026-09-28/`, which is excluded from deployment.

Removed `room-02`, `room-03` and `room-05` from the displayed gallery because their views repeat other room shots or use less useful panoramic compositions. The existing asset files remain available for rollback. The two other new PNGs repeat the selected angles and are not displayed. `unnamed (4).webp` is a promotional sign, not an interior photograph, and remains excluded.

The collection has no standalone washroom or biometric entrance photo. Captions describe only what is visible; a single bed in a frame does not establish the room's sharing category. Study tables and chairs are available only in 2-sharing rooms, as confirmed by the owner.

## Fonts

The active stack uses Gill Sans or Gill Sans MT when installed on the visitor’s device. No proprietary font files are distributed. Self-hosted Lato is the fallback, using regular 400, bold 700 and italic 400 WOFF2 faces in `../fonts.css`.

Lato was obtained from the official Google Fonts stylesheet and converted from TTF to WOFF2 without glyph or outline changes. Its SIL Open Font License is retained at `fonts/Lato-OFL.txt`.

- Source: https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap
- License: https://github.com/google/fonts/blob/main/ofl/lato/OFL.txt

Earlier DM Sans and Instrument Serif files and their licenses remain available for the archived designs.

## Icons

The existing icon collection carries the Phosphor Icons MIT license, retained at `icons/LICENSE`.

## Surface texture

`textures/fine-grain.svg` is an original 180 × 180 repeating monochrome noise tile built with SVG filters. It is used as a low-opacity layer beneath content. Glass backgrounds are HTML/CSS, informed by the supplied Pinterest references documented in `research/visual-direction-v5.md`. No third-party reference image is distributed.

## Brand typeface

The wordmark and opening signature use Bodoni Moda 500, self-hosted as WOFF2. The font was obtained from the official Google Fonts stylesheet and converted from TTF to WOFF2 without changing glyphs. Its SIL Open Font License is retained at `fonts/bodoni-moda-LICENSE.txt`. Body text retains the approved Gill Sans/Lato stack.

- Source: https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500&display=swap
- License: https://github.com/google/fonts/blob/main/ofl/bodonimoda/OFL.txt
