# DeSave: тестова PWA

Дані кожного тестувальника зберігаються лише на його телефоні. Анонімна статистика йде в PostHog.

## Що в папці

| Файл | Навіщо |
|---|---|
| `index.html` | Увесь застосунок. Угорі є блок `CM_CONFIG` з налаштуваннями |
| `manifest.webmanifest` | Назва, іконки й кольори для встановлення на головний екран |
| `sw.js` | Service worker: застосунок відкривається без інтернету, а HTML завжди оновлюється, коли інтернет є |
| `icons/` | Іконки 192, 512, maskable, apple-touch, favicon |
| `privacy.html` | Сторінка конфіденційності (PL / UA / EN), на неї веде посилання з профілю |
| `vercel.json` | Заголовки для `sw.js` і маніфесту |

## 1. PostHog (5 хв)

1. Зареєструйся на posthog.com і вибери **EU Cloud**.
2. Створи проєкт «DeSave».
3. Відкрий Project settings і скопіюй **Project API key** (починається з `phc_`).
4. У тих самих налаштуваннях увімкни **Discard client IP data**, щоб не зберігати IP-адреси.
5. Відкрий `index.html` і встав ключ у поле `posthogKey`:

```js
window.CM_CONFIG = {
  posthogKey: "phc_...",
  posthogHost: "https://eu.i.posthog.com",
  feedbackUrl: "https://t.me/deleniv",   // або посилання на групу тестерів
  privacyUrl: "/privacy.html"
};
```

Поки `posthogKey` порожній, статистика вимкнена, а застосунок працює як звичайно.

## 2. Vercel (5 хв)

**Найпростіше, без Git:**

```bash
npm i -g vercel
cd co-miesiac-pwa
vercel          # перший раз: логін і створення проєкту
vercel --prod   # опублікувати
```

**Через GitHub:** заллий папку в репозиторій, у Vercel натисни Add New → Project і вибери репозиторій. Framework: **Other**, build command порожній.

**Свій домен:** у Vercel відкрий Settings → Domains, додай, наприклад, `app.deweb.studio` і створи CNAME на `cname.vercel-dns.com` у DNS свого домену.

**Після кожної зміни:** зроби `vercel --prod`. Якщо змінювались іконки чи маніфест, онови `VERSION` у `sw.js` (`cm-v1` → `cm-v2`).

## 3. Як роздати тестерам

Надішли посилання з короткою інструкцією:

> Відкрий на телефоні: Safari на iPhone, Chrome на Android. Пройди вступ, а коли застосунок запропонує, додай його на головний екран. Користуйся 2 тижні: додай свої платежі і раз на кілька днів заходь. Пиши все, що незрозуміло, через «Написати відгук» у профілі.

На iPhone встановлення на головний екран важливе: якщо 7 днів не відкривати сайт у Safari, браузер може стерти його дані. На встановлений застосунок це правило не діє.

## 4. Які події збираються

| Подія | Коли | Властивості |
|---|---|---|
| `app_opened` | кожен запуск | standalone, platform, onboarded, items, expenses, demo |
| `$pageview` / `$pageleave` | автоматично | — |
| `language_chosen` | вибір мови у вступі | lang |
| `onboarding_step` | перехід на екран вступу | step (1–3) |
| `onboarding_skipped` | «Пропустити» | from |
| `onboarding_completed` | «Почати» | choice (demo / empty), has_name |
| `install_prompt_shown` | показано екран «Додайте на головний екран» | platform, native, source |
| `install_choice` / `install_later` / `app_installed` | реакція на встановлення | outcome, platform |
| `payment_added` | новий платіж | category, cycle, preset, currency, count |
| `expense_added` | нова витрата | category, count |
| `marked_paid` | «Оплачено» | category |
| `usage_answer` | відповідь «Користуєтесь підпискою?» | answer (yes / no), category, preset |
| `demo_cleared` | очищено приклад | — |
| `partner_added` | додано людину в родину | members |
| `tab_viewed` | перехід між вкладками | tab |
| `profile_opened`, `feedback_opened` | профіль, відгук | — |
| `analytics_on` / `analytics_off` | перемикач у профілі | — |

Суми, назви платежів, ім'я та фото **ніколи** не надсилаються. Autocapture і запис сесій вимкнені.

## 5. Що подивитись у PostHog

Створи дашборд із 4 графіків:

1. **Скільки людей:** Trends → `app_opened`, Unique users, по днях.
2. **Воронка вступу:** Funnels → `app_opened` → `onboarding_step` (step = 1) → `onboarding_completed` → `payment_added`. Показує, де люди відпадають.
3. **Чи повертаються:** Retention → перша подія `onboarding_completed`, повторна `app_opened`, по днях. Головна метрика тесту: скільки людей відкривають застосунок на 7-й і 14-й день.
4. **Чи вводять свої дані:** Trends → `payment_added`, з розбивкою за `preset` і `category`, плюс `demo_cleared`.

Додатково: розбивка `usage_answer` за `answer`, щоб побачити, чи працює питання про підписки.

## 6. Обмеження цього етапу

- Дані живуть на одному пристрої: немає синхронізації і спільного списку з партнером між телефонами. Це етап 2 (Supabase + вхід).
- Нагадування поки лише всередині застосунку, без пуш-сповіщень. Пуші в PWA працюють на Android, а на iPhone лише у встановленому застосунку (iOS 16.4+). Їх можна додати разом із Supabase.
- Premium у профілі — це демо-перемикач, без оплати.
