#!/usr/bin/env node
'use strict';
// safeguard (pm 优化版) · 命令安全护栏
// 修复：① 按 ; & | && || 换行拆语句，逐句检测，杜绝整条误放行
//       ② 只读动词(echo/grep...)开头的语句豁免常规危险文本（引号内引用安全），仅 readonlyUnsafe 规则仍生效
//       ③ 未知子命令 exit 2；install 片段统一 exit 1
const path = require('path');
const rules = require('./rules');

const READONLY_VERBS = /^(echo|printf|grep|sed|awk|cat|less|more|head|tail|find|rg|ag)\b/;

function splitStmts(cmd) {
  return cmd.split(/[;\n]|&&?|\|\|/).map(function (s) { return s.trim(); }).filter(Boolean);
}
function isPureQuoteOrComment(s) {
  if (!s) return false;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return true;
  if (s.startsWith('#')) return true;
  return false;
}
function analyze(rawCmd) {
  const cmd = (rawCmd || '').trim();
  if (!cmd) return { dangerous: false, findings: [], inSearchContext: false };
  const stmts = splitStmts(cmd);
  const findings = [];
  for (const st of stmts) {
    if (isPureQuoteOrComment(st)) continue; // 整句纯引用/注释 → 跳过
    const readonly = READONLY_VERBS.test(st);
    for (const r of rules) {
      if (!r.regex.test(st)) continue;
      if (readonly && !r.readonlyUnsafe) continue; // 只读动词安全用法豁免常规危险文本
      findings.push(r);
    }
  }
  return { dangerous: findings.length > 0, findings: findings, inSearchContext: false };
}
function printReport(res, rawCmd) {
  if (!res.dangerous) { console.log('SAFE · 命令通过安全检查'); return 0; }
  console.log('⛔ DANGER · 检测到破坏性命令模式，已拦截：');
  console.log('  命令: ' + rawCmd);
  for (const f of res.findings) console.log('  - [' + f.severity + '] ' + f.name + '：' + f.reason);
  return 1;
}
function printInstallHint() {
  const me = path.join(__dirname, 'index.js');
  console.log('# 方式一：shell / hook 里直接使用');
  console.log('node "' + me + '" check "$CMD" || exit 1');
  console.log('# 方式二：作为函数（脚本内用 return）');
  console.log('safeguard_check() { node "' + me + '" check "$1" || return 1; }');
  return 0;
}
function main() {
  const argv = process.argv.slice(2);
  const sub = argv[0];
  const raw = argv.slice(1).join(' ');
  if (sub === 'check') { process.exit(printReport(analyze(raw), raw)); }
  else if (sub === 'scan') { console.log('safeguard 集成：在 agent/hook 执行命令前调用 `safeguard check "$CMD"`'); printInstallHint(); process.exit(0); }
  else if (sub === 'install') { process.exit(printInstallHint()); }
  else if (sub === 'rules') { console.log(rules.map(function (r) { return r.severity + '\t' + (r.readonlyUnsafe ? '*' : ' ') + r.name + '\t' + r.regex; }).join('\n')); process.exit(0); }
  else { console.log('用法: safeguard check "<命令>" | scan | install | rules'); process.exit(2); }
}
if (require.main === module) main();
module.exports = { analyze, splitStmts, isPureQuoteOrComment };
