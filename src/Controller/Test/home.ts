import { Request, Response } from "express";

const home = async (req: Request, res: Response) => {
    res.send("Get rc data server is up and running");
}

export default home;