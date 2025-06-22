import Ably from 'ably';
import { v4 as uuid } from 'uuid';

export default async function handler(req: any, res: any) {
  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: uuid()
  });
  res.json(tokenRequest);
}
