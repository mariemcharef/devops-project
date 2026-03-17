import express from "express";
import { tracingMiddleware } from "./observability/tracing.js";
import { loggingMiddleware } from "./observability/logging.js";
import { metricsMiddleware, metricsEndpoint } from "./observability/metrics.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use((req, res, next) => {
  //Remove the X-Powered-By header to obscure server information.
  res.removeHeader('X-Powered-By');

  //Protects against MIME-type confusion attacks (e.g., uploading malicious scripts disguised as images).
  res.setHeader('X-Content-Type-Options', 'nosniff');

  //Prevents your site from being embedded in an <iframe> on another site.
  //Protects against clickjacking attacks.
  res.setHeader('X-Frame-Options', 'DENY');

  //Tells browsers to only use HTTPS for your site for the next year (31536000 seconds = 1 year).
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  //Very powerful security header: Content Security Policy (CSP).
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");

  //Restricts browser features and APIs:
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  
  //Controls what the browser sends in the Referer header.
  res.setHeader('Referrer-Policy', 'strict-no-referrer');


  //Prevents sensitive data from being cached in browsers or proxies.
  //Important for things like authentication, personal info, or banking apps.
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
