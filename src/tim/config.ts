import { required } from "../utils";

const baseUrl = required("APP_BASE_URL").replace(/\/+$/, "");
export const config = {
  clientId: required("DISCORD_CLIENT_ID"),
  clientSecret: required("DISCORD_CLIENT_SECRET"),
  guildId: required("DISCORD_GUILD_ID"),
  jwtSecret: required("JWT_SECRET"),
  baseUrl,
  redirectUri: `${baseUrl}/auth/discord/callback`,
  secureCookies: baseUrl.startsWith("https"),
};
