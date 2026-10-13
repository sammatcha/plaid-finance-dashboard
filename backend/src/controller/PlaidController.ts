import { exchangeHelper, fetchTransactions, getAccounts, getPlaidErrorCode, linkCreateToken, linkCreateUpdateToken } from "../services/PlaidService"
import { Request, Response } from "express";

export async function exchangePublicToken(req:Request, res:Response){
    try{
        const publicToken = req.body.public_token;
        const response = await exchangeHelper(publicToken)
        res.json(response)
    }catch(e){
        console.error("Failed to exchange public token for access token", e)
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

export async function getUpdateLinkToken(req:Request, res:Response){
    try{
        const response = await linkCreateUpdateToken();
        res.json({link_token: response});
    }catch(e){
        console.error("Failed to create Plaid update link token", e)
        res.status(500).json({error: "Failed to create Plaid update link token"})
    }
}

export async function getTransactions(req:Request, res:Response){
    try{
        const response = await fetchTransactions();
        res.json(response)
    }catch(e){
        const errorCode = getPlaidErrorCode(e)
        if (errorCode === "ITEM_LOGIN_REQUIRED") {
            res.status(401).json({error_code: "ITEM_LOGIN_REQUIRED"})
            return
        }
       res.status(500).json({error: "Failed to grab data from Plaid"})
    }
}

export async function getAccountsData(req:Request, res:Response){
    try{
        const response = await getAccounts()
        res.json(response)
    }catch(e){
        console.error("Failed to get accounts", e)
        const errorCode = getPlaidErrorCode(e)
        if (errorCode === "ITEM_LOGIN_REQUIRED") {
            res.status(401).json({error_code: "ITEM_LOGIN_REQUIRED"})
            return
        }
        res.status(500).json({error: "Failed to get accounts"})
    }
}

