import { connect } from "@tursodatabase/serverless";

const db = connect({
  url: process.env.DB_URL || "",
  authToken: process.env.DB_AUTH,
});

export default db;
