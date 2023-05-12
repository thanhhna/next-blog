import Ably from 'ably/promises';

export default async function handler(req: any, res: any) {
  const ably = await new Ably.Rest.Promise({ key: process.env.ABLY_API_KEY });
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: 'planning-poker'
  });
  res.json(tokenRequest);
}
