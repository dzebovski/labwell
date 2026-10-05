import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { company } from "@/content/company";
import { SITE_URL } from "@/lib/site-config";
import { OG_IMAGE_SIZE } from "@/lib/social-metadata";

import type { OgSubject } from "./subject";

/** Foundations v1.1 tokens (app/globals.css), written out because the image is drawn outside CSS. */
const color = { ink: "#0a1927", muted: "#41576b", brand: "#115b9a", panel: "#eff8ff", border: "#d5e0e7" };

const root = process.cwd();
const fileCache = new Map<string, Promise<Buffer>>();

function read(file: string) {
  let content = fileCache.get(file);
  if (!content) {
    content = readFile(path.join(root, file));
    fileCache.set(file, content);
  }
  return content;
}

/** The image renderer does not read WebP and chokes on a 4000 px logo: hand it a small PNG. */
async function pngDataUri(file: string, size: { width: number; height: number }) {
  const png = await sharp(await read(file))
    .resize(size.width, size.height, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function titleSize(title: string) {
  if (title.length <= 22) return 88;
  if (title.length <= 40) return 72;
  return 60;
}

export async function renderOgCard(subject: OgSubject): Promise<ImageResponse> {
  const [bold, semiBold, logo, photo, mark] = await Promise.all([
    read("assets/fonts/Onest-Bold.ttf"),
    read("assets/fonts/Onest-SemiBold.ttf"),
    pngDataUri(`public${company.logo.src}`, { width: 360, height: 80 }),
    subject.photo ? pngDataUri(`public${subject.photo}`, { width: 520, height: 520 }) : undefined,
    // No product photo: the hexagon mark fills the panel.
    pngDataUri("app/icon.png", { width: 360, height: 360 }),
  ]);

  const { width, height } = OG_IMAGE_SIZE;
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          background: "#ffffff",
          fontFamily: "Onest",
          color: color.ink,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "64px 0 56px 72px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders to a bitmap, next/image does not apply */}
          <img src={logo} width={270} height={60} alt="" style={{ objectFit: "contain", objectPosition: "left" }} />
          <div style={{ display: "flex", flexDirection: "column", paddingRight: 40 }}>
            {subject.eyebrow ? (
              <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: color.brand, marginBottom: 20, lineHeight: 1.25 }}>
                {subject.eyebrow}
              </div>
            ) : null}
            <div style={{ display: "flex", fontSize: titleSize(subject.title), fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
              {subject.title}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: color.muted }}>{host}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 520, height, padding: "56px 56px 56px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 464,
              height: 518,
              background: color.panel,
              borderRadius: 32,
              border: `2px solid ${color.border}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
            <img
              src={photo ?? mark}
              width={photo ? 400 : 260}
              height={photo ? 420 : 260}
              alt=""
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: "Onest", data: semiBold, weight: 600, style: "normal" },
        { name: "Onest", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
