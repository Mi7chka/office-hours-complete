# Week 7 build details · plan my day and the day page

Build the day plan as the file `week-7-day-plan.js`. The AI writes the plan in a chat. This page gathers the lists, gives it the prompt, and reads the answer. Nothing runs by itself.

**The data it reads from the other pieces**

- `"tasks"` (week 2): cards `{ title, lane, due, steps }` with steps `{ who, text, done }`. Waiting on you: the card is not in Done and its next step that is not done belongs to `"you"`.
- `"deals"` (week 4): deals `{ client, contact, what, stage, next_step, next_date, notes }`. To follow up today: the stage is not Won or Lost, and there is no next step, or no date, or the date is today or has passed.
- `"email"` (week 3): `short` is a list of `{ task, due, done }`. Take the ones not done.
- Any of these can be `null`. Then that list is not set up: say so on the page, and write `not set up. Leave it out.` under its heading in the prompt data. Never make a list up.

**The data it keeps**

- `"calendar"`: `{ date, events }` or `null`, where an event is `{ time, what }` and time looks like `"09:00"` or is empty. Use it only when its date is today.
- `"day"`: the plan, or `null`: `{ date, first, then, messages, left, unsure }`. `first` is `{ text, from, done }`. `then` is a list of `{ time, text, from, done }`. `messages` is a list of `{ to, subject, body }`. `left` and `unsure` are lists of sentences.
- It may write `"today"` (week 1): `{ date, first, firstDone, list }` where list holds `{ text, done }`.
- Already in the app: `OH.sample.cc.planPrompt` (the plan-my-day prompt), `OH.sample.cc.dayAnswer` (a sample answer) and `OH.sample.cc.calendarText` (sample events as text). `OH.runbookLines()` returns the runbook lines written so far: `{ week, piece, step, sign, undo }`.

**The answer the page reads**

```
DAY PLAN
FIRST | what to do | from: email
THEN | 10:00 | what to do | from: calendar
THEN | | what to do | from: pipeline
MESSAGES
MESSAGE | To: the name | Subject: the subject
the message, over one or more lines
END
LEFT OUT
- a sentence
UNSURE
- a sentence
```

**The page, top to bottom**

1. Four number tiles headed Board, Pipeline, Email and Calendar: the count of each list, or Needs setup, or Not built yet with its week.
2. If there is no plan: the Needs setup box, and the Plan my day section open. Otherwise the next five. If the plan's date is not today, a note says which day it is from.
3. A card with the classes `card first`, headed First, with the one thing first, a tick box and a label for the list it came from.
4. A card headed Then: each line with a tick box, its time in bold when it has one, the words, and a label for its list. A count such as `2 of 8 done`. A button Put this plan on the Today page, which saves `"today"` with the first thing and the next five lines.
5. A card headed Messages ready to copy, with a note that the page never sends. Each message shows who it is to, the subject, the text, and a button Copy the message.
6. A card headed Check it against your lists, with three parts. Left out, and it did not say so: every item on the four lists that shares fewer than two longer words with every line of the plan and every line it left out. Show the item and its list. Then Left out, and it said why: the plan's own list. Then What it was unsure about. Add one line that says this check compares words and can miss things.
7. A card headed End of the day: how many are done, and a button Write the wrap in the change log.
8. A section headed Plan my day, with three numbered parts. Today's calendar: one sentence that says if your Claude plan has the Google Calendar connector, Claude can read today's events itself and it only reads, and `OH.bringIn` for events pasted one per line with the time first, or a calendar file (.ics). The prompt and your lists: `OH.promptBox` with the plan-my-day prompt and the four lists as its data. Bring the plan back: `OH.bringIn` with the button Use this plan, and the sample answer in the sample business only. Bringing a plan in adds a change log line.
9. A card headed My runbook: a table of `OH.runbookLines()`, or one sentence that says where to write them.

**The home screen number**

- `summary()` returns `{ label: "Today's plan", value: "2 of 8 done", tone: "" }`, with tone `"ok"` when all are done.
- With a plan from another day: value `"Not written yet"`, tone `"warn"`. With no plan: value `"Needs setup"`, tone `"warn"`.

**Exact names**

- `piece: 7`, `id: "week-7-day-plan"`, `title: "The day plan"`, `data: ["day", "calendar"]`.
