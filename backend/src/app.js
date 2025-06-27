import express from 'express';
import cors from 'cors';
import connectDB from '../database/db.js';
import authRouter from '../routers/auth.routers.js';
import customerRouter from '../routers/customer.routers.js';
import employeeRouter from '../routers/employee.routers.js';
import solicitudRouter from '../routers/solicitud.router.js';
import userRouter from '../routers/user.router.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.send('Welcome to the Employee Management Paul');
});

app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/solicitud', solicitudRouter);
app.use('/users', userRouter);

export default app;
