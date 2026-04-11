# Arjun Dindigal — Portfolio

Built with Next.js 14, Tailwind CSS, and Framer Motion.

## First-time setup (do this once)

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — you're live locally.

## Adding your photos

Drop image files into the `public/images/` folder, then in `components/Portfolio.tsx`:

**Project photos** — find the comment `<!-- TO ADD PHOTO -->` in each project card and replace the placeholder div with:
```tsx
<img src={p.img} alt={p.name} className="w-full h-full object-cover" />
```

The `img` value for each project is already set in the `PROJECTS` array at the top of the file:
- VEX bot  → `public/images/vex-bot.jpg`
- Cart     → `public/images/regress-cart.jpg`
- Gauge    → `public/images/runout-gauge.jpg`
- Prints   → `public/images/3dprints.jpg`

**About photos** — in the photo grid section, replace the placeholder div with:
```tsx
<img src={`/images/photo${n}.jpg`} alt="caption" className="w-full h-full object-cover" />
```

**Resume** — drop your PDF as `public/resume.pdf` and the footer link will work automatically.

## Updating your bio

Open `components/Portfolio.tsx`, search for `BIO:` — there are two comment-marked spots.

## Deploy to Vercel (recommended, free)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Click Deploy — done. Vercel auto-detects Next.js.

Every time you `git push`, Vercel redeploys automatically.

## Deploy to GitHub Pages (alternative)

```bash
npm run build
```
Then commit the `out/` folder contents to a repo named `yourusername.github.io`.

## Coming back to Claude to add things

Just paste your updated info and say what you want changed. Claude will give you an updated `components/Portfolio.tsx` — replace the file, run `git push`, done.
