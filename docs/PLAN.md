# MOT Check UK, Plan

তারিখ ৩০ অক্টোবর ২০২৬। প্রতিটা milestone একটা PR।

## M1. Six docs

Acceptance: `docs/` এ ছয়টা আর SPEC, `main` এ merge।
R এর phone check: `JAGAT-IT-UK-LTD/veh-bike-mot-check/blob/main/docs/SPEC.md`।

## M2. Main checker image pipeline

নির্ভরতা: M1।
কাজ: `Dockerfile` (main checker, node:20-alpine, `BUILD_COMMIT`), `docker-compose.web.yml` (image only, project আর container নাম `bikemotcheck`, 256m cap), `.github/workflows/image-web.yml` (test, build, smoke, push, ship শুধু dispatch এ), `/healthz` এ commit। Public repo থেকে server ঠিকানা সরানো।
Acceptance: PR এ smoke সবুজ।

## M3. Main checker image deploy

নির্ভরতা: M2, box এ `build-gate.sh` pass।
কাজ: box এ `/root/bikemotcheck` তৈরি, hPanel compose এর env একই নামে `.env` এ (মান না দেখে), hPanel compose এর backup। `image-web` dispatch।
Acceptance: `https://bikemotcheckuk.cloud/healthz` এ নতুন commit, home 200, একটা free check কাজ করে, `/guides` বদলায়নি। 375 আর 1280 screenshot।
Rollback: `/docker/bikemotcheck` এর পুরানো compose দিয়ে `docker compose up -d`।
এর পরে hPanel এর Deploy button কেউ চাপবে না।

## M4. Stripe flow প্রমাণ

নির্ভরতা: M2।
কাজ: localhost এ Stripe test key, supplier এর জায়গায় local fixture server, card 4242: checkout, `/report` এ fixture report।
Acceptance: test session paid, report আঁকা, supplier এ কোনো আসল call না।

## M5. Paid history চালু

নির্ভরতা: M3, M4, ICO নম্বর env এ। টাকার ধাপ, R এর হ্যাঁ।
কাজ: `HISTORY_API_KEY`, `HISTORY_ENDPOINT`, Stripe live key (R এর colleague)। Paid order রাখার জন্য ছোট SQLite।
Acceptance: `/history-check` এ buy form, `/terms` আর `/refunds` 200।

## M6. Design `/preview/glass`, তারপর live

Acceptance: preview এ 375 আর 1280 screenshot, R এর হ্যাঁ, তারপর live।

## M7. Flutter app

নির্ভরতা: প্রথম paid order। Skill `app-from-web`। Store readiness scorer pass।
