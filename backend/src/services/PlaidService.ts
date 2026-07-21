
import { SandboxPublicTokenCreateRequest , ItemPublicTokenExchangeRequest, LinkTokenCreateRequest} from "plaid";
import { plaidClient } from "../plaid";
import { Products, CountryCode } from "plaid";

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