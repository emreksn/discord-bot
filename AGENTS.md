# AGENTS.md

This file is for AI coding agents working in this repository. Follow the local architecture and keep changes small, explicit, and safe.

## Project Summary

- Runtime: Node.js CommonJS
- Main entry: `index.js`
- Slash command deploy script: `deploy-commands.js`
- Discord stack: `discord.js` v14, `discord-player` v7
- Persistence: SQLite via `sqlite3` in `db.js`
- Database file: `db/database.sqlite`
- Main feature areas:
  - Music commands in `commands/play.js`, `commands/queue.js`, `commands/skip.js`, `commands/stop.js`
  - Economy and casino commands in `commands/*.js`
  - Event handlers in `events/`

## How The Bot Is Wired

- `index.js` creates the Discord client and the global `discord-player` instance.
- Commands are auto-loaded from `commands/*.js`.
- Events are auto-loaded from `events/*.js`.
- Every command module is expected to export:
  - `data`: a `SlashCommandBuilder`
  - `execute(interaction)`: async handler
- `deploy-commands.js` reads every command file and registers slash commands globally using `CLIENT_ID` and `TOKEN`.

## Required Environment

Expected environment variables:

- `TOKEN`
- `CLIENT_ID`

Operational assumptions:

- FFmpeg must be available for music playback.
- `youtube-dl-exec` is used in `commands/play.js` to resolve YouTube streams.

## Run Commands

- Install deps: `npm install`
- Start bot: `npm start`
- Dev mode: `npm run dev`

Current scripts always redeploy slash commands before starting the bot.

## Code Conventions For This Repo

- Stay in CommonJS style: use `require(...)` and `module.exports`.
- Match the existing command pattern instead of introducing a new abstraction.
- Keep user-facing bot text consistent with the existing language in the repo. Most current responses are Turkish.
- Prefer minimal, local edits over broad refactors unless the task explicitly requires one.
- Preserve existing command names and option names unless the user asked to change them.
- Keep command files self-contained unless logic is clearly shared and reused.

## Command Editing Rules

When adding or updating a slash command:

1. Edit or add a file in `commands/`.
2. Export `data` and `execute`.
3. Keep option names stable because slash command schemas are deployed from file contents.
4. If command behavior changes, ensure `deploy-commands.js` will pick it up automatically.
5. Assume the command will be registered globally, so schema changes may take time to propagate on Discord.

## Database Rules

- Database access is centralized in `db.js`.
- Current schema:
  - `users(id TEXT PRIMARY KEY, balance INTEGER DEFAULT 0, last_daily INTEGER DEFAULT 0)`
- Reuse existing helpers when possible:
  - `getUser`
  - `updateUser`
  - `addBalance`
  - `getTopUsers`
- If schema changes are needed, make them additive and backward-compatible when possible.
- Do not hard-delete the SQLite file or reset user balances unless explicitly requested.

## Music System Notes

- The player instance is created once in `index.js`.
- Idle behavior is intentional:
  - delete queue after 5 minutes when queue is empty
  - delete queue after 5 minutes when the voice channel is empty except for the bot
- `commands/play.js` currently only accepts YouTube URLs.
- Track metadata is manually adjusted after playback starts so queue and status messages look correct. Avoid removing that unless you replace it with an equivalent approach.

## Event Handling Notes

- `events/interactionCreate.js` is the central command router.
- Command failures should reply or follow up safely depending on whether the interaction has already been acknowledged.
- `events/ready.js` is intentionally simple.

## Validation Checklist

Before finishing a change:

- Confirm new or changed command modules load with the existing auto-loader.
- Confirm slash command builders still serialize correctly for deployment.
- Confirm interaction handlers reply, defer, or follow up correctly.
- For economy changes, verify balance updates remain consistent.
- For music changes, avoid breaking voice-channel checks and queue metadata.

## Things To Avoid

- Do not convert the project to ESM.
- Do not introduce TypeScript, ORMs, or large framework changes unless explicitly requested.
- Do not move command registration to a different system unless the user asks for it.
- Do not add unrelated formatting churn.
- Do not overwrite user data in `db/database.sqlite`.

## If You Add New Files

- Keep new commands in `commands/`.
- Keep new Discord event handlers in `events/`.
- Put shared non-trivial helpers near the root only if they are used by multiple modules and clearly improve duplication.

## Handoff Notes

When reporting completed work to the user, mention:

- what behavior changed
- whether slash command deployment is affected
- whether any manual environment or dependency step is required
