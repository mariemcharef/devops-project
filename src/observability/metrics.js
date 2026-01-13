import client from "prom-client";

client.collectDefaultMetrics();

export const httpCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

export const metricsMiddleware = (req, res, next) => {
  res.on("finish", () => {
    httpCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
};

export const metricsEndpoint = async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};
