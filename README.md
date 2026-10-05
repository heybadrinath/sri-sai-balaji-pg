# Sri Sai Balaji Luxury PG for Ladies

Live site: https://sri-sai-balaji-pg.vercel.app/

A mobile-first landing page built with HTML, CSS and JavaScript. No application server or runtime dependencies.

## Run and build

```sh
npm start
npm run check
npm run build
```

The preview runs at `http://127.0.0.1:4173/`. Python 3 serves the files; Node.js 20 or newer runs the build and checks. The build copies an explicit public file allowlist to `public/`.

## Design and behavior

- A text-only Bodoni Moda wordmark, with Gill Sans body typography and self-hosted Lato on devices without Gill Sans. Violet, lilac and lime accents.
- The full-width glass-tile hero selected by the owner: oversized “Luxury PG. For ladies.” typography, blue/violet light, an italic home line and a frosted room-exploration button.
- Full-height mobile navigation, with staggered entrances, keyboard focus handling and clear visit/call actions.
- Four fixed-colour room cards open a room-specific enquiry dialog with a ready-to-use WhatsApp link. The visit form stays independent.
- Five amenity chapters follow an upward circular arc inside a sticky section. Native scroll position drives one continuous arc, without per-chapter pauses or scale pulses: no gesture interception, speed limits, snapping or forced waits. Information-led layouts describe the facilities.
- Six selected property photos in one gallery. Mobile uses a lead photo, two staggered pairs and a final terrace photo; desktop uses a grid. Full-size viewing supports buttons, arrow keys, Escape and touch swipes.
- Embedded Google Maps, eight specific landmark routes, visit checklist, FAQ accordions and a frosted WhatsApp enquiry panel. A textured closing section carries the contact details and oversized wordmark.
- A brief branded entrance clears before the hero reveals from blur. Other heading reveals begin at 45% visibility. Desktop custom cursor, hover states and ambient background movement remain.
- OS reduced-motion support. Short landscape views use normal-flow chapters. Without JavaScript, navigation, facts, photo links and contact links remain usable.

## Editing

| File                                           | Purpose                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `index.html`                                   | Content, contact links, photos and business metadata                |
| `styles.css`                                   | Shared layout, rooms, controls and fallbacks                        |
| `entrance.css`                                 | Header, mobile menu, hero and letter reveals                        |
| `surfaces.css`                                 | Full-width glass hero, ambient light and shared grain surfaces        |
| `lower-page.css`                               | Location, visit checklist, FAQs, enquiry and footer                 |
| `app.js`                                       | Navigation, typography reveals, reading progress and desktop cursor |
| `amenity-chapters.css` / `amenity-chapters.js` | Full-screen amenity sequence and its fallbacks                      |
| `gallery-sequence.css` / `gallery-sequence.js` | Responsive photo compositions and accessible lightbox               |
| `rooms.css`                                    | Fixed-colour room cards and the enquiry dialog                      |
| `site.js`                                      | Room enquiry dialog and WhatsApp message                            |
| `fonts.css`                                    | Local WOFF2 font faces                                              |
| `scripts/build.mjs`                            | Public asset allowlist                                              |
| `scripts/check.mjs`                            | Static integrity checks                                             |

The repository includes the website source, optimized WebP photos, WOFF2 fonts and asset licenses. Local design archives, research, uncompressed originals, generated `public/` files and credentials are excluded from Git. See `assets/README.md` for image provenance and licenses; archive paths mentioned there refer to the original local workspace.

## Content boundaries

Facilities and policies come from the owner. Rent, deposit amounts and current availability must be confirmed with the owner. The site prepares a WhatsApp message; it does not send it or confirm a reservation.

Four photos show rooms, including one with the washroom entrance; one shows the common area and one shows the terrace. Study tables and chairs are available only in 2-sharing rooms. There is no invented dining, bathroom or security photography.

Landmark links use exact origin and destination place IDs; there are no invented commute estimates. The map is an external service. A direct Maps link remains available beneath the embed.

## Deployment

The existing Vercel project is `sri-sai-balaji-pg`. A fresh clone is not linked automatically: use `vercel link` and select the existing project before deploying. No environment variables are needed by the website. `.env*`, original photos, research and archives are excluded from the upload; never copy credentials into `public/`.

The verified deployment command is:

```sh
npx --yes vercel@60.1.3 --prod --scope heybadrinathwork-5305s-projects
```

Production deployment succeeded using CLI 60.1.3 with the explicit existing project scope. The globally installed CLI is older; update it with `npm i -g vercel@latest` for future use. `vercel.json` retains the existing static build configuration. See `design-qa.md` for verification details.
