# Implementation Plan: Online Hosting Setup (Render + GitHub)

The goal is to move your backend server from your local computer to an online platform (Render.com). This will allow the Android app to work anywhere without needing your computer to be turned on or dealing with IP/Firewall issues.

## User Review Required

> [!IMPORTANT]
> - আপনার স্ক্রিনশটে যা দেখিয়েছেন তা হলো **Android App** এর ফাইল। কিন্তু অনলাইনে হোস্ট করার জন্য আমাদের **server** ফোল্ডারের ফাইলগুলো GitHub এ আপলোড করতে হবে।
> - আপনাকে [GitHub.com](https://github.com/) এ একটি অ্যাকাউন্ট খুলতে হবে।
> - এরপর [Render.com](https://render.com/) এ গিয়ে একটি ফ্রি অ্যাকাউন্ট খুলতে হবে।

## Proposed Changes

### [Component: Backend Server]

#### [NEW] [.gitignore](file:///D:/project/d%20+a/Downloader/server/.gitignore)
- `node_modules`, `dist`, `temp`, এবং ডেটাবেস ফাইলগুলো যেন GitHub এ আপলোড না হয় তার জন্য এটি তৈরি করা হবে।

#### [MODIFY] [Dockerfile](file:///D:/project/d%20+a/Downloader/server/Dockerfile)
- Render এর মতো প্ল্যাটফর্মে যেন সব ডিপেন্ডেন্সি (yt-dlp, ffmpeg) ঠিকমতো কাজ করে সেভাবে আপডেট করা হবে।

#### [MODIFY] [index.ts](file:///D:/project/d%20+a/Downloader/server/src/index.ts)
- পোর্টের কনফিগারেশন ডাইনামিক করা হবে।

## হোস্টিং করার ধাপসমূহ

### ধাপ ১: GitHub এ আপলোড
আমি আপনাকে কিছু কমান্ড দেব যা আপনি অ্যান্ড্রয়েড স্টুডিওর টার্মিনালে রান করবেন। এটি আপনার **server** ফোল্ডারের কোডগুলো GitHub এ পাঠিয়ে দেবে।

### ধাপ ২: Render এ হোস্ট করা
১. Render.com এ লগইন করুন।
২. **New +** বাটনে ক্লিক করে **Web Service** সিলেক্ট করুন।
৩. আপনার GitHub এর ওই প্রজেক্টটি সিলেক্ট করুন।
৪. Render অটোমেটিক আপনার `Dockerfile` দেখে সার্ভারটি তৈরি করে দেবে।

### ধাপ ৩: অ্যাপে লিঙ্ক আপডেট
সার্ভার লাইভ হলে আপনি একটি লিঙ্ক পাবেন (যেমন: `https://my-downloader.onrender.com`). আপনি অ্যাপের **Settings (⚙️)** এ গিয়ে এই লিঙ্কটি বসিয়ে দিলেই কাজ শেষ!

---

**আমি কি কোডগুলো তৈরি করা শুরু করব? কোড রেডি হলে আমি আপনাকে GitHub এ আপলোড করার সহজ কমান্ডগুলো দিয়ে দেব।**
