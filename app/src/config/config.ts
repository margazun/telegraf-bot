import rc from 'rc';
import { ConfigT } from "../types/config";

export function getConfig(name:string): ConfigT {
  const config = rc(name);
  if (!config) {
    try {
      return <ConfigT>{
        bot: {
          token: <string>process.env.TOKEN,
          name: <string>process.env.BOTNAME
        }
      }
    } catch (err) {
      throw new Error(`No envirements.`);
    }
    throw new Error(`Config by name ${name} not found.`);
  }
  return <ConfigT>config;
}

export const config = getConfig('.env_');