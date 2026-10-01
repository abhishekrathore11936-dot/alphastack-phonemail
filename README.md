# PhoneMail 📱📧

Welcome to **PhoneMail**, a full-stack application developed for the Alphastack Buildathon. PhoneMail bridges mobile client interactions with a robust backend service, fully containerized for seamless deployment.

---

## 🏗️ Project Architecture & Structure

The repository is organized into a modular full-stack layout:

* **`mobile-client/`**: The mobile application interface connecting users to the service.
* **`phonemail-backend/`**: The core backend server handling API requests, business logic, and communication routing.
* **`docker-compose.yml`**: Orchestrates container deployment across services.
* **`.env`**: Environment configuration file for managing secure credentials.

---

## 🚀 Getting Started & Running Locally

To run the complete full-stack environment using Docker, ensure you have Docker installed on your machine, then run:

```bash
# Clone the repository
git clone [https://github.com/abhishekrathore11936-dot/alphastack-phonemail.git](https://github.com/abhishekrathore11936-dot/alphastack-phonemail.git)
cd alphastack-phonemail

# Build and start all containers
docker-compose up --build

## 🛠️ Tech Stack

* **Backend:** Node.js / Containerized API (`phonemail-backend`)
* **Client:** Mobile client interface (`mobile-client`)
* **DevOps & Deployment:** Docker & Docker Compose
