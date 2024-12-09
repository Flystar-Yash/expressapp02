import * as gcp from "@pulumi/gcp";

// Create Pub/Sub Topic
const pubsubTopic = new gcp.pubsub.Topic("rate-limit-exceeded");

// Create Cloud Run Service
const cloudRunService = new gcp.cloudrun.Service("express-cloud-app", {
  location: "us-central1",
  template: {
    spec: {
      containers: [
        {
          image: "gcr.io/your-project-id/express-cloud-app:latest",
          envs: [{ name: "TOPIC_NAME", value: pubsubTopic.name }],
        },
      ],
    },
  },
});

export const serviceUrl = cloudRunService.status.url;

