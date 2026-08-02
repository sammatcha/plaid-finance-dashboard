import { compareBudget } from "../services/BudgetService";
import { Request, Response } from "express";

export async function fetchBudget(req:Request, res:Response) {
    try{
        const response = await compareBudget();
        res.json(response)
    }catch(e) {
        console.error("fetchBudget error:", e)
        res.status(500).json({error: "failed to fetch budget comparison"})
    }
}