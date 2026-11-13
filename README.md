# United Porte Academy

Training course for new United Porte team members: 14 modules, graded quizzes, a midpoint test and a final test.

- **Live site:** GitHub Pages serves `index.html` from this repository.
- **Grade book:** a Google Sheet stores everyone's progress and results. Trainees sign in with their email and a 6-digit code, on any device.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole website. Built from `src/`. |
| `apps-script/Code.gs` | The Google Sheet script that handles sign-in and saving. |
| `src/` | Source: `base.html` (styles, logo, Modules 1–4), `m5_8.js`, `m9_14.js`, `tests.js`, `framework.js`. Run `python3 src/build.py` to rebuild `index.html`. |

## Set up the grade book (one time, about 10 minutes)

1. Go to **sheets.new** and name the sheet, for example **UP Academy grades**. Use the Google account that should send the sign-in codes; a work account is best.
2. Click **Extensions → Apps Script**. Delete everything in `Code.gs`, then paste in the contents of `apps-script/Code.gs` from this repository.
3. At the top of the script, set:
   - `NOTIFY_EMAIL`: your email, to get an email for every quiz and test result. Leave `''` for no emails.
   - `ALLOWED_DOMAIN`: for example `'unitedporte.us'` to allow only company emails. Leave `''` to allow any email.
4. Click **Save**. In the function menu at the top, choose **setupSheet** and click **Run**. Google asks for permission: choose your account → **Advanced** → **Go to (project name)** → **Allow**. This creates the tabs and allows the script to send emails.
5. Click **Deploy → New deployment**. Click the gear and choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. In `index.html` (and `src/framework.js`), put that URL in `apiUrl: ""` near the top.

**After changing the script later:** Deploy → Manage deployments → pencil icon → Version: **New version** → Deploy. The URL stays the same.

### What the sheet shows

- **Trainees:** one row per person, with name, showroom, modules done, quiz average, midpoint, final and last active. Don't edit the Data column.
- **Results:** one row for every quiz or test attempt, with score, grade, pass or fail, and the missed questions.
- **Codes** and **Sessions** are hidden working tabs. Leave them alone.

Free Google accounts can send about 100 emails a day. That covers sign-in codes and result emails for a small team.

## Shared computers

Each person needs an email code only the first time they use a computer or browser. After that, the start page shows **Who's training?** with everyone who has used that computer; they tap their name to continue. **Switch trainee** at the top goes back to the list. The site also goes back to the list on its own after 30 minutes with no activity. Grades always save to each person's own record.

## Turn on the website (one time)

Go to repository **Settings → Pages** → **Deploy from a branch** → **main** / **(root)** → **Save**. The site appears at `https://dreitel.github.io/UPAcademy/` within a couple of minutes.

## Settings in `index.html`

| Setting | Meaning |
|---|---|
| `apiUrl` | Google Sheet web app URL. Empty = progress saved only in each browser, with results emailed through FormSubmit. |
| `resultsEmail` | Used only when `apiUrl` is empty. |
| `passMark` | Percent needed to pass (default 80). |
| `lockTests` | `true`: the midpoint opens after Modules 1–8, and the final after everything. |

## Privacy

GitHub Pages sites are public: anyone with the link can read the course. Grades are stored only in your Google Sheet. Trainees need a code from their own inbox to sign in.
