#!/usr/bin/env bash
# Build the docs site and deploy it to the VPS (served at https://ngblatui.remix-it.com
# via nginx + the existing Cloudflare Tunnel). Requires SSH access to the VPS (Tailscale).
set -euo pipefail

HOST="${NGBLATUI_HOST:-root@100.127.3.33}"
# Every vhost on the box roots at /var/www/<site>/<site>-app; keeping the payload in its own
# subdirectory is what lets the parent hold sibling data (ACME's .well-known) that a deploy
# must not wipe. Has to stay in step with `root` in /etc/nginx/sites-enabled/ngblatui.remix-it.com.
REMOTE_DIR="/var/www/ngblatui/ngblatui-app"

echo "› Generating AI registry (registry.json + llms.txt)…"
node scripts/build-registry.mjs

echo "› Building library + site…"
npx ng build ng-blatui
npx ng build demo

echo "› Uploading dist/demo/browser → ${HOST}:${REMOTE_DIR}…"
tar czf - -C dist/demo/browser . | ssh "$HOST" \
  "mkdir -p ${REMOTE_DIR} && rm -rf ${REMOTE_DIR:?}/* && tar xzf - -C ${REMOTE_DIR} && chown -R www-data:www-data ${REMOTE_DIR}"

echo "✓ Deployed → https://ngblatui.remix-it.com"
