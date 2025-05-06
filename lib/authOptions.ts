import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import { allowedEmails } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return allowedEmails.includes(user.email!);
    },
    async session({ session }) {
      return session; // No need to modify session if you're only using email/name/image
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { 
    signIn: "/login",
  }
};
