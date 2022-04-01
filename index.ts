import express from "express";
const app = express();

app.use("*", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
  });
});

app.listen(process.env.PORT || 3000);
