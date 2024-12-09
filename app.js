const express = require('express');
const bodyParser = require('body-parser');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { PubSub } = require('@google-cloud/pubsub');
const app = express();
const port = process.env.PORT || 8080;

// Initialize Pub/Sub client
const pubSubClient = new PubSub();
const topicName = 'button-click-topic';  // Replace with your actual topic name

// Rate limiters for Blue and Red buttons (max 10 clicks per minute)
const rateLimiterBlue = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

const rateLimiterRed = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS for buttons)
app.use(express.static('public'));

// Log button click in the database (simplified for this task)
let buttonClickLog = [];

// Utility function to log click
function logClick(button, userIp) {
  const timestamp = new Date().toISOString();
  buttonClickLog.push({ button, timestamp, userIp });
  console.log(`${button} button clicked at ${timestamp} from IP: ${userIp}`);
}

// Route to handle Blue Button clicks
app.post('/click-blue', async (req, res) => {
  const userIp = req.ip;

  try {
    await rateLimiterBlue.consume(userIp);  // Check rate limit for blue button

    // Log the click in the "database"
    logClick('Blue', userIp);

    res.json({ message: 'Blue button clicked!', limitStatus: 'OK' });
  } catch (rejRes) {
    // Rate limit exceeded for Blue button
    res.status(429).json({ message: 'Rate limit exceeded for Blue button', limitStatus: 'Exceeded' });

    // Publish event to Pub/Sub
    const message = JSON.stringify({ button: 'Blue', userIp, timestamp: new Date().toISOString() });
    await pubSubClient.topic(topicName).publish(Buffer.from(message));
  }
});

// Route to handle Red Button clicks
app.post('/click-red', async (req, res) => {
  const userIp = req.ip;

  try {
    await rateLimiterRed.consume(userIp);  // Check rate limit for red button

    // Log the click in the "database"
    logClick('Red', userIp);

    res.json({ message: 'Red button clicked!', limitStatus: 'OK' });
  } catch (rejRes) {
    // Rate limit exceeded for Red button
    res.status(429).json({ message: 'Rate limit exceeded for Red button', limitStatus: 'Exceeded' });

    // Publish event to Pub/Sub
    const message = JSON.stringify({ button: 'Red', userIp, timestamp: new Date().toISOString() });
    await pubSubClient.topic(topicName).publish(Buffer.from(message));
  }
});

// Serve HTML page with two buttons
app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
