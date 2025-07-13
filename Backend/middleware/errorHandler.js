import mongoose from 'mongoose';

// console.log(mongoose.Error.ValidationError);

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Handle duplicate key errors (MongoDB)
  if (err.code && err.code === 11000) {
    statusCode = 409;
    message = `Duplicate key error: ${JSON.stringify(err.keyValue)}`;
  }

  // Optionally, add more error type handling here

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;
