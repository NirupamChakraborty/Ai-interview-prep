import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { connectDB } from './src/config/db.js';
import authRouter from './src/routes/auth.routes.js';
import interviewRouter from './src/routes/interview.routes.js';



const app = express();
const PORT = process.env.PORT || 8005;

app.use(express.json())
app.use(cookieParser())
// app.use(cors()) // to allow cross-origin requests from the client //Access-Control-Allow-Origin error
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );


app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter)



app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});




app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});


