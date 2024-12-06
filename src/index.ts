import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./Utils/Database/DatabaseConnect";
import LoginRoutes from "./Routes/LoginRoutes/LoginRoutes";
import DashboardRoutes from "./Routes/DashboardRoutes/DashboardRoutes";
import AdminRoutes from "./Routes/AdminRoutes/AdminRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Utils/Swagger/swaggerSpec";
import home from "./Controller/Test/home";
import health from "./Controller/Test/health";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000,
})
);

// db connection
connectDB();

// swagger conf
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// test routes
app.get("/", home);
app.get("/health", health);


// routes
app.use("/api/login", LoginRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/admin", AdminRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
