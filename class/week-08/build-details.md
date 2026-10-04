# Week 8 build details · keep it running

Build the last piece as the file `week-8-keep-running.js`. One piece, four tabs: Summary, Knowledge, Backup, Roadmap.

**The data it reads from the other pieces, to count the measured numbers**

- `"tasks"` (cards with `lane` and `steps` of `{ who, text, done }`), `"deals"` (with `stage`, `next_step`, `next_date`, `source`), `"email"` (with `short`, a list of `{ done }`), `"posts"` (with `status`), `"log"` (a list). Any of them can be `null`.

**The data it keeps**

- `"numbers"`: the numbers the owner typed, a list or `null`. Each is `{ id, kind, label, value, how }` with `kind` `"estimated"` or `"projected"`.
- `"knowledge"`: `{ voice, facts, services }` or `null`.
- `"backup"`: `{ last, restored, copies }` or `null`. `last` and `restored` are dates or empty. `copies` is `{ computer, drive, away }`, three ticks.
- `"roadmap"`: a list or `null`. A line is `{ id, days, how, done, what }` with `days` 30, 60 or 90 and `how` `"build"` or `"hire"`.
- For the backup file: `OH.store.all()` returns everything the app keeps in this browser as one object, and `OH.store.putAll(object)` writes it back.

**The page**

Use `OH.tabs("p8", ...)` with four tabs.

Summary tab:

1. A note: every number says what it is, and measured, estimated and projected are never added together.
2. Three cards, headed Measured, Estimated and Projected, each with a label of its kind and one line that says what the kind means. No total anywhere.
3. Measured: eight number tiles counted now from the other pieces: Cards waiting on you, Open cards, Open deals, Deals to follow up today, Leads from the website, Emails on the short list, Posts posted, Lines in the change log. Under each: Measured: counted from, and the piece it came from, and today. When that piece has no data, the tile says Needs setup, never a number.
4. Estimated and Projected: the owner's own numbers of that kind. Each tile shows the label, the value, the kind and how it was made, and a small select to mark it as the other kind.
5. A section Add a number of your own: the number, its value, what kind, and how you got it. All are needed.

Knowledge tab: with no knowledge, the Needs setup box. Three text boxes side by side: Your voice, Your facts, Your services. Buttons: Save the knowledge page (adds a change log line), Copy it for a prompt, Save it as a file (`knowledge.md`, with the headings Voice, Facts, Services). A section Bring in a knowledge file using `OH.bringIn`, which reads those three headings.

Backup tab:

1. Three number tiles: Last backup (Never, Today, or days ago), Copies in place (out of 3), Restored on purpose (the date, or Not yet).
2. A card headed 1. Save a backup file. The button saves a file named `command-center-backup-` and today's date, ending `.json`, holding `{ app: "office-hours-command-center", made, keys: OH.store.all() }`. It sets `last` to today and adds a change log line.
3. A card headed 2. Three copies, two places, one away from the computer, with three tick boxes.
4. A card headed 3. Restore one file on purpose. `OH.bringIn` with the button Look inside this file. Choosing or pasting a file shows its name, the day it was made and what it holds, and puts nothing back yet. Then a button Put this backup back, which asks first, writes the entries with `OH.store.putAll`, sets `restored` to today and adds a change log line, and a button Not now. A file that is not a command center backup is refused with a short message.

Roadmap tab: a note with the human-only rule: send, pay and post are always your steps. Three columns using the classes `piles`, `pile` and `item`: the next 30, 60 and 90 days. Each line has a tick box, a label Build next or Hire out, and a select to change it. Changing it adds a change log line marked as a decision. A section Add a line to the roadmap: what, when, build or hire.

**The home screen number**

- `summary()` returns `{ label: "Last backup", value: "9 days ago", tone: "warn" }`: tone `"ok"` within 7 days, `"warn"` after.
- With no backup ever: value `"Never"`, tone `"bad"`.

**Exact names**

- `piece: 8`, `id: "week-8-keep-running"`, `title: "Keep it running"`, `data: ["numbers", "knowledge", "backup", "roadmap"]`.
