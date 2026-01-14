import express from "express";
import { tracingMiddleware } from "./observability/tracing.js";
import { loggingMiddleware } from "./observability/logging.js";
import { metricsMiddleware, metricsEndpoint } from "./observability/metrics.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  res.setHeader('Referrer-Policy', 'strict-no-referrer');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
});

app.use(express.json());

app.use(tracingMiddleware);
app.use(loggingMiddleware);
app.use(metricsMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/metrics", metricsEndpoint);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;
