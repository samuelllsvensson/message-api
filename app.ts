import { Request, Response, Application } from "express";
import express from "express";
import bodyParser from "body-parser";
import { LastFetchedTimes, Messages } from "./types";

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());

let messages: Messages = {};
let lastFetchedTimes: LastFetchedTimes = {}; // Used to track the time separately for each recipient.

// 1. Send message to client
app.post("/message", (req: Request, res: Response) => {
  const { recipient, message } = req.body;
  if (!messages[recipient]) {
    messages[recipient] = [];
  }
  messages[recipient].push({ message, timestamp: new Date() });
  res.status(200).send("Message sent.");
});

// 2. Fetch new messages (since last fetch)
app.get("/message/:recipient", (req: Request, res: Response) => {
  const recipient = req.params.recipient;

  if (!messages[recipient]) {
    return res.status(404).send("Recipient not found.");
  }

  // First time fetching messages we set an old date to fetch all messages
  if (!lastFetchedTimes[recipient]) {
    lastFetchedTimes[recipient] = new Date(0);
  }

  const newMessages = (messages[recipient] || []).filter((msg) => {
    return new Date(msg.timestamp) > lastFetchedTimes[recipient];
  });

  // Update the last fetched time for the recipient
  lastFetchedTimes[recipient] = new Date();

  if (newMessages.length > 0) {
    return res.status(200).json(newMessages);
  } else {
    return res.status(404).send("No new messages");
  }
});

// 3. Remove 1 or more messages from a recipient
app.delete("/message/:recipient", (req: Request, res: Response) => {
  const recipient = req.params.recipient;
  const indexes: number[] = req.body.indexes;
  if (!messages[recipient]) {
    return res.status(404).send("Recipient not found.");
  }
  messages[recipient] = messages[recipient].filter(
    (_, index) => !indexes.includes(index)
  );
  return res.status(200).send("Messages deleted.");
});

// 4. Fetch messages between start and stop indexes
app.get("/messages/:recipient", (req: Request, res: Response) => {
  const recipient = req.params.recipient;

  const start = parseInt(req.query.start as string, 10) || 0;
  const stop =
    parseInt(req.query.stop as string, 10) ||
    (messages[recipient] ? messages[recipient].length : 0);

  const recipientMessages = messages[recipient] || [];
  if (messages[recipient].length > 0) {
    const selectedMessages = recipientMessages.slice(start, stop);
    return res.status(200).json(selectedMessages);
  } else {
    return res.status(404).send("No messages");
  }
});

app.listen(port, () => {
  console.log(`Message service listening at http://localhost:${port}`);
});
