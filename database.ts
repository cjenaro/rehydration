import connect, { sql } from "@databases/expo";

const db = connect("rehydration.db");

export default db;
export { sql };
