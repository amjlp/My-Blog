/* 为 Cloudflare Pages 生成 _headers 文件。
 * Netlify 用根目录的 netlify.toml 配置响应头；Cloudflare Pages 只认发布目录里的 _headers。
 * 这里在每次 hexo generate 结束后把同一套安全响应头写进 public/_headers，两个平台可并存。
 * 用 try/catch 包住：写入失败也只打日志，绝不让构建失败。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const HEADERS = [
  '/*',
  '  X-Frame-Options: DENY',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()',
  '  Cross-Origin-Opener-Policy: same-origin',
  ''
].join('\n');

function writeHeaders() {
  try {
    const dir = hexo.public_dir;
    fs.mkdirSync(dir, { recursive: true });
    const target = path.join(dir, '_headers');
    fs.writeFileSync(target, HEADERS, 'utf8');
    hexo.log.info('Cloudflare Pages: 已写入 _headers');
  } catch (err) {
    hexo.log.warn('Cloudflare Pages: _headers 写入失败 - ' + err.message);
  }
}

hexo.extend.filter.register('after_generate', writeHeaders);
