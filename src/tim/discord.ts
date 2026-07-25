import express from "express";
import { randomBytes } from "node:crypto";
import { config } from "./config";
import { NEXT_COOKIE } from "./middleware";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  cookieOpts,
  signSession,
} from "./session";

const STATE_COOKIE = "rft26_oauth_state";

const timRoutes = express.Router();

const loginErrors: Record<string, string> = {
  not_in_guild: "You must be a member of the Roll For Topic Discord to enter.",
  auth_failed: "Sign-in failed. Please try again.",
};

// The login page — where the gate sends everyone who isn't logged in
timRoutes.get("/login", (req: any, res: any) => {
  res.render("login", {
    title: "Login",
    error: loginErrors[req.query.error] ?? null,
  });
});

// Start the Discord OAuth flow - clicking the login button hits this route
// and redirects to Discord's OAuth page.
timRoutes.get("/discord", (_req: any, res: any) => {
  const state = randomBytes(16).toString("hex");
  res.cookie(STATE_COOKIE, state, { ...cookieOpts, maxAge: 10 * 60 * 1000 });
  res.redirect(
    "https://discord.com/oauth2/authorize?" +
      new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "identify guilds.members.read",
        state,
        prompt: "none",
      }),
  );
});

// Catching the callback from Discord with
// the authorization code and state for comparison
timRoutes.get("/discord/callback", async (req: any, res: any) => {
  if (!req.query.state || req.query.state !== req.cookies[STATE_COOKIE])
    return res.redirect("/auth/login");
  res.clearCookie(STATE_COOKIE);

  try {
    // Send pair (code, client_secret) to Discord in exchange for an access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: config.redirectUri,
      }),
    });
    if (!tokenRes.ok) return res.redirect("/auth/login?error=auth_failed");
    const { access_token } = (await tokenRes.json()) as any;

    // Ask Discord for their member record in RfT — this also tells us who they are
    const bearer = { headers: { Authorization: `Bearer ${access_token}` } };
    const memberRes = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${config.guildId}/member`,
      bearer,
    );
    if (!memberRes.ok) return res.redirect("/auth/login?error=not_in_guild");
    const { user } = (await memberRes.json()) as any;

    // Sign a session cookie
    const jwt = await signSession({ id: user.id, username: user.username });
    res.cookie(SESSION_COOKIE, jwt, {
      ...cookieOpts,
      maxAge: SESSION_MAX_AGE_MS,
    });

    // Back to the page they originally asked for
    const next = req.cookies[NEXT_COOKIE] ?? "/";
    res.clearCookie(NEXT_COOKIE);

    // ensure that the redirect is ours closing the open redirect vulnerability
    res.redirect(
      next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
        ? next
        : "/",
    );
  } catch (e) {
    console.error("discord login failed", e);
    res.redirect("/auth/login?error=auth_failed");
  }
});

timRoutes.get("/logout", (req: any, res: any) => {
  res.clearCookie(SESSION_COOKIE);
  res.redirect("/auth/login");
});

export default timRoutes;
