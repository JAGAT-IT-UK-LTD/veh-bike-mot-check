# MOT Check UK, Technical Requirements Document

তারিখ ৩০ অক্টোবর ২০২৬। Repo `JAGAT-IT-UK-LTD/veh-bike-mot-check` (public), branch `main`।

## ১. Stack আর কেন

1. Node 20, **কোনো dependency নেই**। `server.js` (HTTP server, DVSA OAuth token cache, result cache, rate limit, HTML), `client.js` (browser এর সব code, `/app.js`), `assets.b64` (icon আর ছবি)।
2. `/guides` আলাদা: `guides.js` build সময়ে static পাতা বানায়, nginx:alpine serve করে (`Dockerfile.guides`)।
3. Database নেই। Cache memory তে। Paid report memory তে Stripe session id ধরে।

কেন: সবচেয়ে হালকা, ছোট memory, কোনো package update ঝুঁকি নেই। Master নেই, এটা নিজেই আলাদা ধাঁচ। HPI engine এর guard `veh-car-check` এর `src/history/ADAPTER.md` থেকে হাতে আনা।

## ২. Service আর বাইরের API

| Service | কাজ | প্রতি call এ টাকা | কোথায় |
|---|---|---|---|
| DVSA MOT History API | MOT ইতিহাস, recall flag | না | `server.js`, OAuth client credentials |
| One Auto (বা যেকোনো supplier, `HISTORY_ENDPOINT`) | finance, write off, stolen | হ্যাঁ, প্রায় £2.00 | `fetchHistory` in `server.js` |
| Stripe | payment, raw REST, SDK নেই | হ্যাঁ | `stripeReq` in `server.js` |
| GA4 | traffic | না | page এ |

Paid supplier শুধু `/report` এ ডাকা হয়, Stripe নিশ্চিত করার পরে যে session paid। Free পাতা কখনো ডাকে না। Test `test/history.test.js` recorded fixture পড়ে, কোনো network call না।

## ৩. Hosting

1. uk-vps, Traefik, label দিয়ে route।
2. Main checker: আজ hPanel Docker Manager এর compose (`/docker/bikemotcheck`), `node:20-alpine` container চালুর সময় GitHub থেকে pinned SHA এর raw file নামায়। এই PR এর পরে: GitHub এ image build (`.github/workflows/image-web.yml`), `ghcr.io/jagat-it-uk-ltd/veh-bike-mot-check:<sha>`, ssh দিয়ে box এ, `/root/bikemotcheck/docker-compose.web.yml`।
3. Guides: `/root/motguides`, image `veh-bike-mot-check-guides`, workflow `image.yml`, ২৯ অক্টোবর থেকে image path এ live।
4. VPS এ কখনো build না।
5. Compose project নাম `bikemotcheck` আর container নাম `bikemotcheck` একই থাকে, তাই network আর route বদলায় না। Memory cap 256m, box এর ২৯ অক্টোবরের memcap এর সাথে মিল রেখে।

## ৪. Env, শুধু নাম

`PORT`, `DVSA_CLIENT_ID`, `DVSA_CLIENT_SECRET`, `DVSA_API_KEY`, `DVSA_TOKEN_URL`, `DVSA_SCOPE`, `STRIPE_SECRET_KEY`, `HISTORY_API_KEY`, `HISTORY_ENDPOINT`, `HISTORY_KEY_HEADER`, `ICO_NUMBER`, `IMAGE_TAG` (box), `BUILD_COMMIT` (image)।

## ৫. Constraint

1. uk-vps 2 vCPU, 8 GB, প্রায় ৮০ container, এক সময়ে এক deploy।
2. hPanel এর Deploy button আর চাপা যাবে না একবার image path এ গেলে, কারণ ওটা পুরানো compose ফেরত আনবে।
3. Mac থেকে image পাঠানো নিষেধ, pipeline একমাত্র পথ।

## ৬. নিরাপত্তা

1. Secret শুধু box এ। Public repo, gitleaks প্রতি ঘণ্টায়।
2. Rate limit IP প্রতি, বিশ্বস্ত proxy hop গোনা।
3. Registration পরিষ্কার করা (`cleanReg`), ১২ অক্ষর পর্যন্ত।
4. Paid report: Stripe session `cs_` ছাড়া 400, paid না হলে 402। পুরো VIN আর raw response কখনো না (`REDACT`)।
5. ICS এ newline আর separator escape।

## ৭. Performance budget

1. LCP phone এ ২ সেকেন্ডের নিচে, JS একটা ফাইল প্রায় 36 kB।
2. gzip চালু, ছবি SVG বা ছোট PNG।
3. DVSA উত্তর cache করা।

## ৮. আইন

ICO ZC257468, privacy পাতায় (payment চালু হলে আরো অংশ)। Terms আর refunds শুধু payment চালু হলে। Footer এ trading name আর company number। Supplier brand না। Consent box: report সঙ্গে সঙ্গে দেওয়া আর cancel এর অধিকার হারানো।
