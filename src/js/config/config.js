const port = 8000;
const uwApiKey = '';
const uwBackendUrl = 'https://api.uwaterloo.ca/v2';
const env = 'dev';

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
