# Labwell

The official website for Labwell, built with [Next.js](https://nextjs.org).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Content and navigation

All catalog pages and the header menus are generated from files in `content/`:

| File | What it holds |
|---|---|
| `content/brands.ts` | Brands: id (URL segment), name, logo. Order = columns in the "Brands" menu. |
| `content/taxonomy.ts` | Menu groups and sections for "Product catalog" and "Clinical directions". Ids are stable; labels can be edited freely. |
| `content/products/*.ts` | One file per product → `/products/{slug}` |
| `content/clinical/*.ts` | One file per clinical page → `/clinical-directions/{direction}/{slug}` |
| `content/brand-pages/*.ts` | Brand overview (`/brands/{brand}`) and brand topic pages (`/brands/{brand}/{slug}`) |
| `content/index.ts` | Registry of all files. The order in each list is the order in the menus. |

### Add a product

1. Copy an existing file, e.g. `content/products/maglumi-x10.ts`, to `content/products/{slug}.ts`.
2. Fill in `slug`, `brand`, texts and `catalog: { group, section }` — the editor autocompletes valid ids.
   - `navLabel` is the name: the page H1, the menu link and the last breadcrumb.
   - `itemType` says what it is ("CLIA analyzer"); it is shown on its own line under the name.
   - `keySpec` (optional) is one confirmed key figure ("up to 600 tests/h") for menus.
   - `seoTitle` is the browser/search title without the site name — "| Labwell" is added automatically.
   Add `clinical: [{ direction: "..." }]` to also list it under "Clinical directions".
3. Import it in `content/index.ts` and put it in the `products` list where it should appear in the menu.
4. Run `npm test` — it checks unique URLs, valid menu places and that every file is registered.

To add a menu group or section, add it to `content/taxonomy.ts`; to add a brand, add it to `content/brands.ts` and put its logo in `public/`.
Use `order: 1` (or higher) on a placement to move an item below the others in its section.

Every non-empty group and section also gets a listing page, e.g. `/products/equipment` and
`/products/equipment/biochemistry` (clinical directions: `/clinical-directions/{direction}[/{section}]`).
Breadcrumbs link to these pages and offer a menu to switch to sibling categories.
Group and section ids therefore must not match a product or clinical page slug — the build fails if they do.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
