**中文** · [README.md](./README.md)

<p align="center">
  <img src="assets/banner.svg" alt="forge-safeguard" width="640">
</p>

<p align="center">
  <a href="https://github.com/huanweide/forge-safeguard-20260812/stargazers"><img src="https://img.shields.io/github/stars/huanweide/forge-safeguard-20260812" alt="Stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/huanweide/forge-safeguard-20260812" alt="License"></a>
</p>

# safeguard (v1.1.0)

A lightweight command safety guardrail that intercepts destructive commands before agent / automation runs them — distinguishing **quoted references** from **real execution**.

```bash
node index.js check "rm -rf /"        # dangerous → exit code 1
node index.js check "ls -la"          # safe → 0
node index.js check "echo 'rm -rf /'" # quoted reference → safe
node index.js check "echo x; rm -rf /"# mixed → dangerous (per-statement detection)
node index.js scan                    # show integration methods
node index.js install                 # print the hook integration snippet
node index.js rules                   # list rules (* = dangerous even inside read-only verbs)
```

## Why it exists

Agents and automation happily run whatever command string they are handed. A single `rm -rf` or `git push --force` buried in a script can destroy work. safeguard sits in front of execution and blocks destructive commands — but it is smart enough to tell a real `rm -rf /` from the same text appearing inside quotes, an `echo`, or a search pattern.

Fixes in v1.1.0 (grounded in real-world usage):

- Split statements by `; & | && ||` and newlines and check **each statement** — so `echo x; rm -rf /` is no longer passed through wholesale.
- Read-only verbs (`echo` / `grep` / `find` / `sed`…) at the start of a statement are exempt from ordinary dangerous-text rules (quoted references are safe); only `readonlyUnsafe` rules like `find -delete` / `sed -i` / `find -exec rm` still apply.
- More rules: `git push --force`, `shutdown` / `reboot`, `chown -R`, `crontab -r`, `mv` to `/dev/null`, redirect-overwrite of devices, and on **Windows** `del /s /q`, `rd /s /q`, `format C:`.
- The `install` snippet uniformly `exit 1` (plus a function-form `return 1`); an unknown subcommand `exit 2`.

Pure Node / TypeScript, zero compilation, rules hot-editable in JS. MIT, non-commercial.

> **Portability**: pure Node/TS, no compile step — `node index.js check "command"` works immediately, rules hot-edited in JS. Runs locally, no backend, no dependency install. MIT, non-commercial.

## Who should use this

- You run AI agents or automation that executes shell commands and want a last line of defense against destructive operations.
- You want a guardrail that understands the difference between a command and a mention of a command.

## Who should NOT use this

- You need a full policy engine with audit logging and centralized management — safeguard is a single-file, local, rules-in-JS checker.
- You expect it to parse every shell nuance — it does statement-level pattern matching, not a full shell interpreter.

## Usage

```bash
node index.js check "rm -rf /"        # dangerous → exit code 1
node index.js check "ls -la"          # safe → 0
node index.js check "echo 'rm -rf /'" # quoted reference → safe
node index.js check "echo x; rm -rf /"# mixed → dangerous (per-statement detection)
node index.js scan                    # show integration methods
node index.js install                 # print the hook integration snippet
node index.js rules                   # list rules (* = dangerous even inside read-only verbs)
```

## Integrate into automation / agents

Wrap the command in double quotes as a whole:

```bash
node /path/to/safeguard/index.js check "$CMD" || exit 1
```

## Self-test

```bash
node test.js   # prints ALL TESTS PASSED
```

## More open-source tools by huanweide

- 🎬 Subtitle / video: [bili-subtitle-universal](https://github.com/huanweide/bili-subtitle-universal) · [live-subtitle](https://github.com/huanweide/live-subtitle) · [zhihuishu-helper](https://github.com/huanweide/zhihuishu-helper) · [video-brief](https://github.com/huanweide/video-brief)
- 🩺 Code-health family (18 zero-dep CLI axes): [family-showcase](https://github.com/huanweide/family-showcase)
- 🔧 CLI utilities: [idiot-index](https://github.com/huanweide/idiot-index) · [recall-cli](https://github.com/huanweide/recall-cli) · [forge-safeguard](https://github.com/huanweide/forge-safeguard-20260812)
- 🖥️ Desktop / news: [floatsnip](https://github.com/huanweide/floatsnip) · [tech-news-hub](https://github.com/huanweide/tech-news-hub)
- 📦 All repos: <https://github.com/huanweide?tab=repositories>

## More from huanweide

- 📚 Long-form creation — AI novel workshop, local rule engine, zero-dependency: [novel-smith](https://github.com/huanweide/novel-smith)
- 🎓 Course assistant — Zhihuishu auto-play/continue/AI answers: [zhihuishu-helper](https://github.com/huanweide/zhihuishu-helper)
- 🎬 Subtitle / video — one-click Bilibili subtitle extraction (official subtitles, zero key): [bili-subtitle-universal](https://github.com/huanweide/bili-subtitle-universal)
- 📺 Live subtitle — live/meeting real-time subtitles: [live-subtitle](https://github.com/huanweide/live-subtitle)
- ✂️ Video summary — one-click long-video summary: [video-brief](https://github.com/huanweide/video-brief)
- 🖥️ Overview — all of huanweide's open-source projects: [family-showcase](https://github.com/huanweide/family-showcase)
- 🩺 Code health — zero-dependency multi-axis static checkup: [doctors](https://github.com/huanweide/doctors)
