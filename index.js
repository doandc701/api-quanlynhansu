import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectMongoose } from "./src/config/connectDB.js";
import { routes } from "./src/routes/index.js";
// import { apiLimit } from "./services/rateLimit.service";
dotenv.config();

const app = express();
const port = 5000;
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:9527"],
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(apiLimit);
// cors
app.use(cors(corsOptions));
routes(app);
connectMongoose();
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
