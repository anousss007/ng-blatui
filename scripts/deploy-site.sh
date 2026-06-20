#!/usr/bin/env bash
# Build the docs site and deploy it to the VPS (served at https://ngblatui.remix-it.com
# via nginx + the existing Cloudflare Tunnel). Requires SSH access to the VPS (Tailscale).
set -euo pipefail

HOST="${NGBLATUI_HOST:-root@100.127.3.33}"
REMOTE_DIR="/var/www/ngblatui"

echo "› Building library + site…"
npx ng build ng-blatui
npx ng build demo

echo "› Uploading dist/demo/browser → ${HOST}:${REMOTE_DIR}…"
tar czf - -C dist/demo/browser . | ssh "$HOST" \
  "rm -rf ${REMOTE_DIR}/* && tar xzf - -C ${REMOTE_DIR} && chown -R www-data:www-data ${REMOTE_DIR}"

echo "✓ Deployed → https://ngblatui.remix-it.com"
