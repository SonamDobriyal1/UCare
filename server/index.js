import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = Number.parseInt(process.env.PORT || "4000", 10);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`UCare API listening on http://localhost:${port}`);
});
