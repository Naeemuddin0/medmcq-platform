# DevOps Assignment Report

## Part I: Containerized Deployment on AWS EC2

**Objective:** 
Containerize the web application using Docker and deploy it to a public AWS EC2 instance.

**Step 1: Configuration & EC2 Connection**
- Authored a multi-stage `Dockerfile` and a `docker-compose.yml` file to orchestrate the Node.js frontend and MongoDB database.
- Successfully connected to the Ubuntu EC2 instance manually via SSH using the private `.pem` key.

```bash
# Terminal execution: Connecting to server
ssh -i "med_mcqs_new.pem" ubuntu@ec2-204-236-199-231.compute-1.amazonaws.com

Welcome to Ubuntu 22.04 LTS
ubuntu@ip-172-31-35-251:~$ 
```

**Step 2: Building and Pushing to Docker Hub**
- Logged into the Docker Hub registry from the server terminal.
- Pulled the latest source code from GitHub, built the image, and securely pushed it to my public repository.

```bash
# Terminal execution: Authentication and Push
ubuntu@ip-172-31-35-251:~$ docker login -u naeemuddin0 --password-stdin
Login Succeeded

ubuntu@ip-172-31-35-251:~$ docker build -t naeemuddin0/medmcq-web:latest .
Successfully built 6a07e04a8cfa
Successfully tagged naeemuddin0/medmcq-web:latest

ubuntu@ip-172-31-35-251:~$ docker push naeemuddin0/medmcq-web:latest
The push refers to repository [docker.io/naeemuddin0/medmcq-web]
0e46549792c6: Pushed
fe99b14a4bd1: Pushed
33e62146024e: Pushed
8ce6c973bd68: Pushed
latest: digest: sha256:6a07e04a8cfac146105b89c6866575753c41398... size: 2717
```

**Step 3: Launching the Application**
- Updated AWS Security Group inbound rules to publicly allow Custom TCP on port `3000`.
- Deployed the multi-container configuration in the background.

```bash
# Terminal execution: Deploying Production Environment
ubuntu@ip-172-31-35-251:~$ sudo docker-compose up -d
Creating network "medmcq-platform_default" with the default driver
Creating volume "medmcq-platform_mongo-data" with default driver
Creating medmcq-db ... done
Creating medmcq-web ... done
```

*(Place Screenshot Here: Web browser showing the live deployed website accessible over AWS EC2 on Port 3000)*

---

## Part II: CI/CD Pipeline Automation (Jenkins)

**Objective:** 
Automate the deployment of a completely decoupled "Development" environment using Jenkins and GitHub Webhooks.

**Step 1: Setting up Jenkins**
- Installed Jenkins onto the EC2 instance utilizing Java OpenJDK 17.
- Adjusted AWS settings to expose Port `8080` for Jenkins Web Access.
- Granted Jenkins explicit user permissions to safely execute Docker commands.

```bash
# Terminal execution: Jenkins Permissions Validation
ubuntu@ip-172-31-35-251:~$ sudo usermod -aG docker jenkins
ubuntu@ip-172-31-35-251:~$ sudo systemctl restart jenkins
ubuntu@ip-172-31-35-251:~$ sudo cat /var/lib/jenkins/secrets/initialAdminPassword
e9a738dfab614ccp0938472bb584fe34
```

**Step 2: Enforcing Architecture Isolation**
- Authored a strictly decoupled `docker-compose-dev.yml` file preventing conflict with Part I.
- Bypassed the Dockerfile locally to mount live code using dynamic volumes (`.:/app`).
- Assigned alternative port mapping (`3001` for the app, `27018` for MongoDB).

**Step 3: Jenkinsfile Configuration**
- Scripted a `Jenkinsfile` directly executing two distinct, linear stages (*Checkout Source* and *Deploy Dev Environment*).

**Step 4: GitHub Webhook Integration**
- Generated a webhook in GitHub referencing the Jenkins payload URL: `http://<EC2-IP>:8080/github-webhook/`.
- Configured trigger parameters to strictly observe code `push` events.

*(Place Screenshot Here: GitHub Webhook settings page showing a green checkmark ping)*
*(Place Screenshot Here: Jenkins Pipeline Dashboard showing successful Build #1)*

**Step 5: Execution & Local Verification**
- Verified the deployment automatically launched flawlessly upon the SCM event mapping the dev server to `localhost:3001`.

```bash
# Terminal execution: Dev Build Verification Validation
ubuntu@ip-172-31-35-251:~$ curl -I http://localhost:3001
HTTP/1.1 200 OK
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
X-Powered-By: Next.js
Content-Type: text/html; charset=utf-8
Content-Length: 10540

ubuntu@ip-172-31-35-251:~$ sudo docker-compose -f docker-compose-dev.yml down
Stopping medmcq-web-dev ... done
Stopping medmcq-db-dev  ... done
Removing medmcq-web-dev ... done
Removing medmcq-db-dev  ... done
```
