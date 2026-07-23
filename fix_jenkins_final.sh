#!/bin/bash
set -e

# This script runs on the EC2 host but executes commands inside the jenkins container
CONTAINER_NAME="jenkins"

echo "=== Getting Jenkins admin password ==="
JENKINS_PASS=$(docker exec $CONTAINER_NAME cat /var/jenkins_home/secrets/initialAdminPassword)
AUTH="admin:${JENKINS_PASS}"

echo "=== Executing online-node command inside container ==="
# We use docker exec to run the java command inside the container where java and the jenkins-cli are accessible
docker exec $CONTAINER_NAME bash -c "
  curl -s -o /tmp/jenkins-cli.jar http://localhost:8080/jnlpJars/jenkins-cli.jar
  java -jar /tmp/jenkins-cli.jar -s http://localhost:8080 -auth $AUTH online-node '(built-in)'
"

echo "=== Verification ==="
docker exec $CONTAINER_NAME bash -c "
  curl -s --user $AUTH http://localhost:8080/computer/api/json | python3 -c '
import sys, json
d = json.load(sys.stdin)
for n in d.get(\"computer\", []):
    print(n[\"displayName\"], \"| offline:\", n.get(\"offline\"))
'
"
