# Week 3 build prompt · The email short list

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-3-email.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-3-email.js` for you.

---

## Role

You are a careful web developer helping a small business owner who is not technical. You build one small piece at a time. You keep to the design note, and you say plainly what you were unsure about.

## Context

If you can read the files in my project folder, read `MODULES.md` first. If you cannot, everything you need is here.

**The app and how a piece fits in**

- The app is plain HTML, CSS and JavaScript. It opens with a double-click as a `file://` page. There is no server and no internet.
- A piece is ONE JavaScript file. No import, no export, no fetch, no outside script, font or picture. No new libraries.
- The app loads the file by itself when it sits in the `pieces` folder with the right name. Change no other file.
- The whole file is one function that runs at once and ends by registering the piece, in this shape:

```js
(function () {
  const h = OH.h;
  function render(root, ctx) { /* build the page into root. Call ctx.redraw() after a tick, a button press or a choice in a list. Never from a text input. */ }
  OH.register({
    piece: 3,
    id: "week-3-email",
    title: "The page heading",
    intro: "One sentence under the heading.",
    data: ["the data names this piece keeps"],
    render: render,
    summary: function () { return { label: "A few words", value: "3", tone: "warn" }; }
  });
})();
```

`root` is empty each time. The app draws the title, the intro and the Sample business / My business switch above it. Do not draw a heading.

**The toolbox the app gives you. Use it, do not write your own.**

- `OH.h(tag, attrs, ...children)` makes a page element. `attrs` can hold `class`, `style`, `value`, `checked`, `placeholder`, `type`, and handlers such as `onclick` or `onchange`. `style` is text such as `"font-weight:700"`, not an object. Children are text, elements, lists, or null.
- `OH.cc.get(name)` reads data. `OH.cc.set(name, value)` keeps it in this browser. `OH.cc.own()` is true when the person looks at their own business, and false for the sample business.
- In the sample business, `OH.cc.get(name)` returns made-up sample data that is already in the app. In My business it returns `null` until the person brings their own data in. When it is `null`, show `OH.cc.setup(sentence, [steps])`, which returns the box headed Needs setup. Add it to the page like any other element. Never show a made-up number in its place.
- `OH.cc.biz()` gives `{ name, owner, town }` for the business on screen. `OH.cc.log(what, why)` adds a line to the change log.
- `OH.step(title, ...children)` a numbered section. `OH.card(title, ...children)` a card. `OH.note(text, tone)` a note. `OH.badge(text, tone)` a small label. `OH.stat(label, value, detail, tone)` a number tile. Tones: `"ok"`, `"warn"`, `"bad"`, `"blue"`.
- `OH.check(text, done, onChange, extra)` one line with a tick box. `onChange(ticked)` gets true or false, not an event. `OH.field(label, inputElement, hint)` a labelled input.
- `OH.table(columns, rows, options)` a table. `columns`: `[{ h: "Heading", f: (row) => cell }]`. `options`: `{ empty: "words for no rows", rowClass: (row) => "hot" or "done" }`.
- `OH.tabs(key, [{ id, label, count, render: (panel) => {} }])` tabs inside the piece. It remembers the open tab.
- `OH.bringIn({ label, hint, placeholder, sample, useLabel, onText: (text, fileName) => {} })` the way to bring data in with no connector: choose a file, drop a file, or paste text. `sample` is optional text for a Load the sample file button.
- `OH.promptBox({ prompt, data, dataLabel })` returns `{ el }`: a prompt the person copies into an AI chat. `OH.pasteBox({ label, sample, onUse: (text) => {} })` is where the AI's answer comes back.
- `OH.rows(text)` turns CSV text into a list of objects, keyed by the header row in lower case. `OH.toCSV(rows)` makes CSV text from a list of lists: the first inner list is the headings and each one after it is one row of cells, such as `[["title", "lane"], ["Order mulch", "Doing"]]`. It does not take the objects that `OH.rows` gives back. `OH.download(fileName, text)` saves a file. `OH.copy(text, "What was copied")` copies. `OH.toast(message)` shows a short message.
- `OH.today()` is today as `"2026-10-07"`. `OH.day(n)` is today plus n days. `OH.daysBetween(from, to)` counts days. `OH.niceDate(date)` reads like `Wed, Oct 7`.
- CSS classes already there: `steps` (put the whole page inside one `div` with this class: it spaces the cards apart and numbers each `OH.step` 1, 2, 3), `grid g2 g3 g4`, `row`, `spacer`, `card`, `mut` (grey text), `piles` with `pile` and `item` (columns of cards), `first` (a card with a blue edge; a `div` with the class `big` inside it holds large text), and buttons `primary` and `small`.

