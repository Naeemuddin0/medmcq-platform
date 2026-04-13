import NextAuth from "next-auth";
export const dynamic = 'force-dynamic';
import { authOptions } from "./authOptions.js";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };