import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT | 8000;
const uwApiKey = process.env.UW_API_KEY;
const uwBackendUrl = process.env.UW_API_URL;
const env = process.env.NODE_ENV;

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
