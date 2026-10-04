# Week 3 build details · the email short list

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
