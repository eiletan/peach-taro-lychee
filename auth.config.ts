import type { NextAuthConfig } from "next-auth";


export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isOnHomePage = nextUrl.pathname.startsWith('/dashboard');
            if (isOnHomePage) {
                if (isLoggedIn) {
                    return true;
                } else {
                    return false;
                }
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        }
    },
    providers: [],
} satisfies NextAuthConfig;