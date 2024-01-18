"use server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
const bcrypt = require("bcryptjs");


async function getUser(uname: string) {
    try {
         // By unique identifier
        const user = await prisma.user.findUnique({
          where: {
            username: uname
          }
        })
        return user;
    } catch (err: any) {
      console.error("Failed to fetch user:",err);
      throw new Error('Failed to fetch user.')
    }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const {username,password} = parsedCredentials.data;
          const user = await getUser(username);
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password,user.password);
          if (passwordsMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.secret
});