# Implementation Plan: Play Store Ready YouTube Bypass

এই প্ল্যানটি আপনার অ্যাপকে প্লে-স্টোরে পাবলিশ করার উপযোগী করবে এবং ইউটিউবের "Bot Detection" ব্লক কাটিয়ে ভিডিও ডাউনলোড করতে সাহায্য করবে। আমরা **Cookies** মেথড ব্যবহার করব যা এখনকার সময়ে সবথেকে প্রফেশনাল সমাধান।

## User Review Required

> [!IMPORTANT]
> **Cookies ফাইল সংগ্রহ:**
> ১. আপনার ব্রাউজারে (Chrome/Edge) **"Get cookies.txt LOCALLY"** নামে একটি এক্সটেনশন ইনস্টল করুন।
> ২. ইউটিউবে গিয়ে আপনার একাউন্টে লগইন করুন (ফ্রি একাউন্ট হলেও চলবে)।
> ৩. এক্সটেনশনটি ব্যবহার করে `youtube.com` এর কুকি এক্সপোর্ট করুন এবং ফাইলটির নাম দিন `cookies.txt`।
> ৪. এই ফাইলটি আপনার প্রজেক্টের `server/` ফোল্ডারের ভেতরে রাখতে হবে।

## Proposed Changes

### [Component: Backend Server]

#### [MODIFY] [ytdlp.service.ts](file:///D:/project/d%20+a/Downloader/server/src/services/ytdlp.service.ts)
- `yt-dlp` কমান্ডে `--cookies cookies.txt` ফ্ল্যাগ যোগ করা হবে।
- যদি কুকি ফাইলটি না থাকে, তবে এটি অটোমেটিক সাধারণ পদ্ধতিতে চেষ্টা করবে।

#### [MODIFY] [Dockerfile](file:///D:/project/d%20+a/Downloader/server/Dockerfile)
- নতুন `cookies.txt` ফাইলটি অনলাইনে আপলোড করার ব্যবস্থা করা।

#### [NEW] [cookies.txt](file:///D:/project/d%20+a/Downloader/server/cookies.txt)
- একটি প্রাথমিক খালি ফাইল তৈরি করা।

### [Component: Android App]

#### [MODIFY] [api.ts](file:///D:/project/d%20+a/Downloader/client/lib/api.ts)
- আপনার Render লিঙ্কটি (`https://universal-downloader-api-w2fr.onrender.com/api`) ডিফল্ট হিসেবে সেট করা থাকবে।

## Verification Plan

### Manual Verification
- আপনি `cookies.txt` ফাইলটি সেভ করার পর GitHub-এ পুশ করবেন।
- Render বিল্ড শেষ হলে অ্যাপে ইউটিউব লিঙ্ক দিয়ে চেক করবেন। এবার ইউটিউব আপনার সার্ভারকে আর "Bot" ভাববে না।

---

**আপনি কি ব্রাউজার থেকে কুকি ফাইলটি সংগ্রহ করতে পারবেন?** আমি কোড রেডি করে দিচ্ছি, ফাইলটি পাওয়ার পর আপনি জাস্ট ওটা রিপ্লেস করে দিলেই হবে।

**আমি কি কাজ শুরু করব?**
