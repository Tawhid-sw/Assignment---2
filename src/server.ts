import app from "./app";
import config from "./config";
import { initDB } from "./db";

const PORT = config.port;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});
