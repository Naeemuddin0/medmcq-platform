#!/bin/bash
set -e

JENKINS_URL="http://localhost:8080"
JENKINS_PASS=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)
AUTH="admin:${JENKINS_PASS}"

echo "=== Jenkins Password: ${JENKINS_PASS} ==="
echo "=== Jenkins HTTP Status ==="
curl -s -o /dev/null -w "%{http_code}" ${JENKINS_URL}/login
echo ""

echo "=== Node Status ==="
curl -s --user "${AUTH}" "${JENKINS_URL}/computer/api/json" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for n in d.get('computer', []):
    print(n['displayName'], '| offline:', n.get('offline'), '| executors:', n.get('numExecutors'), '| offlineCause:', n.get('offlineCause'))
"

echo "=== Bringing Built-In Node Online ==="
CRUMB=$(curl -s --user "${AUTH}" "${JENKINS_URL}/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")
echo "Crumb: ${CRUMB}"

curl -s -X POST --user "${AUTH}" \
  -H "${CRUMB}" \
  "${JENKINS_URL}/computer/(built-in)/toggleOffline?offlineMessage=" 
echo ""
echo "Done - node bring-online attempted"

echo "=== Node Status After Fix ==="
curl -s --user "${AUTH}" "${JENKINS_URL}/computer/api/json" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for n in d.get('computer', []):
    print(n['displayName'], '| offline:', n.get('offline'))
"

echo "=== Dev containers status ==="
docker ps -a | grep -E "medmcq|jenkins|mongo"

echo "=== Memory ==="
free -h

echo "=== Disk ==="
df -h /
