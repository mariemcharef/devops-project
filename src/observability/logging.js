export const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const log = {
      time: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      traceId: req.traceId,
      durationMs: Date.now() - start
    };

    console.log(JSON.stringify(log));
  });

  next();
};
