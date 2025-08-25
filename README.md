# DevOps Internship Assessment – Todo List Node.js Application

## Overview

This repository contains the DevOps Internship Assessment solution for the **Todo-List Node.js application**. The assessment demonstrates skills in:

* **Dockerization** of Node.js applications
* **CI/CD automation** using GitHub Actions
* **Infrastructure provisioning and configuration** using Ansible
* **Application deployment and orchestration** using Docker Compose and Kubernetes
* **Continuous image updates** from a private Docker registry
* **GitOps practices** with ArgoCD (Bonus)

The solution is divided into **four parts**, each addressing specific DevOps practices.

---

## Part 1: Dockerization & CI Pipeline (30 points)

**Objective:** Dockerize the application and automate the build/push process using GitHub Actions.

### Steps Taken:

1. **Cloned the repository**:

```bash
git clone https://github.com/Ankit6098/Todo-List-nodejs
cd Todo-List-nodejs
```

2. **Configured MongoDB database**:

* Created a personal MongoDB instance (local or Atlas).
* Updated `.env` file with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app
PORT=3000
```

3. **Dockerized the application**:

* Created `Dockerfile`:

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

4. **Built and tested Docker image locally**:

```bash
docker build -t todo-app:latest .
docker run -p 3000:3000 todo-app:latest
```

5. **Created GitHub Actions CI pipeline**:

* `.github/workflows/ci.yml` automates build and push to private Docker registry:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Log in to Docker Registry
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and Push Docker Image
        run: |
          docker build -t my-private-registry/todo-app:latest .
          docker push my-private-registry/todo-app:latest
```

---

## Part 2: VM Provisioning & Configuration (30 points)

**Objective:** Provision a Linux VM and configure it using Ansible.

### Steps Taken:

1. **Created Linux VM**:

* Options: Local VirtualBox VM or Cloud VM (AWS EC2 t2.micro, Ubuntu 22.04).

2. **Installed required packages on VM using Ansible**:

* Local machine runs Ansible playbooks against the VM.

**Example playbook (`setup-vm.yml`)**:

```yaml
- name: Configure Linux VM for Todo App
  hosts: todo-vm
  become: true
  tasks:
    - name: Update apt repositories
      apt:
        update_cache: yes

    - name: Install Docker
      apt:
        name: docker.io
        state: present

    - name: Install Docker Compose
      apt:
        name: docker-compose
        state: present
```

3. **Inventory file (`hosts.ini`)**:

```ini
[todo-vm]
vm_ip_address ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

---

## Part 3: Application Deployment with Docker Compose & Auto Updates (40 points)

**Objective:** Deploy the app on the VM using Docker Compose and implement auto-update for image changes.

### Steps Taken:

1. **Created `docker-compose.yml`**:

```yaml
version: "3.8"
services:
  todo-app:
    image: my-private-registry/todo-app:latest
    ports:
      - "3000:3000"
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      retries: 3
```

2. **Run the application on VM**:

```bash
docker-compose up -d
```

3. **Implement continuous image updates**:

* Used **Watchtower** for automatic image updates from Docker registry:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 60
```

* Watchtower polls registry every 60 seconds, pulls new images, and restarts containers automatically.

---

## Part 4 – Bonus: Kubernetes & ArgoCD (50 points)

**Objective:** Replace Docker Compose with Kubernetes and implement GitOps deployment.

### Steps Taken:

1. **Installed Minikube / K3s on VM** for lightweight Kubernetes cluster.

2. **Created Kubernetes manifests** (`deployment.yaml`, `service.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-app
  template:
    metadata:
      labels:
        app: todo-app
    spec:
      containers:
      - name: todo-app
        image: my-private-registry/todo-app:latest
        ports:
        - containerPort: 3000
```

3. **Configured ArgoCD** for continuous deployment from Git repository.

* ArgoCD monitors repo → automatically deploys changes to Kubernetes cluster.

---

## Assumptions

* MongoDB URI is provided by the user.
* Private Docker registry credentials are stored as GitHub Secrets.
* VM is accessible via SSH from local machine running Ansible.

---

## Tools & Technologies

**Key Skills Applied:**

* CI/CD: GitHub Actions, Watchtower
* Containerization: Docker, Docker Compose
* Infrastructure Automation: Ansible, Linux CLI
* Cloud / Virtualization: AWS EC2, VirtualBox, Minikube/K3s
* Orchestration & GitOps: Kubernetes, ArgoCD
* Monitoring & Health Checks: Docker healthchecks

---

## How to Run

1. Clone repo and configure `.env`
2. Build and run Docker image locally (Part 1)
3. Provision VM and configure using Ansible (Part 2)
4. Deploy using Docker Compose or Kubernetes (Parts 3 & 4)
5. Ensure Watchtower or ArgoCD handles continuous updates

---

<img width="1366" height="768" alt="Screenshot (292)" src="https://github.com/user-attachments/assets/43bee0aa-d3ce-4b1a-aadf-3d813e8a7be0" />
<img width="1366" height="768" alt="Screenshot (322)" src="https://github.com/user-attachments/assets/4257fb56-b56b-49af-81ed-ccea103379f5" />

<img width="1366" height="768" alt="Screenshot (300)" src="https://github.com/user-attachments/assets/5b044d0d-86ce-49c6-8761-26f9c39b1bba" />
<img width="1366" height="768" alt="Screenshot (299)" src="https://github.com/user-attachments/assets/3270b2aa-2372-4cc5-bcc4-45086a74cc66" />
<img width="1366" height="768" alt="Screenshot (298)" src="https://github.com/user-attachments/assets/b36b5022-1458-4ce1-bfe2-15992a4c2360" />
<img width="1366" height="768" alt="Screenshot (297)" src="https://github.com/user-attachments/assets/8d64b97f-cad7-407d-b090-742e8e48be7b" />
<img width="1366" height="768" alt="Screenshot (296)" src="https://github.com/user-attachments/assets/4b8f742f-284d-4f87-8e38-676601a7ce1f" />


<img width="1366" height="768" alt="Screenshot (307)" src="https://github.com/user-attachments/assets/c881d5a9-b726-46f7-a1ab-99cccbd107bc" />
<img width="1366" height="768" alt="Screenshot (306)" src="https://github.com/user-attachments/assets/4cee54da-139b-46f1-b768-edeb70b72cb6" />
<img width="1366" height="768" alt="Screenshot (305)" src="https://github.com/user-attachments/assets/a6855ed1-5c35-411a-aedf-ce87f69edd0f" />
<img width="1366" height="768" alt="Screenshot (304)" src="https://github.com/user-attachments/assets/97fffa8f-e733-4849-8201-a828dd5a8afe" />
<img width="1366" height="768" alt="Screenshot (303)" src="https://github.com/user-attachments/assets/3535a7c5-9e42-4fd6-9eeb-d750871abb3a" />
<img width="1366" height="768" alt="Screenshot (302)" src="https://github.com/user-attachments/assets/a74ffeb7-d337-44a6-b5b1-837e5e81836a" />


<img width="1366" height="768" alt="Screenshot (312)" src="https://github.com/user-attachments/assets/d22e9c87-4255-4443-ad9a-120e0a820be6" />
<img width="1366" height="768" alt="Screenshot (311)" src="https://github.com/user-attachments/assets/f8186e4f-7c52-499f-a875-b6875d5d435c" />
<img width="1366" height="768" alt="Screenshot (310)" src="https://github.com/user-attachments/assets/5a539bba-b516-4571-99b4-12bac02405c7" />





