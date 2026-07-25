# Implementation Plan: Fix Render Build (Permission Denied)

The Render build is failing with a "Permission denied" error when running Prisma. This is a common issue when moving a project from Windows to a Linux-based server like Render.

## User Review Required

> [!IMPORTANT]
> - আমরা `Dockerfile` টি আরও একধাপ উন্নত করব যাতে এটি কোনোভাবেই পুরনো ফাইল বা পারমিশন নিয়ে ঝামেলা না করে।
> - আপনাকে আবার GitHub-এ কোড পুশ করতে হবে।

## Proposed Changes

### [Component: Backend Server]

#### [MODIFY] [Dockerfile](file:///D:/project/d%20+a/Downloader/server/Dockerfile)
- `COPY . .` কমান্ডটি `npm install` এর আগে নিয়ে আসব।
- `node_modules` ফোল্ডারটি ডিলিট করার একটি কমান্ড যোগ করব যাতে কোনো পুরনো ফাইল ডিস্টার্ব না করে।
- `prisma` কে সরাসরি রান করার বদলে `npm run` ব্যবহার করব।

#### [MODIFY] [package.json](file:///D:/project/d%20+a/Downloader/server/package.json)
- `prisma` কে `dependencies` এ নিয়ে আসব যাতে এটি প্রোডাকশনে সবসময় পাওয়া যায়।

## Verification Plan

### Manual Verification
- Render-এ বিল্ড স্ট্যাটাস চেক করা।
- "Permission denied" এররটি চলে গেছে কি না তা দেখা।
