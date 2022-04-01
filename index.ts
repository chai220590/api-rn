import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import UserRouter from "./entities/user/router.user";
import connectDB from "./services/connectDB";

const swaggerDocument = require(`${__dirname.replace(
  "public",
  "swagger.json"
)}`);

connectDB();

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routers
app.use("/api/user", UserRouter);

app.listen(process.env.PORT || 3000);
