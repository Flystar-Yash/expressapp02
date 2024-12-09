import * as gcp from "@pulumi/gcp";

// Create Pub/Sub topic
const pubSubTopic = new gcp.pubsub.Topic("button-click-topic");

// Create Cloud Run service
const cloudRunService = new gcp.cloudrun.Service("button-click-service", {
  location: "us-central1",
  template: {
    spec: {
      containers: [{
        image: "gcr.io/<your-project-id>/express-rate-limit",
      }],
    },
  },
});

// Set IAM policy for Cloud Run to publish to Pub/Sub
new gcp.cloudrun.IamMember("cloud-run-publisher", {
  service: cloudRunService.name,
  location: cloudRunService.location,
  role: "roles/pubsub.publisher",
  member: "serviceAccount:" + cloudRunService.defaultServiceAccount,
});

