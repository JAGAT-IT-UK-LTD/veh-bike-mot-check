# MOT Check UK, Schema

তারিখ ৩০ অক্টোবর ২০২৬।

## ১. Database নেই

এই site কোনো database রাখে না। সব কিছু memory তে, container restart এ মুছে যায়।

## ২. Memory তে যা থাকে

| কী | Key | মান | কতদিন |
|---|---|---|---|
| DVSA token | একটা | access token আর মেয়াদ | মেয়াদ শেষের ৫ মিনিট আগে নতুন |
| MOT result cache | পরিষ্কার registration | DVSA এর উত্তর | সীমিত সংখ্যা আর সময় |
| Rate limit bucket | IP | গণনা আর সময় | window শেষ হলে |
| Paid report | Stripe session id | আঁকা HTML | সর্বোচ্চ ৫০০টা, restart এ মুছে যায় |

## ৩. বাইরে যা থাকে

1. Stripe: payment, metadata তে registration।
2. Supplier: প্রতি paid report এর একটা lookup।
3. GA4: sanitized page view, registration ছাড়া।

## ৪. সম্পর্ক, index, migration

নেই। Paid report হারালে `/report` একই paid session এর জন্য আবার supplier ডাকে, যা একটা lookup এর খরচ। Order ধরে রাখার জন্য database দরকার হলে PLAN M5 এ SQLite volume।

## ৫. ব্যক্তিগত তথ্য

Registration রাখা হয় না, শুধু memory cache এ কিছুক্ষণ। Paid হলে Stripe এর কাছে email আর registration। Privacy পাতায় ICO ZC257468।
