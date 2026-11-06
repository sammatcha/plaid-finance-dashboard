import { timingSafeEqual } from "crypto";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { exchangePublicToken, getAccountsData, getLinkToken, getTransactions, getUpdateLinkToken } from "./controller/PlaidController";
import { fetchBudget } from "./controller/BudgetController";
import { ensureSchema } from "./db";
import { checkDemoUserHealth } from "./services/PlaidService";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

function isDeepHealthAuthorized(authorization: string | undefined): boolean {
  const expected = process.env.HEALTH_CHECK_TOKEN;
  if (!expected || !authorization?.startsWith("Bearer ")) {
    return false;
  }

  const given = authorization.slice("Bearer ".length);
  const expectedBuffer = Buffer.from(expected);
  const givenBuffer = Buffer.from(given);
  if (expectedBuffer.length !== givenBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, givenBuffer);
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/deep", async (req, res) => {
  if (!isDeepHealthAuthorized(req.header("authorization"))) {
    res.status(401).json({ ok: false });
    return;
  }

  const reason = await checkDemoUserHealth();
  if (reason) {
    res.status(503).json({ ok: false, reason });
    return;
  }

  res.json({ ok: true });
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
