# MOT Check UK, App Flow

তারিখ ৩০ অক্টোবর ২০২৬।

## ১. ঢোকার পথ

1. Google: free MOT history check, motorcycle MOT check।
2. Guide পাতা থেকে (`/guides/...`)।
3. Share করা link `/check/<reg>`।

## ২. Route তালিকা

| Route | কী |
|---|---|
| `/` | Checker |
| `/check/<reg>` | একটা registration এর share link (noindex) |
| `GET /api/mot?reg=` | JSON, rate limit |
| `/compare?a=&b=` | দুইটা গাড়ি পাশাপাশি |
| `/scorecard`, `/trade` | Buyer score, trader পাতা |
| `/reminders`, `/calendar/<reg>.ics` | MOT reminder |
| `/recalls`, `/ulez` | Recall, ULEZ |
| `/history-check` | Paid report পাতা, এখন vote |
| `GET /api/checkout` | Stripe Checkout তৈরি (payment চালু হলে) |
| `/report?session_id=` | Paid report |
| `/terms`, `/refunds` | শুধু payment চালু হলে, না হলে `/history-check` এ পাঠায় |
| `/privacy`, `/data-sources` | Legal আর source |
| `/guides`, `/guides/<slug>` | Guide, আলাদা container |
| `/healthz` | `ok`, cache সংখ্যা, এই PR এ commit |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | SEO আর PWA |

## ৩. Flow

### Free MOT check
1. Registration লেখে।
2. Browser `/api/mot` ডাকে, server DVSA token cache থেকে ডাকে, উত্তর cache করে।
3. `client.js` buyer report, chart, recall flag আঁকে।

### Paid report (চালু হলে)
1. `/history-check` এ registration আর consent box।
2. `/api/checkout` Stripe Checkout বানায়, metadata তে registration।
3. Card শুধু Stripe এর পাতায়।
4. ফেরে `/report?session_id=`। Server Stripe কে জিজ্ঞেস করে paid কিনা।
5. Paid হলে একবার supplier ডাকে, report আঁকে, memory তে রাখে, তাই refresh এ আবার খরচ হয় না।
6. Supplier না পেলে "Your report is delayed", টাকা গেছে কিন্তু report পরে, বা refund।
7. Plate এর পিছনে কোনো গাড়ি না থাকলে "No vehicle found", কখনো clear না।

## ৪. প্রতিটা screen এর অবস্থা

| Screen | Loading | খালি | Error | Offline |
|---|---|---|---|---|
| Checker | button এ wait | ভুল input এ বার্তা | DVSA না পেলে বার্তা | PWA shell |
| `/compare` | দুই দিকে wait | একটা খালি হলে বার্তা | DVSA error | PWA shell |
| `/report` | server রেন্ডার | গাড়ি নেই হলে no vehicle card | unpaid 402, supplier error হলে delayed পাতা | browser |
