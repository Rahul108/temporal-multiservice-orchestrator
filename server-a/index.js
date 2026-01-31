import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVER_A_PORT || 3001;

app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong from Server A', timestamp: new Date().toISOString() });
});

app.post('/process-internal', (req, res) => {
  const { data } = req.body;
  const result = {
    original: data,
    processed: data ? data.toUpperCase() : 'NO_DATA',
    processedBy: 'server-a',
    processedAt: new Date().toISOString()
  };
  res.json({ success: true, result });
});

app.post('/validate', (req, res) => {
  const { data } = req.body;
  const isValid = data && data.length > 0;
  res.json({
    valid: isValid,
    message: isValid ? 'Valid' : 'Invalid',
    validatedAt: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server A running on http://localhost:${PORT}`);
});
