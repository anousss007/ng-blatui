#!/usr/bin/env bash
# Deploy the hosted ng-blatui MCP server to the VPS (https://ngblatui.remix-it.com/mcp).
# Idempotent: ships the Node service + data, installs a systemd unit, adds the nginx /mcp route,
# and drops the discovery card. Requires SSH access to the VPS (Tailscale). No Cloudflare change —
# /mcp is a path under the already-tunnelled hostname.
set -euo pipefail

HOST="${NGBLATUI_HOST:-root@100.127.3.33}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "› Regenerating registry + api (bundled fallback for the service)…"
node "$ROOT/scripts/build-registry.mjs" >/dev/null

echo "› Uploading MCP service + discovery card → $HOST…"
ssh "$HOST" 'mkdir -p /opt/ngblatui-mcp /var/www/ngblatui/.well-known/mcp'
scp "$ROOT/mcp/core.mjs" "$ROOT/mcp/server.mjs" "$ROOT/mcp/registry.json" "$ROOT/mcp/api.json" "$HOST:/opt/ngblatui-mcp/"
scp "$ROOT/projects/demo/public/.well-known/mcp/server-card.json" "$HOST:/var/www/ngblatui/.well-known/mcp/server-card.json"

echo "› Installing systemd unit + nginx route + restarting…"
ssh "$HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

cat > /etc/systemd/system/ngblatui-mcp.service <<'UNIT'
[Unit]
Description=ng-blatui hosted MCP server (Streamable HTTP)
After=network.target

[Service]
Environment=PORT=8787
Environment=HOST=127.0.0.1
Environment=DATA_DIR=/var/www/ngblatui
ExecStart=/usr/bin/node /opt/ngblatui-mcp/server.mjs
Restart=always
RestartSec=2
User=www-data
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now ngblatui-mcp
systemctl restart ngblatui-mcp

CONF=/etc/nginx/sites-enabled/ngblatui.remix-it.com
if ! grep -q 'location = /mcp' "$CONF"; then
  awk '
    /index +index\.html;/ && !done {
      print
      print ""
      print "    # ngblatui-mcp — hosted MCP endpoint (Streamable HTTP) proxied to the local Node service"
      print "    location = /mcp {"
      print "        proxy_pass http://127.0.0.1:8787;"
      print "        proxy_http_version 1.1;"
      print "        proxy_set_header Host $host;"
      print "        proxy_set_header X-Forwarded-For $remote_addr;"
      print "    }"
      done=1
      next
    }
    { print }
  ' "$CONF" > "$CONF.tmp" && mv "$CONF.tmp" "$CONF"
  echo "  + added nginx location = /mcp"
else
  echo "  = nginx /mcp route already present"
fi

nginx -t && systemctl reload nginx
sleep 1
systemctl is-active ngblatui-mcp && echo "  service active on :8787"
REMOTE

echo "✓ Deployed → https://ngblatui.remix-it.com/mcp  (card: /.well-known/mcp/server-card.json)"
