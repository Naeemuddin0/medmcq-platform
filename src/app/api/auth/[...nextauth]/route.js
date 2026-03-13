import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from '../../../../models/User.js';
import dbConnect from '../../../../lib/dbConnect.js';
import bcrypt from "bcryptjs";
// Removed NextAuth specific types as we are converting to JavaScript
// import { SessionStrategy, Session } from "next-auth";
// import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        
        // Destructure with default values, no type annotation needed for JS
        const { email = '', password = '' } = credentials ?? {};
        if (!email || !password) {
          console.log('Missing credentials');
          throw new Error('Please enter an email and password');
        }
      
        await dbConnect();
        console.log('Connected to DB');
      
        const user = await User.findOne({ email });
        console.log('User found:', user);
      
        if (!user) {
          console.log('No user found');
          throw new Error('No user found with this email');
        }
      
        // Type check removed, JS handles this dynamically
        // if (typeof password !== "string" || typeof user.password !== "string") {
        //   throw new Error("Invalid credentials format");
        // }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);
      
        if (!isPasswordValid) {
          console.log('Invalid password');
          throw new Error('Invalid password');
        }
      
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt", // Removed type assertion
  },
  pages: {
    signIn: '/login', // Re-added for now, will keep an eye on behavior
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 