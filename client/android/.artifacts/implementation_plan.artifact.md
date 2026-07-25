# Implementation Plan: Detailed Error Reporting and Analysis Fix

The app is connected to the server, but `yt-dlp` is failing to read the video links (likely due to YouTube blocking Render's IP). This plan focuses on getting the exact error message from the server and trying advanced bypass techniques.

## User Review Required

> [!IMPORTANT]
> - **Error Reporting**: আমি সার্ভারের কোড এমনভাবে আপডেট করছি যাতে এটি ভিডিও টুলের (yt-dlp) আসল ভুলটি আপনাকে দেখায়। এটি আমাকে বুঝতে সাহায্য করবে যে ইউটিউব কি আমাদের সার্ভারকে ব্লক করেছে কি না।
> - **Test with different links**: ইউটিউব ছাড়াও অন্য কোনো সাইটের (যেমন: Vimeo বা DailyMotion) লিঙ্ক দিয়ে একবার ট্রাই করে দেখবেন কি না।

## Proposed Changes

### [Component: Backend Server]

#### [MODIFY] [ytdlp.service.ts](file:///D:/project/d%20+a/Downloader/server/src/services/ytdlp.service.ts)
- `yt-dlp` এর আসল এরর মেসেজটি (Stderr) ক্লায়েন্টে পাঠানোর ব্যবস্থা করা।
- আরও কিছু অ্যাডভান্সড ফ্ল্যাগ যোগ করা (যেমন: `--no-playlist`, `--extract-audio` এর জন্য প্রস্তুতি)।
- `YouTube` এর জন্য বিশেষ কিছু প্যারামিটার যোগ করা।

## Verification Plan

### Manual Verification
- GitHub এ কোড পুশ করার পর Render বিল্ড শেষ হওয়া পর্যন্ত অপেক্ষা করা।
- অ্যাপে ইউটিউব লিঙ্ক দিয়ে এরর মেসেজটি দেখা। যদি এটি "403 Forbidden" বা "Bot detection" বলে, তবে আমাদের অন্য কোনো বুদ্ধি করতে হবে।
