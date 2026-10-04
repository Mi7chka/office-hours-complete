# The class command center · the complete project

A command center for a small business, built one piece a week in **Wednesday Office Hours**, a
free live class by Mitchell B Consulting. Eight Wednesdays, eight pieces, one screen that shows
where the business stands.

This is the complete project: all eight pieces are built, and it is where the finished version of
every piece lives. The class works from the **starter**, which holds the pieces built so far and
this week's piece ready to build: https://github.com/Mi7chka/office-hours-starter

## Open it

1. Press the green **Code** button on this page, then **Download ZIP**, and unzip it.
2. Double-click **Launch.command** (Mac) or **Launch.bat** (Windows). Or just open `index.html`.

Nothing to install. No account. It never goes online, and anything you type stays in your own
browser on your own computer. Nothing in this project sends, posts, pays or deletes.

## The eight pieces

| Week | Date | The piece | The question it answers | Class notes | Runbook |
|---|---|---|---|---|---|
| 1 | Oct 7 | The Today page | What needs me today? | [class/week-01](class/week-01) | [session-01](runbooks/session-01.md) |
| 2 | Oct 14 | The board and the change log | What is open, and what is waiting on me? | [class/week-02](class/week-02) | [session-02](runbooks/session-02.md) |
| 3 | Oct 21 | The email short list | Which emails need me, and what do I say? | [class/week-03](class/week-03) | [session-03](runbooks/session-03.md) |
| 4 | Oct 28 | The pipeline | Which deals have gone quiet, and what is the next step? | [class/week-04](class/week-04) | [session-04](runbooks/session-04.md) |
| 5 | Nov 4 | Website inquiries and the website tab | What came in through the website, and is it doing its job? | [class/week-05](class/week-05) | [session-05](runbooks/session-05.md) |
| 6 | Nov 11 | The content calendar and the posts board | What are we posting this month, and what is ready? | [class/week-06](class/week-06) | [session-06](runbooks/session-06.md) |
| 7 | Nov 18 | Plan my day and the day page | What do I do first today, and what comes after? | [class/week-07](class/week-07) | [session-07](runbooks/session-07.md) |
| 8 | Nov 25 | The owner summary, the knowledge page, the backup and the roadmap | Is the business where I think it is, and is it safe? | [class/week-08](class/week-08) | [session-08](runbooks/session-08.md) |

The home screen shows the eight pieces first, each with one number. Under them is the Toolbox
(the eight tools from version 1 of the class), and then the game. Both are extras.

## How a week works: the six steps

Every piece goes through the same six steps, in the same order. In the app, each piece has a
build page that walks through them (press **How it was built** on a piece), and the **Runbook**
button opens the 15-minute version we do together in class.

| Step | What it makes | In one line |
|---|---|---|
| 1. Design | A design note | Who uses it, the one question it answers, what is on it, what done means. |
| 2. Prompt | The build prompt | Written from a template: role, context, the design note, the rules, what to hand back. |
| 3. Review | A reviewed build | Read it against the design note. Find the one thing it got wrong. |
| 4. Test | Three checks, passed | Written before the build, run with sample data. |
| 5. Ship | A runbook line | The step, the sign it worked, how to undo it. Use it with real data the next morning. |
| 6. Log | One change log line | What changed and why, plus a decision when a choice was made. |

For week N, these are the files:

| File | What it is |
|---|---|
| `class/week-0N/design-note.md` | The four questions, answered for that piece. |
| `class/week-0N/build-prompt.md` | The one prompt that makes the piece. Put together from the design note, the build details, the rules and two shared parts. |
| `class/week-0N/checks.md` | Three checks a person can verify by looking. |
| `class/week-0N/runbook.md` | The 15-minute build. The same content as `runbooks/session-0N.json`, which the slide decks are made from. |
| `class/week-0N/sample-*` and `*-prompt.md` | Sample files, and the prompts a piece uses day to day, to use without the app. |
| `class/week-01/rules.md` | The rules file for the AI. The starter also carries it as `CLAUDE.md`. |
| `pieces/week-N-name.js` | The finished piece. |
| `app/data/week-N-name.js` | Its made-up sample data. |

