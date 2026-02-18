import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT ?? 5000);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
