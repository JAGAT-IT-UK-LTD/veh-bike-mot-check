# MOT Check UK, Product Requirements Document

তারিখ ৩০ অক্টোবর ২০২৬। মালিক Ruhul Amin। কোম্পানি JAGAT IT UK LTD (company number 17474995, ICO ZC257468)। Brand "MOT Check UK", কখনো "Bike MOT Check UK" না। Repo `JAGAT-IT-UK-LTD/veh-bike-mot-check` (default branch `main`, **public**), folder `~/ruhul-app-devo/bikemotcheck`। Live `https://bikemotcheckuk.cloud`। Domain বদলের প্রশ্ন বন্ধ, ৩১ আগস্ট ২০২৬ এ R এর সিদ্ধান্ত।

Repo public, তাই এখানে কোনো key, server ঠিকানা বা ব্যক্তিগত email লেখা হবে না।

একই HPI engine `veh-car-check` আর `veh-motorhome-check` এ চলে। তিনটার মালিক এক session।

## ১. পণ্য এক লাইনে

যেকোনো UK registration এর পুরো DVSA MOT ইতিহাস free: প্রতিটা test, mileage, advisory, failure, buyer report, mileage chart, recall flag। টাকা দিলে (এখন বন্ধ) finance, write off, stolen এর পুরো history report।

## ২. সমস্যা, কার জন্য, তাদের প্রধান ৩ কাজ

সমস্যা: সরকারের MOT পাতা শুধু তালিকা দেয়, mileage পিছনে যাওয়া বা বারবারের fault নিজে খুঁজতে হয়। Finance আর write off public data না।

কার জন্য:
1. Used car, van, motorcycle কিনছেন এমন মানুষ।
2. নিজের গাড়ির MOT তারিখ মনে রাখতে চান এমন মালিক।
3. ছোট trader, দুইটা গাড়ি পাশাপাশি তুলনা।

তাদের প্রধান ৩ কাজ:
1. MOT ইতিহাস আর mileage এক পাতায়, clocking এর সতর্কতা সহ।
2. দুইটা গাড়ি তুলনা (`/compare`), আর buyer score।
3. MOT এর তারিখের reminder (`.ics`)।

## ৩. প্রতিযোগী ৩টা, দাম আর link, আমাদের সুবিধা

দাম তৃতীয় পক্ষের পাতা থেকে, ৩০ অক্টোবর ২০২৬ এ পড়া, নিজের checkout এ যাচাই হয়নি।

| কে | কী দেয় | দাম | Link |
|---|---|---|---|
| Total Car Check | free MOT ইতিহাস car, van, motorcycle | free, paid upgrade আছে | https://totalcarcheck.co.uk/MOT-History-Check |
| VehicleScore | free MOT আর score, Hidden History upgrade | free, upgrade £12.95 থেকে £13.95 | https://vehiclescore.co.uk/pricing |
| cartaxcheck | free MOT আর mileage, full check | free, full £9.99 থেকে £10.99 | https://cartaxcheck.co.uk/pricing/ |

সরকারের নিজের free MOT পাতাও প্রতিযোগী।

আমাদের সুবিধা:
1. Buyer report নিজে বিশ্লেষণ করে: mileage পিছনে, বছরে গড় mileage, pass rate, বিপজ্জনক defect, বারবারের fault।
2. Motorcycle এর জন্য আলাদা benchmark (বছরে ৩,০০০ mile)।
3. কোনো signup নেই, registration রাখা হয় না।
4. Zero dependency server, খুব হালকা।

## ৪. MVP feature, পরের feature

Live:
1. `/`, `/check/<reg>`: MOT ইতিহাস, buyer report, mileage chart, recall flag।
2. `/compare`, `/scorecard`, `/trade`, `/reminders` (`.ics`), `/recalls`, `/ulez`।
3. `/guides`: ২০টা guide, আলাদা container (static nginx)।
4. `/history-check`: paid report এর পাতা, এখন register interest vote।
5. Legal: `/privacy`, `/data-sources`। `/terms` আর `/refunds` শুধু payment চালু হলে।

পরের feature:
1. Paid history check চালু (£3.99), PLAN M5।
2. তিনটা report এর pack £11.99।
3. Flutter app, paid order প্রমাণের পরে।

## ৫. আয়

| কী | দাম | অবস্থা |
|---|---|---|
| Single full history report | £3.99, ৩১ ডিসেম্বর ২০২৬ পর্যন্ত launch দাম, পরে £9.99 | কোড আছে, বন্ধ |
| তিনটা report এর pack | £11.99, পরে £24.99 | এখনো বানানো হয়নি |

Payment Stripe Checkout, `/history-check` পাতা থেকে `/api/checkout`। Payment চালু হয় শুধু যখন Stripe key, `HISTORY_API_KEY`, `HISTORY_ENDPOINT` সব আছে, আর live key হলে `ICO_NUMBER` ও (`PAY_ENABLED`)। Supplier One Auto, প্রায় £2.00 প্রতি report। Live key বসানো R এর colleague এর কাজ।

## ৬. SEO

প্রধান keyword: free MOT history check, MOT check by registration, motorcycle MOT history, mileage check, MOT reminder।

৮টা page: `/`, `/compare`, `/scorecard`, `/reminders`, `/recalls`, `/ulez`, `/history-check`, `/guides`। Sitemap দুইটা (main আর guides)।

## ৭. KPI

| কী | কোথা থেকে |
|---|---|
| Check প্রতিদিন | GA4 (history page_view বন্ধ, sanitized page view), server log |
| Paid intent vote | GA4 event `paid_check_intent` |
| Index আর search | Search Console |
| Paid order (চালু হলে) | Stripe dashboard |

## ৮. ঝুঁকি

1. আইন: "HPI" শব্দ আর supplier brand কোথাও না। পুরো VIN কখনো না, শুধু শেষ ৫ অক্ষর (supplier licence)।
2. Data: DVSA rate limit, token cache single flight।
3. ভুল তথ্য: গাড়িহীন plate কে পরিষ্কার গাড়ি বলা। Paid report এখন "No vehicle found" বলে, `test/history.test.js` প্রমাণ।
4. খরচ: paid report প্রতি supplier প্রায় £2, report একবারই কেনা হয় প্রতি Stripe session এ।
5. Repo public: secret বা server ঠিকানা কখনো commit না, gitleaks প্রতি ঘণ্টায় দেখে।