**Rules for the page**

- Words on the page are plain and short. No em dashes. No hype words. No dollar amounts.
- The page never sends, posts, pays or deletes. It can copy text and save a file to the computer, nothing more.
- Keep what the person types with `OH.cc.set`, so it is still there after a refresh.
- It works with the keyboard, and at the width of a phone (390 wide) with no sideways scroll.

## The design note

**Who uses it.** Jordan Reyes, twice a day: before the crew leaves, and again after lunch.

**The one question it answers.** Which emails need me, and what do I say?

**What is on it.**

- Four numbers at the top: emails reviewed, on the short list, drafts to check, looks fake.
- The short list: only the things Jordan must do, each with a tick box.
- The reply drafts, each with a Copy button and a tick box for I checked it.
- Every email, sorted into four piles: Reply today, Can wait, FYI, Junk. An email can be moved to another pile.
- What the AI was unsure about, in its own words.
- The review prompt, and a place to bring the answer back: paste it, or drop the saved file.

**What done means.**

- The page never sends. It only copies a draft.
- Moving an email into Reply today adds it to the short list.
- An email that looks fake is marked, in the pile it is in.
- With my own business and no review yet, it says Needs setup and shows no numbers.

## What to build

Build the email short list as the file `week-3-email.js`. The AI runs the inbox review in a chat. This page gives it the prompt and reads the answer.

**The data**

- `"email"`: the last review, or `null`. Its shape: `{ at, emails, short, drafts, fake, unsure }`.
- `emails` is a list of `{ n, pile, from, subject, why }`. `pile` is `"REPLY TODAY"`, `"CAN WAIT"`, `"FYI"` or `"JUNK"`. Show them as Reply today, Can wait, FYI and Junk.
- `short` is a list of `{ n, task, due, done }`. `drafts` is a list of `{ n, to, subject, body, checked }`. `fake` is a list of `{ n, why }`. `unsure` is a list of sentences.
- `OH.sample.cc.emailPrompt` is the review prompt, already in the app. `OH.sample.cc.inbox` is the made-up inbox as text. `OH.sample.cc.emailAnswer` is a sample answer in the shape below.

**The answer the page reads**

The review prompt asks the AI for exactly this shape. Read it line by line. The five headings are REVIEW, SHORT LIST, DRAFTS, LOOKS FAKE and UNSURE.

```
REVIEW
EMAIL 1 | REPLY TODAY | who it is from | the subject | why
SHORT LIST
EMAIL 1 | what the owner must do | when
DRAFTS
DRAFT 1 | To: the name | Subject: the subject
the reply, over one or more lines
END
LOOKS FAKE
EMAIL 6 | why it looks fake
UNSURE
- a sentence
```

**The page, top to bottom**

1. If there is no review: the Needs setup box, and the Run the review section open. Otherwise the next five.
2. Four number tiles: Emails reviewed (with the date of the last review), On the short list (the ones not ticked), Drafts to check (the ones not ticked), Looks fake.
3. A card with the classes `card first`, headed The short list. Each line has a tick box, and under it the email number, its subject and when.
4. A card headed Drafts to check. A note says the page never sends. Each draft shows who it is to, the subject, the text, a button Copy the draft, and a tick box I checked every fact in it. There is no Send button anywhere.
5. A card headed Everything, sorted, with four piles using the classes `piles`, `pile` and `item`. Each email shows its number, subject, sender and why, a red label Looks fake with the reason when it is on the fake list, and a select to move it to another pile. A moved email gets the class `moved`. Moving an email into Reply today adds a line to the short list if it has none.
6. A card headed What it was unsure about, when there is anything.
7. A section headed Run the review. One paragraph: if your Claude plan has the Gmail connector, ask Claude to read today's inbox with this prompt, and it only reads. If not, paste the emails under the prompt, which works for any mail program. Then `OH.promptBox` with the review prompt, and the sample inbox as its data in the sample business. Then `OH.bringIn` labelled Bring the review back, with the button Use this review, and the sample answer in the sample business only. Bringing a review in replaces the last one and adds a change log line.

**The home screen number**

- `summary()` returns `{ label: "Emails only you can act on", value: 4, tone: "warn" }`, with tone `"ok"` at zero.
- With no review: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 3`, `id: "week-3-email"`, `title: "The email short list"`, `data: ["email"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-3-email.js`. If you can write files in my project folder, write it to `pieces/week-3-email.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
