import path from 'path';
import { config as dotEnvConfig } from 'dotenv';

const dirPath = path.dirname(__filename);

// Load .env variables to process
dotEnvConfig({ path: `${dirPath}/.env` });
