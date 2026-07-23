#!/bin/bash
set -e

JENKINS_URL="http://localhost:8080"
JENKINS_PASS=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)
AUTH="admin:${JENKINS_PASS}"

echo "=== Using Jenkins CLI to bring node online ==="

# Download Jenkins CLI jar
curl -s -o /tmp/jenkins-cli.jar ${JENKINS_URL}/jnlpJars/jenkins-cli.jar

# Bring Built-In node online using CLI
java -jar /tmp/jenkins-cli.jar -s ${JENKINS_URL} -auth "${AUTH}" online-node "(built-in)"
echo "Node marked online via CLI"

# Verify
sleep 2
curl -s --user "${AUTH}" "${JENKINS_URL}/computer/api/json" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for n in d.get('computer', []):
    print(n['displayName'], '| offline:', n.get('offline'))
"
