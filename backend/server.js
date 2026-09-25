const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const productionRoutes = require('./routes/production');
const storageRoutes = require('./routes/storage');
const shipmentRoutes = require('./routes/shipments');
const { requireAuth } = require('./middleware/auth');
const resourceRouter = require('./routes/resource');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
const Notification = require('./models/Notification');
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8443', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

app.use(
  cors({
    origin: ['http://localhost:8443', 'http://localhost:5173'],
    credentials: true
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/production', requireAuth, productionRoutes);
app.use('/api/storage', requireAuth, storageRoutes);
app.use('/api/shipments', requireAuth, shipmentRoutes);
app.use('/api/orders', requireAuth, resourceRouter(Order, { ownerOnly: true }));
app.use('/api/deliveries', requireAuth, resourceRouter(Delivery));
app.use('/api/notifications', requireAuth, resourceRouter(Notification, { ownerOnly: true, ownerField: 'userId' }));
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/analytics', requireAuth, analyticsRoutes);
app.get('/', (req, res) => {
  res.json({
    message: 'Hydrogen Tracker API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected'
  });
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

function watchCollection(model, resource) {
  try {
    const stream = model.watch([], { fullDocument: 'updateLookup' });
    stream.on('change', change => {
      io.emit(`${resource}:changed`, {
        operationType: change.operationType,
        document: change.fullDocument,
        documentKey: change.documentKey
      });
    });
    stream.on('error', error => {
      console.warn(`Change streams unavailable for ${resource}: ${error.message}`);
      stream.close().catch(() => {});
    });
  } catch (error) {
    console.warn(`Change streams unavailable for ${resource}: ${error.message}`);
  }
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/hydrogen-tracker-new'
  )
  .then(() => {
    console.log('MongoDB connected');

    const Production = require('./models/Production');
    const Storage = require('./models/Storage');
    const Shipment = require('./models/Shipment');
    watchCollection(Production, 'production');
    watchCollection(Storage, 'storage');
    watchCollection(Shipment, 'shipments');
    watchCollection(Order, 'orders');
    watchCollection(Delivery, 'deliveries');
    watchCollection(Notification, 'notifications');

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error(
      'MongoDB connection failed:',
      error.message
    );
  });