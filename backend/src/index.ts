import cors from "cors";
import "dotenv/config";
import express from "express";
import { exchangePublicToken, getAccountsData, getLinkToken, getTransactions } from "./controller/PlaidController";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/plaid/create-link-token", getLinkToken)
app.post("/plaid/exchange-public-token", exchangePublicToken)
app.get("/plaid/transactions", getTransactions)
app.get("/plaid/get-accounts", getAccountsData)



app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
