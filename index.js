import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectMongoose } from "./src/config/connectDB.js";
import { routes } from "./src/routes/index.js";
// import { apiLimit } from "./services/rateLimit.service";

const app = express();
const port = 3008;
// const corsOptions = {
//   origin: [
//     "http://localhost:8080",
//     "http://localhost:9527",
//     "http://127.0.0.1:5173",
//   ],
// };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(apiLimit);
// cors
app.use(cors());
routes(app);
connectMongoose();
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
