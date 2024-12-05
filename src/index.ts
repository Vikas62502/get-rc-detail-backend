import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
    res.send("Get rc data server is up and running");
});

app.get("/health", (req: Request, res: Response) => {
    res.send("Server is healthy");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});