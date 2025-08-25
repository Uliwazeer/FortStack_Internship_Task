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

<img width="1366" height="768" alt="Screenshot (326)" src="https://github.com/user-attachments/assets/3e52277d-3f7a-4ab5-a898-07195778d7ac" />


<img width="1366" height="768" alt="Screenshot (352)" src="https://github.com/user-attachments/assets/13fe352d-911b-4098-9880-84cb2faa1a51" />
<img width="1366" height="768" alt="Screenshot (351)" src="https://github.com/user-attachments/assets/e8ca2d77-6b1e-4361-a115-f3a38f9b5cea" />
<img width="1366" height="768" alt="Screenshot (350)" src="https://github.com/user-attachments/assets/44944e88-50e8-433c-a01b-d4452a5afd02" />
<img width="1366" height="768" alt="Screenshot (349)" src="https://github.com/user-attachments/assets/6b3df725-7625-4989-84ba-e4e12b13ea20" />
<img width="1366" height="768" alt="Screenshot (348)" src="https://github.com/user-attachments/assets/f8098d8d-3f1c-492e-a0f2-f0572a68d825" />
<img width="1366" height="768" alt="Screenshot (347)" src="https://github.com/user-attachments/assets/b636b30d-bb5b-4184-9afa-b3b63417c135" />
<img width="1366" height="768" alt="Screenshot (346)" src="https://github.com/user-attachments/assets/32e48909-24be-4195-84d1-eb14a91228fa" />
<img width="1366" height="768" alt="Screenshot (345)" src="https://github.com/user-attachments/assets/bcf1f2ac-5112-4300-83ab-00e4f8ac1399" />
<img width="1366" height="768" alt="Screenshot (344)" src="https://github.com/user-attachments/assets/f1e42a19-237f-42c5-a94a-08ff7b17af45" />
<img width="1366" height="768" alt="Screenshot (343)" src="https://github.com/user-attachments/assets/2f1c1723-2ab2-4dfb-8225-6864a3b5363a" />
<img width="1366" height="768" alt="Screenshot (342)" src="https://github.com/user-attachments/assets/c87f7f9f-b24c-4f63-a534-87986ea4bee0" />
<img width="1366" height="768" alt="Screenshot (341)" src="https://github.com/user-attachments/assets/0a294777-81b2-424d-a798-3ef437a2d9ec" />
<img width="1366" height="768" alt="Screenshot (340)" src="https://github.com/user-attachments/assets/399b8a23-2701-42c5-b735-b025badc8be0" />
<img width="1366" height="768" alt="Screenshot (339)" src="https://github.com/user-attachments/assets/eada8675-1634-48dc-bd47-9dfa8b916d93" />
<img width="1366" height="768" alt="Screenshot (338)" src="https://github.com/user-attachments/assets/28724566-6d0f-4cf8-994e-cf537329beda" />
<img width="1366" height="768" alt="Screenshot (337)" src="https://github.com/user-attachments/assets/5330f4a4-2895-48b2-bd8a-10353b111217" />


<img width="1366" height="768" alt="Screenshot (336)" src="https://github.com/user-attachments/assets/baf78202-ab65-4b93-8ca4-8d380688d2cc" />
<img width="1366" height="768" alt="Screenshot (335)" src="https://github.com/user-attachments/assets/79faa3bc-6d58-4673-baae-4c0aea3e6ba2" />
<img width="1366" height="768" alt="Screenshot (334)" src="https://github.com/user-attachments/assets/af1e29ef-95ae-4960-adf1-3abccec93b52" />
<img width="1366" height="768" alt="Screenshot (353)" src="https://github.com/user-attachments/assets/fdd9c239-fd4f-4225-a487-f1feb7cd6545" />
<img width="1366" height="768" alt="Screenshot (361)" src="https://github.com/user-attachments/assets/23d140bd-11ec-43a7-8a8f-98d522b4397b" />
<img width="1366" height="768" alt="Screenshot (333)" src="https://github.com/user-attachments/assets/3297b561-10ec-409f-8c9e-a2b1c5567e29" />
<img width="1366" height="768" alt="Screenshot (360)" src="https://github.com/user-attachments/assets/0c6bd5fc-25f0-4f20-869f-929bcf3e9cf4" />
<img width="1366" height="768" alt="Screenshot (332)" src="https://github.com/user-attachments/assets/dd20ccbf-e937-4d73-80fa-b62a9dc3f9bc" />
<img width="1366" height="768" alt="Screenshot (331)" src="https://github.com/user-attachments/assets/967e77f7-8648-4eb6-acfa-762dc1e9bef7" />
<img width="1366" height="768" alt="Screenshot (359)" src="https://github.com/user-attachments/assets/fa98a07f-98ec-4b22-95fb-5f9c8e91fde6" />
<img width="1366" height="768" alt="Screenshot (330)" src="https://github.com/user-attachments/assets/19147909-ddae-421f-9e9e-7ebb062ae44d" />
<img width="1366" height="768" alt="Screenshot (358)" src="https://github.com/user-attachments/assets/1201b4a4-5003-4ecf-b1dd-19b478de1d92" />
<img width="1366" height="768" alt="Screenshot (329)" src="https://github.com/user-attachments/assets/9cc96632-23c1-4d0f-bffa-79fae54dbc6c" />
<img width="1366" height="768" alt="Screenshot (357)" src="https://github.com/user-attachments/assets/397328fb-44fc-401b-a338-a1eef8f891f8" />
<img width="1366" height="768" alt="Screenshot (356)" src="https://github.com/user-attachments/assets/ab674445-3f86-4cf7-b7e1-df53d875bd5b" />
<img width="1366" height="768" alt="Screenshot (328)" src="https://github.com/user-attachments/assets/1bbb2832-4f8b-47cb-8914-7895948b1ce4" />
<img width="1366" height="768" alt="Screenshot (355)" src="https://github.com/user-attachments/assets/ff389ec3-3f6a-4f66-b0b0-a792fe8d56de" />
<img width="1366" height="768" alt="Screenshot (327)" src="https://github.com/user-attachments/assets/32811010-904a-46c5-b049-3a51c8e91d21" />
<img width="1366" height="768" alt="Screenshot (354)" src="https://github.com/user-attachments/assets/d9330d13-32ee-464a-a11b-7ca2814c3e4c" />
