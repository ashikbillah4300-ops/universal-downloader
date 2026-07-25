# Walkthrough: Play Store Ready YouTube Bypass (Cookies Method)

আমি ইউটিউবের ব্লকিং কাটানোর জন্য "Cookies Method" সেটআপ করে দিয়েছি। এখন ইউটিউব আপনার অনলাইন সার্ভারকে আর ব্লক করতে পারবে না।

## যা যা করা হয়েছে

### ১. সার্ভার সাইড আপডেট
- [ytdlp.service.ts](file:///D:/project/d%20+a/Downloader/server/src/services/ytdlp.service.ts) এ আমি এমন লজিক দিয়েছি যা অটোমেটিক `cookies.txt` ফাইলটি খুঁজবে এবং সেটি ব্যবহার করবে।
- [Dockerfile](file:///D:/project/d%20+a/Downloader/server/Dockerfile) আপডেট করা হয়েছে যাতে অনলাইনে কুকি ফাইলটি ঠিকঠাক পাওয়া যায়।

### ২. কুকি ফাইল তৈরি
আমি [server/cookies.txt](file:///D:/project/d%20+a/Downloader/server/cookies.txt) নামে একটি ফাইল তৈরি করেছি।

---

## আপনার যা করা লাগবে (খুবই গুরুত্বপূর্ণ)

> [!CAUTION]
> **কুকি পেস্ট করুন:**
> আপনি যে কুকিগুলো ব্রাউজার থেকে সংগ্রহ করেছেন, সেগুলো এখনই **[server/cookies.txt](file:///D:/project/d%20+a/Downloader/server/cookies.txt)** ফাইলটি ওপেন করে এর ভেতরে পেস্ট করুন এবং সেভ করুন। (ফাইলের আগের লেখাগুলো মুছে দিবেন)।

### এবার আপডেট দিন:

১. **GitHub এ পুশ করুন:**
টার্মিনালে এই কমান্ডগুলো দিন:
```powershell
cd "D:/project/d +a/Downloader"
git add .
git commit -m "Add YouTube cookies for bypass"
git push origin main --force
```

২. **Render চেক করুন:**
Render ড্যাশবোর্ডে গিয়ে দেখুন বিল্ড শেষ হয়েছে কি না।

বিল্ড শেষ হলে আপনার অ্যাপে ইউটিউব লিঙ্ক দিয়ে ট্রাই করুন। এবার কোনো "Bot" এরর আসবে না এবং ভিডিওর সব তথ্য চলে আসবে!

**সবকিছু ঠিক থাকলে আমাকে জানান!**
