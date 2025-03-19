import { registerAs } from '@nestjs/config';

export default registerAs('profileCOnfig', () => ({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.PROFILE_API_KEY,
}));
