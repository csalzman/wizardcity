import { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE, cookieOpts, verifySession } from "./session";

export const NEXT_COOKIE = "rft26_route_next";

export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.user = await verifySession(req.cookies[SESSION_COOKIE] ?? "");
  next();
}

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user) return next();
  if (req.path.startsWith("/spellbook"))
    return res.status(401).send("Unauthorized");

  // Remember the destination for after successful login
  res.cookie(NEXT_COOKIE, req.originalUrl, {
    ...cookieOpts,
    maxAge: 10 * 60 * 1000,
  });
  res.redirect("/auth/login");
}
