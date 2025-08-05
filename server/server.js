import express from 'express';
import "dotenv/config";
import cors  from 'cors';
import http from 'http';
import { connect } from 'http2';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';

// create express app and http server 

const app = express();
const server  = http.createServer(app);

// middlewares setup 

app.use(express.json({limit: '4mb'}));
app.use(cors());


// Routes setup 
app.use("/api/status" , (req, res) => res.send("Server is live"));
app.use("/api/auth",userRouter);

// connect to MongoDB 
await connectDB();

const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));