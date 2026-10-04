# Week 4 build details · the pipeline

Build the pipeline as the file `week-4-pipeline.js`. One piece, three tabs.

**The data**

- `"deals"`: a list of deals, or `null`. A deal is `{ id, client, contact, email, phone, what, stage, next_step, next_date, last_touch, source, notes }`. `stage` is `"New"`, `"Site visit"`, `"Quoted"`, `"Won"` or `"Lost"`. Dates look like `"2026-10-28"` or are empty.
- `OH.sample.cc.templates` is a list of three message templates, already in the app: `{ id, name, text }`. The text holds `{first}`, `{what}`, `{owner}` and `{business}`. Fill them from the deal and from `OH.cc.biz()`.
- There are no prices and no deal values anywhere.

**Where a deal stands**

- Won and Lost are closed. A closed deal is never marked.
- An open deal needs you when it has no next step, or no date, or its date is today or has passed. Label it No next step, No date, Due today, or the number of days late.
- The follow-up list is every deal that needs you, the latest first.

**The page**

If deals is `null`: the Needs setup box, then the Add a deal and Bring in my deals sections, and nothing else. Otherwise use `OH.tabs("p4", ...)` with three tabs, each with a count.

Follow-ups tab:

1. A note: drafts only, the page never sends.
2. One card per deal that needs you: the client, its label, how many days since the last contact, the stage, what they want, the next step that was planned, and the notes in full.
3. On each card: a select to choose one of the three templates, the filled-in draft, and a button Copy the draft.
4. On each card: two inputs, the next step and its date, and a button Save the next step. Saving needs both. It also sets the last contact to today and adds a change log line. The deal then leaves the list.
5. A section Ask an AI to draft from the notes, with `OH.promptBox`. The prompt says: use only what is in the notes, no price, no promised date, and write a phone script when the notes say the person prefers a call. The data is the deals that need you, with their notes.

Board tab: five columns using the classes `piles`, `pile` and `item`. Each card shows the client, what they want, the next step, its label, the source, and a select to move it to another stage. Moving a deal to Won or Lost adds a change log line.

Clients and deals tab: a table with Client, What they want, Stage, Next step, Date, Last contact, Source. Rows that need you get the row class `hot`. Under it, a section Add a deal (client, contact, what they want, source, next step, date) and a section Bring in my deals using `OH.bringIn`, for a sheet saved as CSV with the headings `client, contact, email, phone, what, stage, next step, next date, last contact, source, notes`. New deals are added to the ones already there. A button Save my deals file saves `deals.csv` in the same shape.

**The home screen number**

- `summary()` returns `{ label: "Deals to follow up today", value: 4, tone: "warn" }`, with tone `"ok"` at zero.
- With no deals: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 4`, `id: "week-4-pipeline"`, `title: "The pipeline"`, `data: ["deals"]`.
