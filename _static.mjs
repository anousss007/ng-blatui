import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const root = 'dist/demo/browser';
const mime = { '.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon' };
createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = join(root, p);
  if (!existsSync(f) || statSync(f).isDirectory()) {
    // SPA fallback unless it's an asset request
    f = extname(p) && existsSync(join(root,p)) ? join(root,p) : join(root,'index.html');
  }
  try { const body = readFileSync(f); res.writeHead(200,{'content-type':mime[extname(f)]||'application/octet-stream'}); res.end(body); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4271, ()=>console.log('static on 4271'));
