#!/bin/bash
set -e

echo "=== Creating group 113 for docker access ==="
if ! getent group 113; then
  groupadd -g 113 docker-host
fi
usermod -aG docker-host jenkins

echo "=== Installing docker-compose v2.26.1 ==="
curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "=== Verifying installation ==="
/usr/local/bin/docker-compose --version

echo "=== Verifying docker access for jenkins user ==="
sudo -u jenkins docker ps
