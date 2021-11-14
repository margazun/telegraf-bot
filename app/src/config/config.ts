import rc from 'rc';
import { ConfigT } from "../types/config";
import { config as configD } from "dotenv";

configD();

export function getConfig(name:string): ConfigT {
  if (process.env.TOKEN && process.env.BOTNAME) {
    return <ConfigT>{
        bot: {
          token: process.env.TOKEN,
          name: process.env.BOTNAME
        }
      }
  }
  const config = rc(name);
  if (!config) {
    throw new Error(`Config by name ${name} not found.`);
  }
  return <ConfigT>config;
}

export const config = getConfig('.env_');