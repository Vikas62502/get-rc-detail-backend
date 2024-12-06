import { Request, Response } from "express";

const health = async (req: Request, res: Response) => {
    res.send("Server is healthy");
}

export default health;