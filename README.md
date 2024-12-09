# express-app
This is a web application built with Node.js and Express. It features two buttons—Blue and Red—each limited to 10 clicks per minute. The application provides:

Rate Limiting: Prevents excessive clicks on each button within a minute.
Logging: Logs button clicks to a database with button color, timestamp, and user IP address.
Notifications: Publishes rate limit events to Google Cloud Pub/Sub.
Deployment: Runs on Google Cloud Run, making it scalable and publicly accessible.
Features
Two Buttons: Users can click the Blue or Red button.
Rate Limiting: Limits each button to 10 clicks per minute per user.
Logging API: Logs clicks in a database with:
Button color
Timestamp
User IP address
Cloud Pub/Sub Integration: Sends rate limit events to Google Cloud Pub/Sub.
User Notifications: Displays a message when the rate limit is reached.
Google Cloud Run Deployment: Hosted as a serverless app for reliability and scalability.
Tech Stack
Backend
Node.js with Express.js: For creating the server and API endpoints.
Redis: For in-memory rate limiting and logging.
Google Cloud Pub/Sub: For publishing rate limit events.
Google Cloud Run: For serverless deployment.
Infrastructure
Pulumi: For automating infrastructure provisioning.
Docker: For containerization.
Prerequisites
A Google Cloud Platform (GCP) project.
Redis instance URL (either managed Redis or self-hosted).
Installed dependencies:
Node.js
Docker
Pulumi CLI
Google Cloud CLI
Setup and Deployment
1. Clone the Repository
bash
Copy code
git clone 
cd 
2. Set Environment Variables
Create a .env file in the root directory with the following variables:

env
Copy code
PORT=8080
PUBSUB_TOPIC=buttonRateLimitTopic
REDIS_URL=redis://localhost:6379
3. Build and Push Docker Image
bash
Copy code
docker build -t gcr.io/express-app02/button-click-app .
docker push gcr.io/express-app02/button-click-app
4. Deploy with Pulumi
Configure Pulumi in Pulumi.dev.yaml:

yaml
Copy code
config:
  project: "express-app02"
  region: "us-central1"
  redisUrl: "redis://localhost:6379"
Run Pulumi:

bash
Copy code
pulumi up
After successful deployment, Pulumi will output the app's public URL.

Local Development
Install dependencies:

bash
Copy code
npm install
Start the application:

bash
Copy code
npm start
Access the app locally at http://localhost:8080.

How It Works
Rate Limiting:

Redis is used to track user interactions with the buttons.
A sorted set (button:ip_address) stores timestamps of clicks, and only timestamps from the last 60 seconds are counted.
Logging:

Each button click is logged in Redis, storing details such as button color, timestamp, and user IP address.
Google Cloud Pub/Sub:

If a user exceeds the click limit, a message is published to the configured Pub/Sub topic. This message includes the button color, user IP, and timestamp.
Notifications:

When the rate limit is reached, a message is displayed to the user in the web interface.
Deployment:

The app is containerized using Docker and deployed to Google Cloud Run. Pulumi automates the setup of the Cloud Run service, Pub/Sub topic, and IAM permissions.
Required IAM Roles
For successful deployment and operation, ensure the following IAM roles are assigned:

Pub/Sub Publisher: To allow the app to publish messages to Pub/Sub.
Cloud Run Invoker: To make the app publicly accessible.
Example Public App URL
https://express01-772769896106.us-central1.run.app/
# expressApp
