import twilio from "twilio";
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createService() {
    const service = await client.verify.v2.services.create({
        friendlyName: "My First Verify Service",
    });
    return service
}