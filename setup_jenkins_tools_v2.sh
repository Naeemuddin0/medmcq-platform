#!/bin/bash
set -e

echo "=== Creating group 113 for docker access ==="
if ! getent group 113; then
  groupadd -g 113 docker-host
fi
usermod -aG docker-host jenkins

echo "=== Installing Docker CLI v26.0.0 ==="
curl -L "https://download.docker.com/linux/static/stable/x86_64/docker-26.0.0.tgz" -o /tmp/docker.tgz
tar xzvf /tmp/docker.tgz -C /tmp/
cp /tmp/docker/docker /usr/local/bin/docker
chmod +x /usr/local/bin/docker
rm -rf /tmp/docker /tmp/docker.tgz

echo "=== Installing docker-compose v2.26.1 ==="
curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "=== Verifying installation as root ==="
docker --version
docker-compose --version
docker ps

echo "=== Verifying installation as jenkins user ==="
# We check if jenkins user can run these
su -s /bin/bash -c "docker --version && docker-compose --version && docker ps" jenkins
