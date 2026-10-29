<p align="center">
  <img src="assets/banner.svg" alt="forge-safeguard" width="640">
</p>

<!-- badges -->
[![License](https://img.shields.io/github/license/huanweide/forge-safeguard-20260812)](LICENSE)
[![Stars](https://img.shields.io/github/stars/huanweide/forge-safeguard-20260812)](https://github.com/huanweide/forge-safeguard-20260812/stargazers)
<!-- /badges -->

⚡ A lightweight command safety guardrail that intercepts destructive commands before agent/automation runs them — distinguishing quoted references from real execution.

# safeguard（pm 优化版 · v1.1.0）

轻量命令安全护栏。在 agent / 自动化真正执行命令前，拦截破坏性命令，并**区分「引用/搜索」与「真执行」**。

相对 am 版的修复（来自 maxloop 魔王系统深度体验）：
- 按 `; & | && ||` 和换行**拆语句、逐句检测**，杜绝 `echo x; rm -rf /` 整条误放行。
- 只读动词（echo/grep/find/sed…）开头的语句豁免常规危险文本（引号内引用安全），仅 `find -delete` / `sed -i` / `find -exec rm` 等 `readonlyUnsafe` 规则仍生效。
- 补全规则：git push --force、shutdown/reboot、chown -R、crontab -r、mv 到 /dev/null、重定向覆写设备，以及 **Windows** 的 `del /s /q`、`rd /s /q`、`format C:`。
- `install` 片段统一 `exit 1`（并附函数版 `return 1`）；未知子命令 `exit 2`。

纯 Node/TS，零编译，规则用 JS 热改。MIT，非盈利。

> **📦 便携性速览**
>
> - **纯 Node/TS，零编译**：`node index.js check "命令"` 即用，规则用 JS 热改。
> - 本地运行，无后端、无依赖安装；MIT，非盈利。


## 用法
```bash
node index.js check "rm -rf /"        # 危险 → 退出码 1
node index.js check "ls -la"          # 安全 → 0
node index.js check "echo 'rm -rf /'" # 引号引用 → 安全
node index.js check "echo x; rm -rf /"# 混合 → 危险（逐句检测）
node index.js scan                    # 查看集成方式
node index.js install                 # 打印 hook 集成片段
node index.js rules                   # 列出规则（* = 只读动词中也危险）
```

## 集成到自动化 / agent（注意整体双引号包裹命令）
```bash
node /path/to/safeguard/index.js check "$CMD" || exit 1
```

## 自测
```bash
node test.js   # 输出 ALL TESTS PASSED
```
---

## 🧰 更多开源工具（by ReTri）

- 🎬 字幕 / 视频：[bili-subtitle-universal](https://github.com/huanweide/bili-subtitle-universal) · [live-subtitle](https://github.com/huanweide/live-subtitle) · [zhihuishu-helper](https://github.com/huanweide/zhihuishu-helper) · [video-brief](https://github.com/huanweide/video-brief)
- 🩺 代码健康全家桶（18 轴零依赖 CLI）：[family-showcase](https://github.com/huanweide/family-showcase)
- 🔧 命令行利器：[idiot-index](https://github.com/huanweide/idiot-index) · [recall-cli](https://github.com/huanweide/recall-cli) · [forge-safeguard](https://github.com/huanweide/forge-safeguard-20260812)
- 🖥️ 桌面 / 资讯：[floatsnip](https://github.com/huanweide/floatsnip) · [tech-news-hub](https://github.com/huanweide/tech-news-hub)
- 📦 全部仓库：<https://github.com/huanweide?tab=repositories>

## 🧰 同一作者的其他工具

> 作者在做一系列开源效率工具，欢迎顺手点 Star 支持：

- 📚 长篇创作 — AI 小说工坊，本地规则引擎零依赖：[点此访问](https://github.com/huanweide/novel-smith)
- 🎓 网课助手 — 智慧树自动播放/续播/AI 答题：[点此访问](https://github.com/huanweide/zhihuishu-helper)
- 🎬 字幕/视频 — B站字幕一键提取（零 Key 取官方字幕）：[点此访问](https://github.com/huanweide/bili-subtitle-universal)
- 📺 实时字幕 — 直播/会议实时字幕：[点此访问](https://github.com/huanweide/live-subtitle)
- ✂️ 视频摘要 — 长视频一键总结：[点此访问](https://github.com/huanweide/video-brief)
- 🖥️ 总览 — 作者全部开源项目集散：[点此访问](https://github.com/huanweide/family-showcase)
- 🩺 代码健康 — 零依赖多轴静态体检：[点此访问](https://github.com/huanweide/doctors)
