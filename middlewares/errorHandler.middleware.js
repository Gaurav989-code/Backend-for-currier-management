// handel 404 error

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: `Route Not Found - ${req.originalUrl}` });
};

// centralized error handler

export const errorHandler = (err, req, res, next) => {
  console.log("Error", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

