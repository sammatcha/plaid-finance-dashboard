import cors from "cors";
import "dotenv/config";
import express from "express";
import { exchangePublicToken, getAccountsData, getLinkToken, getTransactions, getUpdateLinkToken } from "./controller/PlaidController";
import { fetchBudget } from "./controller/BudgetController";
import { ensureSchema } from "./db";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/plaid/create-link-token", getLinkToken)
app.get("/plaid/create-update-link-token", getUpdateLinkToken)
app.post("/plaid/exchange-public-token", exchangePublicToken)
app.get("/plaid/transactions", getTransactions)
app.get("/plaid/get-accounts", getAccountsData)
app.get("/budget", fetchBudget)



ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database or create tables", error);
    process.exit(1);
  });
