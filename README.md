# Office Hours demo · the complete project

A small command center for a small business, built one tool a week in **Wednesday Office Hours**,
a free live class by Mitchell B Consulting. Eight sessions, eight tools, one screen.

Every tool does the job taught that week: sample data first, then the prompt, then the answer
comes back, then you check its work, and you leave with something you can use. Then you do it
again with your own business.

## Play it as a game: Save Greenline

**Save Greenline: The Case of the Busywork Bandits** is the same course as a cartoon adventure,
and you play it in the first person, as the AI. You log in as Greenline Landscaping's new AI agent:
pick a name and a look, and see the town of Cedar Hollow through your own visor. Eight goofy bandits
are stealing the company's time. In each case the owner, Jordan, gives you a job. You ride the
little green truck to three places, and a townsperson at each one teaches you one thing. You pick
your plan, and you do that week's job with your own hands in a mini-game. Sprout, the agent who had
the job before you, is your trainer, and one of Sprout's shortcuts is wrong in every case, which is
yours to catch. You never send anything yourself: you hand your work to Jordan, and Jordan approves
it.

You grow as you learn, the way a character in a life sim does. Every thing you learn feeds one of
nine skills (one for each week, and Judgment), experience adds up to ten levels, and each level
earns a new permission from Jordan. It is all on your ID badge and in the Skills panel. The town
turns from gray to color as you go, and there is a certificate at the end.

Press **Play** at the top of the app. Mouse, touch or keyboard. Sound is made by the game itself
and can be switched off. Everything is drawn in code, so there is still nothing to install. The
agent's name is a made-up display name kept in your own browser: the game never asks for a password
or an email. Up to four agents can share one computer, each with its own progress. If you played
before Agent Mode, your closed cases and stars are still there: log in once, and your agent starts
at the level they add up to.

The game is optional. The class and every tool work without it. How it is built: `GAME.md`.

Prefer an app with its own icon? There is one for Mac and one for Windows, built from these same
files: see `INSTALL.md`. They are not signed, so each system asks once before opening them.

## Open it

1. Press the green **Code** button on this page, then **Download ZIP**, and unzip it.
2. Double-click **Launch.command** (Mac) or **Launch.bat** (Windows). Or just open `index.html`.

Nothing to install. No account. It never goes online, and anything you type stays in your own
browser on your own computer.

## The eight tools

| Week | Tool | What you do with it | The session | Follow along |
|---|---|---|---|---|
| 1 | Inbox to task list | Sort an inbox into four piles with AI, catch the one it gets wrong, leave with a to-do list | AI at work: 5 jobs to hand off this week | [session-01](runbooks/session-01.md) |
| 2 | Lead form to follow-up | A form that saves the lead, tells you, and drafts the reply | Automations: make the apps you already pay for talk to each other | [session-02](runbooks/session-02.md) |
| 3 | The 3-second home page test | Test the top of a home page, then rewrite it from your own facts | Your website has 3 seconds | [session-03](runbooks/session-03.md) |
| 4 | The get-found checks | Five checks for Google and for AI answers, and one weak page fixed | Get found: SEO for Google and for AI answers | [session-04](runbooks/session-04.md) |
| 5 | One idea, five pieces | Turn one lesson from your week into a week of posts, in your own voice | Marketing that runs every day without eating your week | [session-05](runbooks/session-05.md) |
| 6 | The pipeline board | See which leads went quiet and draft the follow-ups | Leads to paid work | [session-06](runbooks/session-06.md) |
| 7 | From a messy export to one screen | Find the problems in an export, check the totals, see the business on one screen | Where your data lives | [session-07](runbooks/session-07.md) |
| 8 | The when-it-breaks sheet and your 90-day plan | A clear support request, a one-page sheet for a bad day, and a plan for the next 12 weeks | When it breaks | [session-08](runbooks/session-08.md) |

Press **Runbook** inside any tool for the 15-minute walk-through, with a box to tick at each step.

## How it works

- Plain HTML, CSS and JavaScript. No framework, no build step, no server.
- Every tool starts with a made-up company, Greenline Landscaping. No real people, no real numbers.
- Your own data is kept by your browser on your computer (`localStorage`). "Start over with the
  sample data" in each tool clears that tool.
- AI is used the way the class teaches it: the tool builds the prompt, you paste it into the AI
  chat you already use (Claude, ChatGPT, Gemini, Copilot), and you paste the answer back. No key,
  no account, nothing sent by this project. Each tool also has a sample answer, so it works with
  no AI at hand.
- `prompts/` has every prompt as a text file. `samples/` has the sample files used in class.
- `MODULES.md` explains how a tool is built, if you want to change one or add your own.
- `GAME.md` explains the game: the story, Agent Mode (the login, skills, levels and how a case awards experience), how a case is written, the engine's toolbox. `tools/build_apps.py` builds the Mac and Windows apps into `dist/`.
- `tools/make_starter.py --week N` builds the starter copy the class begins with.

## The class

Free, live on Google Meet, every Wednesday at 9:00 PM Eastern: 30 minutes of teaching, a 15-minute
follow-along demo in this project, then your questions. Subscribe for the weekly link:
**https://mitchellbconsulting.com/office-hours**

Want a hand putting this to work in your own business? The first call is free:
https://mitchellbconsulting.com/book

MIT licence. Built by Mitchell Bronshtein, Mitchell B Consulting.
