# Week 2 build details · the board and the change log

Build the board and the change log as the file `week-2-board.js`. One piece, two tabs.

**The data**

- `"tasks"`: a list of cards, or `null`. A card is `{ id, title, lane, done_means, due, steps }`. `lane` is `"To do"`, `"Doing"` or `"Done"`. `due` is a date such as `"2026-10-14"` or empty. `steps` is a list of `{ who, text, done }`, where `who` is `"you"`, `"ai"` or empty for no owner.
- `"log"`: a list of change log lines, oldest first, or `null`. A line is `{ at, who, what, why, decision }`. Add a line with `OH.cc.log(what, why, who, decision)`.
- `OH.sample.cc.messyList` is a made-up to-do list as plain text, one task per line. Offer it as the sample for the bring-in box, in the sample business only.

**The page**

Use `OH.tabs("p2", ...)` with two tabs, Board and Change log. Show a count on each: open cards, and log lines.

Board tab, top to bottom:

1. If tasks is `null`: the Needs setup box. Otherwise the next two.
2. A card headed Waiting on you. A card is waiting on you when it is not in Done and its next step that is not done belongs to `"you"`. Show that step with a tick box, and the card title and due date under it. Ticking marks the step done. Under the list, a warning that names every card with a step that has no owner.
3. Three lanes side by side, using the classes `piles`, `pile` and `item`. Each card shows: the title; a line starting Done means; a due label (red when the date has passed, amber when it is today); a label Say what done means when that is empty; a red label No owner when a step has none; every step with a tick box and its owner (You or AI); for a step with no owner, a small select to choose You or The AI; and a select to move the card to another lane. Moving a card to Done adds a change log line that starts with Done and the title.
4. A section Add a card: the task, Done means, Due (a date input), and Steps as a text box with one step per line, each starting with `you:` or `ai:`. A button Add the card puts it in To do and adds a change log line.
5. A section Bring in my tasks, using `OH.bringIn`. It takes a sheet saved as CSV with the headings `title, lane, done means, due, steps`, where steps are written like `you: Call the agent | ai: Draft the note (done)`. It also takes a plain list with one task per line: each line becomes a card in To do with no done means and no steps. New cards are added to the ones already there. A button Save my tasks file saves `tasks.csv` in the same shape.

Change log tab:

1. A table, newest first: When, Who, What, Why. A decision gets a label Decision.
2. A section Add a line: What changed, Why, Who (You or The AI), a tick box to mark a decision, and a button Add to the change log.
3. A button Save my change log file that saves `change-log.md`.

**The home screen number**

- `summary()` returns `{ label: "Waiting on you", value: "4 cards", tone: "warn" }`, with tone `"ok"` when the count is zero.
- With no tasks: `{ label: "Waiting on you", value: "Needs setup", tone: "warn" }`.

**Exact names**

- `piece: 2`, `id: "week-2-board"`, `title: "The board"`, `data: ["tasks", "log"]`.
