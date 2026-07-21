import { exchangeHelper, linkCreateToken } from "../services/PlaidService"
import { Request, Response } from "express";

export async function exchangePublicToken(req:Request, res:Response){
    console.log("exchange public token starting now")
    try{
        const publicToken = req.body.public_token;
        const response = await exchangeHelper(publicToken)
        res.json(response)
        console.log("response exchange", res)
    }catch(e){
        res.status(500).json({error: "Failed to exchange public token for access token"})
    }
}

export async function getLinkToken(req:Request, res:Response){
    try{
        const response = await linkCreateToken();
        res.json({link_token: response});
    }catch(e){
        res.status(500).json({error: "Failed to create Plaid link token"})
    }
}