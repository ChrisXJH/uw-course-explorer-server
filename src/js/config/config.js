import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
const port = process.env.PORT || 8000;
const uwApiKey = process.env.UW_API_KEY;
const uwBackendUrl = process.env.UW_API_URL;
const secret = process.env.SECRET;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export const MONGO_DB_URI = process.env.MONGO_DB_URI;

export function getEnv() {
  return env;
}

export function getPort() {
  return port;
}

export function getUwApiKey() {
  return uwApiKey;
}

export function getUwBackendUrl() {
  return uwBackendUrl;
}

export function getSecret() {
  return secret;
}
