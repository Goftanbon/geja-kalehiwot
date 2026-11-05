// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./db";
// // import { admin } from "better-auth/plugins";
// // prismaAdapter

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql", // or "mysql", "sqlite", ...etc
//   }),
//   socialProviders: {
//     google: {
//       clientId: process.env.AUTH_GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || "",
//     },
//   },
//   // plugins: [admin({})],
//   //...
// });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // your prisma client instance

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || "",
    },
  },
});
