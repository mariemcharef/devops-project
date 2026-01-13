import express from "express";
import { tracingMiddleware } from "./observability/tracing.js";
import { loggingMiddleware } from "./observability/logging.js";
import { metricsMiddleware, metricsEndpoint } from "./observability/metrics.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();
app.use(express.json());

app.use(tracingMiddleware);
app.use(loggingMiddleware);
app.use(metricsMiddleware);

app.get("/metrics", metricsEndpoint);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;
