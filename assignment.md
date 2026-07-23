# DevOps for Cloud Computing Assignment

**Name:** NAEEM UD DIN
**Roll:** SP23-BDS-038
**Class:** BDS-7
**Submission Deadline:** March 13, 2026

## Application Description
**MedMCQ Platform** is a comprehensive medical question practice web application built with Next.js, Tailwind CSS, and MongoDB. It fulfills the project requirements by:
- Containing multiple functional modules including User Authentication (Sign up/Login), Practice MCQs across 6 medical subjects (Anatomy, Physiology, Biochemistry, Pathology, Microbiology, Pharmacology), and a Dashboard for tracking progress.
- Using a Database Server (MongoDB) to manage application data, user profiles, and question banks.

---

## Part-I: EC2 Deployment (IaaS Model)

The following steps document the deployment of the MedMCQ Platform on an Amazon Public Cloud EC2 instance running Ubuntu 24.04.

### 1. Create an Ubuntu-based Virtual Machine (EC2 Instance)
- Navigated to the AWS Management Console and launched a new EC2 instance.
- Selected the **Ubuntu Server 24.04 LTS** Amazon Machine Image (AMI).
- Chose the appropriate instance type for the workload.
> **[Placeholder: Insert Screenshot of EC2 Instance Running in AWS Console here]**

### 2. Configure Security Rules
- Configured the Security Group attached to the EC2 instance to allow the following inbound traffic:
  - **SSH (Port 22):** To allow terminal access from the local machine.
  - **HTTP (Port 80):** To allow public web traffic to the application.
> **[Placeholder: Insert Screenshot of Security Group Inbound Rules here]**

### 3. Generate Key Pair and Connect via SSH
- Generated a `.pem` key pair during instance creation (`med mcqs.pem`).
- Used an SSH client from the local machine to connect securely to the EC2 instance using its public IP (`54.209.70.76`):
  ```bash
  ssh -i "path/to/med mcqs.pem" ubuntu@54.209.70.76
  ```
> **[Placeholder: Insert Screenshot of SSH Connection Terminal here]**

### 4. System Preparation and Environment Setup
Once connected via SSH, the environment was configured and required packages were installed:

**a. Create a Virtual Swap File:**
Since building a Next.js app is memory-intensive, a 2GB virtual memory swap file was created to prevent the server from crashing due to low RAM.
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**b. Install Node.js and npm:**
Upgraded the Node.js environment to version 20 to support modern dependencies (like `@tailwindcss/oxide`).
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**c. Install Global Process Manager (PM2):**
Installed PM2 to keep the Node.js web server running continuously in the background.
```bash
sudo npm install -g pm2
```

### 5. Codebase Setup and Verification
- Pulled the latest application code from the GitHub repository (`git pull origin master`).
- Installed the required node modules and backend dependencies:
```bash
npm install
```
> **[Placeholder: Insert Screenshot of successful GitHub pull and npm install here]**

### 6. Build and Run the Application
Compiled the Next.js application into an optimized production build and started it using the PM2 daemon.
```bash
npm run build
pm2 start npm --name "medmcq" -- start
pm2 save
```
> **[Placeholder: Insert Screenshot of successful Next.js build and the PM2 active process list here]**

### 7. Port Configuration (iptables)
By default, the Next.js application runs on Port 3000. To make it publicly accessible via standard web browsing (Port 80) without adding the port number to the URL, an `iptables` NAT routing rule was applied:
```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
```

### 8. Troubleshooting and Fixes Applied
During deployment, the following adjustments were necessary:
- **Dependency Conflicts:** Fixed a configuration mismatch between Tailwind CSS version 3 and version 4 rules in `globals.css` and `postcss.config.mjs`.
- **Next.js Router Restrictions:** Refactored the `authOptions` object out of the Next.js App Router API `route.js` into a dedicated file to satisfy strict routing type exports.
- **UI Visibility:** Adjusted Tailwind CSS classes to explicitly enforce dark text against white backgrounds for better legibility on the practice and authentication views.

### Deployment URL (Part-I)
**Application Live URL:** `http://54.209.70.76/`

