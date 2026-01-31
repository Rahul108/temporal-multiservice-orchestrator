import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVER_B_PORT || 3002;

app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong from Server B', timestamp: new Date().toISOString() });
});

app.post('/process-external', (req, res) => {
  const { data } = req.body;
  const result = {
    original: data,
    enriched: data ? `${data.processed}_ENRICHED` : 'NO_DATA',
    processedBy: 'server-b',
    processedAt: new Date().toISOString()
  };
  res.json({ success: true, result });
});

app.post('/enrich', (req, res) => {
  const { data } = req.body;
  const enrichedData = {
    ...data,
    enrichments: {
      timestamp: new Date().toISOString(),
      score: Math.random() * 100,
      tags: ['processed', 'enriched']
    }
  };
  res.json({ success: true, enrichedData });
});

app.listen(PORT, () => {
  console.log(`Server B running on http://localhost:${PORT}`);
});