## Both tools: the Claude app and Claude Code

Every build prompt works in both, and says so in its first two lines.

- **In the Claude app:** paste the prompt and send. Save the file it makes into the `pieces` folder.
- **In Claude Code:** open the project folder and paste the same prompt. It writes the file for you.

## How a piece shows up

There is no list to edit. Each piece is one file with a fixed name in the `pieces` folder, such as
`pieces/week-1-today.js`. When the file is there, the app shows the piece. In the starter, a small
placeholder file with the same name holds the place, so the computer asks whether to replace it.
That question is the sign the name is right.

If the file is there and does not work, the home screen says the file needs a fix, and the build
page says what to tell the AI.

## The sample business, then your own

Every piece starts with a made-up company: Greenline Landscaping, owner Jordan Reyes, in Cedar
Hollow. No real people and no real numbers. Press **My business** on the home screen to switch to
your own. The two sets of data are kept apart and never mixed.

- Your own data comes in by typing, by pasting text, or by dropping in a file you exported. That
  works with no connector at all. Where a week names a connector (Gmail, Google Calendar, Canva),
  it is optional, and the page says "if your Claude plan has it".
- Where nothing is brought in yet, a piece says **Needs setup**. It never shows a made-up number.
- On the owner summary, every number is marked measured, estimated or projected, and the three
  kinds are never added together.
- AI is used the way the class teaches it: the piece builds the prompt, you paste it into Claude,
  and you bring the answer back. Each piece also has a sample answer, so it works with no AI at hand.

## What is free and what is paid

You run it yourself, it is free. That is everything in this project. The version that runs by
itself, connects live systems or serves a team is the 48-Hour Command Center: one flat price, on
the page at https://mitchellbconsulting.com/command-center. Each piece says in one line what its
paid version does. The class does not teach that side. AI drafts. You decide.

## The Toolbox

Eight tools from version 1 of the class: inbox to task list, lead form to follow-up, the 3-second
home page test, the get-found checks, one idea in five pieces, the pipeline board, a messy export
on one screen, and the when-it-breaks sheet. Each still works as it did, with its own follow-along
under `runbooks/toolbox/`, its prompts in `prompts/` and its sample files in `samples/`.
Version 1 as it was is saved as the tag `season-1-v1`.

## The game: Save Greenline

**Save Greenline: The Case of the Busywork Bandits** is version 1 of the course as a cartoon
adventure. You play in the first person, as Greenline's new AI agent, and catch eight goofy bandits
who steal the company's time. Press **Play** at the top of the app. It is optional: the class and
every piece work without it. It never asks for a password or an email. How it is built: `GAME.md`.
There is also an app with its own icon for Mac and Windows: see `INSTALL.md`.

## For whoever looks after this project

- Plain HTML, CSS and JavaScript. No framework, no build step, no server, no network calls.
- `MODULES.md` explains how a piece is built, the toolbox every piece gets, and the Toolbox tools.
- `python3 tools/build_runbooks.py` puts the build prompts together and builds what the app shows
  from `runbooks/` and `class/`. Run it after changing any class note or runbook.
- `python3 tools/make_starter.py --week N` builds the class starter for week N: every earlier piece
  built, week N ready to build, nothing from later weeks.
- `python3 tools/check_words.py` checks the words: no dashes, no dollar amounts, no hype words.
- `python3 tools/build_apps.py` builds the Mac and Windows apps into `dist/`.
- The rules file is `class/week-01/rules.md`. The starter gets a copy named `CLAUDE.md`, which
  Claude Code reads by itself. This project has no `CLAUDE.md`, so the class rules do not steer
  work on the project itself.

## The class

Free, live on Google Meet, every Wednesday at 9:00 PM Eastern: 30 minutes of teaching, a 15-minute
build together, then your questions. Subscribe for the weekly link:
**https://mitchellbconsulting.com/office-hours**

Want a hand putting this to work in your own business? The first call is free:
https://mitchellbconsulting.com/book

MIT licence. Built by Mitchell Bronshtein, Mitchell B Consulting.
