# Week 5 build details · website inquiries and the website tab

Build the website piece as the file `week-5-website.js`. One piece, two tabs. Everything comes in by hand: no form is connected, and nothing is fetched.

**The data**

- `"deals"`: the pipeline from week 4, a list or `null`. A deal is `{ id, client, contact, email, phone, what, stage, next_step, next_date, last_touch, source, notes }`. This piece adds deals to it.
- `"inquiries"`: `{ last, held, pending }` or `null`. `pending` is a checked file that is not added yet: `{ file, rows }`. `last` is the last import: `{ at, file, read, added, dupes, held, before, after }`. `held` is the list of rows held back.
- `"site"`: `{ page, test, search }` or `null`. `test` is `{ what, where, next, note, date }` where the three answers are `"yes"`, `"no"` or empty. `search` is a list of `{ month, clicks, impressions }` with months like `"2026-10"`.
- `OH.sample.cc.formExport` is a made-up form export as CSV text. Offer it as the sample for the bring-in box, in the sample business only.

**Checking a form export**

- Read it with `OH.rows(text)`. Find the columns by what their headings contain: name, email, phone, message, page, and submitted or date.
- Give every row one of three outcomes. Held back: it has no email and no phone. Duplicate: its email or its phone matches a deal in the pipeline, or matches an earlier row in the same file. Compare emails without caring about capitals, and phones by their digits. Add: everything else.
- Rows in the file must equal add plus duplicates plus held back. Show that sum in words.

**The page**

Use `OH.tabs("p5", ...)` with two tabs, Inquiries and Website.

Inquiries tab, top to bottom:

1. If inquiries is `null`: the Needs setup box.
2. `OH.bringIn` labelled The form export from your website, with the button Check this file. Checking adds nothing. It saves the result as `pending`.
3. When there is a pending file: a card with the classes `card first`, headed Checked, and nothing added yet. Four number tiles: Rows in the file, To add, Duplicates, Held back. One sentence with the sum, such as `5 plus 2 plus 1 is 8`. A table of every row with its outcome and the reason. A button `Add 5 to the pipeline` with the real count, and a button Not now.
4. Adding puts each good row in `"deals"` as a deal in stage New, with the next step Reply to the website inquiry, the next date today, and a source that starts with `Website form` followed by the page. It records `last`, keeps the held rows in `held`, clears `pending`, and adds a change log line.
5. When there is a last import: a card headed The last import: before and after, with In the file, Added, Pipeline before, Pipeline after, and one sentence that explains the gap.
6. When rows are held back: a card headed Held back: these need you, listing them.
7. A card headed Where leads came from: bars with one bar per source, counted from all deals. Group a source by the words before its colon.

Website tab:

1. A card headed The three-second test: the page tested, three selects (Does the top of the page say what you do? Does it say where you work? Does it say what to do next?), a text box for what you saw, a score such as `2 of 3`, and a button Save the test, which stamps today's date.
2. A card headed Search numbers: bars of clicks by month and a table with Month, Clicks and Times shown. In the sample business, a label says the numbers are made up. In My business, a label says they are measured, typed in or imported by you. With no numbers: the Needs setup box, and no chart. Under it, a way to type one month in, and `OH.bringIn` for an export with the headings Date, Clicks and Impressions, where days are added up into months.

**The home screen number**

- `summary()` returns `{ label: "Leads from the website", value: 3, tone: "" }`: the deals whose source starts with Website.
- With no deals and no inquiries: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 5`, `id: "week-5-website"`, `title: "Website inquiries"`, `data: ["inquiries", "site"]`.
