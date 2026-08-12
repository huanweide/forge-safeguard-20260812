'use strict';
// safeguard 规则引擎（pm 优化版）
// readonlyUnsafe=true 表示：即便出现在只读动词(echo/grep/find/sed...)语句中也危险
module.exports = [
  // —— Unix 删除/破坏 ——
  { name: '递归强制删除', severity: 'CRITICAL', readonlyUnsafe: false,
    regex: /\brm\s+-(?:[a-zA-Z]*rf|[a-zA-Z]*fr)\b|\brm\b[^\n;|&]*(?:\s+-[a-zA-Z]*r\b)[^\n;|&]*(?:\s+-[a-zA-Z]*f\b)|\brm\b[^\n;|&]*(?:\s+-[a-zA-Z]*f\b)[^\n;|&]*(?:\s+-[a-zA-Z]*r\b)/,
    reason: 'rm -rf 无条件递归删除，路径错即灾难（已覆盖 rm -f -r 等拆分写法）' },
  { name: 'git 硬重置', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\bgit\s+reset\s+--hard\b/, reason: '丢弃所有未提交改动，不可恢复' },
  { name: 'git 强制清理', severity: 'HIGH', readonlyUnsafe: false, regex: /\bgit\s+clean\s+-[a-zA-Z]*f/, reason: '删除所有未跟踪文件' },
  { name: 'git 强制推送', severity: 'MEDIUM', readonlyUnsafe: false, regex: /\bgit\s+push\b[^\n;|&]*--force/, reason: '强制推送可能覆盖远端历史' },
  { name: 'DROP TABLE', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\bDROP\s+TABLE\b/i, reason: '删除整张表' },
  { name: '无 WHERE 的 DELETE', severity: 'HIGH', readonlyUnsafe: false, regex: /\bDELETE\s+FROM\b(?![^;]*\bWHERE\b)/i, reason: '全表删除' },
  { name: 'fork bomb', severity: 'CRITICAL', readonlyUnsafe: false, regex: /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, reason: 'fork bomb 耗尽进程表' },
  { name: '设备直写 dd', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\bdd\s+.*of=\/dev\//, reason: '向设备直接写，可能毁盘' },
  { name: '重定向覆写设备', severity: 'CRITICAL', readonlyUnsafe: false, regex: />\s*\/dev\/\w+/, reason: '重定向覆写设备文件' },
  { name: '管道执行下载脚本', severity: 'HIGH', readonlyUnsafe: false, regex: /\b(curl|wget)\b[^\n|]*\|\s*(sh|bash|sudo)/, reason: '下载即执行，供应链风险' },
  { name: '格式化文件系统', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\bmkfs\b/, reason: '格式化磁盘' },
  { name: '全盘 777', severity: 'MEDIUM', readonlyUnsafe: false, regex: /\bchmod\s+-R\s+777\s+\//, reason: '放开根目录权限' },
  { name: 'chown -R 根', severity: 'MEDIUM', readonlyUnsafe: false, regex: /\bchown\s+-R\b/, reason: '递归改根权限' },
  { name: '关机/重启', severity: 'HIGH', readonlyUnsafe: false, regex: /\b(shutdown|reboot|halt|poweroff)\b/, reason: '关机/重启' },
  { name: 'crontab -r', severity: 'MEDIUM', readonlyUnsafe: false, regex: /\bcrontab\s+-r\b/, reason: '删除所有定时任务' },
  { name: 'mv 到 /dev/null', severity: 'HIGH', readonlyUnsafe: false, regex: /\bmv\b[^\n;|&]*\/dev\/null/, reason: '丢弃文件到 null' },
  // —— 只读动词的破坏用法（readonlyUnsafe）——
  { name: 'find -delete', severity: 'HIGH', readonlyUnsafe: true, regex: /\bfind\b[^\n;|&]*-delete\b/, reason: 'find 直接删除匹配项' },
  { name: 'find -exec rm', severity: 'HIGH', readonlyUnsafe: true, regex: /\bfind\b[^\n;|&]*-exec\b[^\n;|&]*\brm\b/, reason: 'find 执行删除' },
  { name: 'sed -i 原地修改', severity: 'MEDIUM', readonlyUnsafe: true, regex: /\bsed\b[^\n;|&]*\s+-i\b/, reason: 'sed -i 原地修改文件' },
  // —— Windows ——
  { name: 'Windows 递归删除', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\b(del|erase)\s+\/[sq]\b|\brd\s+\/[sq]\b|\brmdir\s+\/[sq]\b/, reason: 'Windows 递归强制删除' },
  { name: 'Windows 格式化', severity: 'CRITICAL', readonlyUnsafe: false, regex: /\bformat\s+[a-zA-Z]:/, reason: '格式化磁盘' }
];