---

## Part-II: Elastic Beanstalk Deployment (PaaS Model)

The following steps document the deployment of the MedMCQ Platform using AWS Elastic Beanstalk, a Platform as a Service (PaaS) model that abstracts the underlying infrastructure management.

### 1. Preparation of Application Code Bundle
- Since Elastic Beanstalk handles the environment setup, the local Next.js project was packaged into a clean Deployment ZIP bundle (`medmcq-eb-bundle.zip`) using Git. This ensured that local development files (`node_modules`, `.next`) were intentionally excluded to optimize the upload and build process.
> **[Placeholder: Insert Screenshot of the local deployment zip archive here]**

### 2. Create the Elastic Beanstalk Environment
- Navigated to the AWS Elastic Beanstalk console and initiated the creation of a new **Web server environment**.
- **Application Name:** `MedMCQ-Platform`
- **Platform:** Selected **Node.js** (e.g., Node.js 20 running on 64bit Amazon Linux 2023) as the environment platform to support the Next.js framework.
> **[Placeholder: Insert Screenshot of the Elastic Beanstalk "Select platform" configuration here]**

### 3. Upload Application Code to Amazon S3
- In the "Application code" section, selected **Upload your code**.
- Chose the Local file option and uploaded the `medmcq-eb-bundle.zip` generated earlier. AWS automatically provisions an **Amazon S3** bucket to safely store this application version.
- **Version label:** `v1-initial-deployment`.
> **[Placeholder: Insert Screenshot of the "Upload your code" section showing the zip file here]**

### 4. Configure Environment Properties (Variables)
- Clicked on **Configure more options** before creating the environment to ensure the Database works.
- Navigated to the **Software** settings to define key Environment properties needed by the application (e.g., `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
> **[Placeholder: Insert Screenshot of the Environment properties configuration here]**

### 5. Review and Launch
- Reviewed all configurations and clicked **Create environment**.
- Elastic Beanstalk began provisioning the underlying EC2 instances, setting up the Auto Scaling group, configuring the load balancer, and securely deploying the uploaded code from S3.
> **[Placeholder: Insert Screenshot of the "Environment launching" events page here]**

### 6. Troubleshooting and Resolution (Health Degraded)
During the initial deployment, the environment health was reported as **Degraded**. The following manual troubleshooting steps were performed to resolve the issue:

**a. Manual Log Analysis via SSH:**
Connected directly to the underlying EC2 instance via SSH to inspect the deployment logs:
```bash
ssh -i "med mcqs.pem" ec2-user@[Instance-IP]
sudo tail -n 100 /var/log/eb-engine.log
```
The logs identified a critical failure during the extraction phase: *"appears to use backslashes as path separators"*. This confirmed that the ZIP created on a Windows environment was incompatible with the Linux `unzip` utility used by Elastic Beanstalk.

**b. Next.js Standalone Mode Optimization:**
To optimize the deployment and reduce the memory overhead of `npm install` on the target server, "Standalone" output was enabled in `next.config.js`:
```javascript
module.exports = {
  output: 'standalone',
}
```
This generates a self-contained `server.js` and a minimal `node_modules` folder, significantly improving deployment reliability on PaaS environments.

**c. Linux-Native Build Pipeline:**
To resolve the path separator issue and ensure cross-platform binary compatibility, the application was built directly on a Linux environment (the EB EC2 instance):
1. Cloned the repository on the Linux instance.
2. Installed dependencies and ran the production build: `npm install && npm run build`.
3. Packaged the `.next/standalone` output into a deployment ZIP using native Linux `zip` commands.
4. Uploaded the final Linux-native bundle to S3 and redeployed.

### 7. Final Verification
- Once the manual build was deployed, the Elastic Beanstalk Health transitioned to **Ok (Green)**.
- Verified that all environment properties were correctly loaded and the application served traffic successfully.
> **[Placeholder: Insert Screenshot of the final Green Health Dashboard here]**

### Deployment URL (Part-II)
**Application Live URL:** `http://medmcq-platform-env.eba-xxxxxx.us-east-1.elasticbeanstalk.com/`
