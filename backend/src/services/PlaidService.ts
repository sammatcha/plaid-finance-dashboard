
import { SandboxPublicTokenCreateRequest , ItemPublicTokenExchangeRequest, LinkTokenCreateRequest, AccountsGetRequest} from "plaid";
import { plaidClient } from "../plaid";
import { Products, CountryCode } from "plaid";
import { db } from "../db";

export function getPlaidErrorCode(error: unknown): string | undefined {
    if (error && typeof error === "object" && "response" in error) {
        const data = (error as { response?: { data?: { error_code?: string } } }).response?.data
        return data?.error_code
    }
}

//helper
export async function getAccessTokenForUser(){
    const row = await db
    .selectFrom("plaid_items")
    .select("access_token")
    .where("user_id", "=", "test-user-1")
    .executeTakeFirst();

     if (!row?.access_token){
        throw new Error("No access token found for user");
    }
    return row?.access_token
}

const tokenInvalidCodes = new Set([
    "ITEM_LOGIN_REQUIRED",
    "INVALID_ACCESS_TOKEN",
    "ITEM_NOT_FOUND",
])

export type DemoHealthReason =
    | "user_missing"
    | "token_invalid"
    | "empty_data"
    | "db_unavailable"
    | "plaid_unavailable"

export async function checkDemoUserHealth(): Promise<DemoHealthReason | undefined> {
    let accessToken: string
    try {
        const row = await db
            .selectFrom("plaid_items")
            .select("access_token")
            .where("user_id", "=", "test-user-1")
            .executeTakeFirst()

        if (!row?.access_token) {
            return "user_missing"
        }
        accessToken = row.access_token
    } catch (error) {
        console.error("Deep health check failed to read the demo user", error)
        return "db_unavailable"
    }

    try {
        const request: AccountsGetRequest = {
            access_token: accessToken,
        }
        const response = await plaidClient.accountsGet(request, { timeout: 10_000 })
        if (response.data.accounts.length === 0) {
            return "empty_data"
        }
    } catch (error) {
        const errorCode = getPlaidErrorCode(error)
        if (errorCode !== undefined && tokenInvalidCodes.has(errorCode)) {
            return "token_invalid"
        }
        console.error("Deep health check failed to reach Plaid", error)
        return "plaid_unavailable"
    }
}

export async function createSandboxPublicToken(){
const institutionID= "ins_109508";
const publicTokenRequest: SandboxPublicTokenCreateRequest = {
    institution_id: institutionID,
    initial_products: [Products.Transactions],
    }
    try{
        const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate(publicTokenRequest )
        const public_token = publicTokenResponse.data.public_token;
        return public_token;
    }catch(e)
    {
       console.error("error creating public token", e)
       throw e;
    }
}

export async function exchangeHelper(publicToken:string) {
    const exchangeRequest: ItemPublicTokenExchangeRequest = {
    public_token: publicToken
}
try{
    const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(exchangeRequest) 
    const accessToken = exchangeTokenResponse.data.access_token;
    const itemId = exchangeTokenResponse.data.item_id;
    const existing = await db
        .selectFrom("plaid_items")
        .select("id")
        .where("user_id", "=", "test-user-1")
        .executeTakeFirst();

    if (existing) {
        await db
            .updateTable("plaid_items")
            .set({
                access_token: accessToken,
                item_id: itemId,
            })
            .where("id", "=", existing.id)
            .execute();
    } else {
        await db
            .insertInto("plaid_items")
            .values({
                user_id: "test-user-1",
                access_token: accessToken,
                item_id: itemId,
            })
            .execute();
    }
    return accessToken;
}catch(e)
    {
    console.error("error exchanging token", e)
    throw e
    }
}

export async function linkCreateToken(){
        const request: LinkTokenCreateRequest = {
            user: {
                client_user_id: "test-user-1"
            },
            client_name: 'Finance Dashboard App',
            products: [Products.Transactions],
            country_codes: [CountryCode.Us],
            language: 'en',
        };
        try{
            const response =  await plaidClient.linkTokenCreate(request);
            const linkToken = response.data.link_token;
            return linkToken;
        }catch(e){
            console.error("error creating user link token", e)
            throw e
        }
}

export async function linkCreateUpdateToken(){
        const access_token = await getAccessTokenForUser();
        const request: LinkTokenCreateRequest = {
            user: {
                client_user_id: "test-user-1"
            },
            client_name: 'Finance Dashboard App',
            country_codes: [CountryCode.Us],
            language: 'en',
            access_token,
        };
        try{
            const response =  await plaidClient.linkTokenCreate(request);
            return response.data.link_token;
        }catch(e){
            console.error("error creating update link token", e)
            throw e
        }
}

export async function fetchTransactions(){
    const access_token = await getAccessTokenForUser();
    try{
         const response = await plaidClient.transactionsSync({
        access_token: access_token
        
    })
     return response.data.added;
    }catch(e){
        console.error("Failed to fetch transactions", e)
        throw e;
    }
}

export async function getAccounts(){
    const access_token = await getAccessTokenForUser();
    const request: AccountsGetRequest = {
        access_token: access_token
    };
    try{
        const response = await plaidClient.accountsGet(request);
        const accounts = response.data.accounts
        return accounts;
    } catch(e){
        console.error("Failed to get accounts", e)
        throw e;
    }
}