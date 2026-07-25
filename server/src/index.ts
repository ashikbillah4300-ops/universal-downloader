import app from "./app";
import { PrismaClient } from "@prisma/client";

const port = process.env.PORT || 8000;
export const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to SQLite database via Prisma");

    app.listen(Number(port), "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
      console.log(`Local network access: http://192.168.68.104:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
