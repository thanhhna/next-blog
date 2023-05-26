import Ably from 'ably/promises';
import { v4 as uuid } from 'uuid';

export default async function handler(req: any, res: any) {
  const ably = await new Ably.Rest.Promise({ key: process.env.ABLY_API_KEY });
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: uuid()
  });
  res.json(tokenRequest);
}
