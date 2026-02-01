import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/authRoutes.js';
import shipmentRoutes from './src/routes/shipmentRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import { initSocket } from './src/utils/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

initSocket(io);
app.set('io', io);

app.use('/auth', authRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
