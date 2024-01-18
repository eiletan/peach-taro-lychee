import type { NextAuthConfig } from "next-auth";


export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isOnHomePage = nextUrl.pathname.startsWith('/HomePage');
            if (isOnHomePage) {
                if (isLoggedIn) {
                    return true;
                }
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/HomePage', nextUrl));
            }
            return true;
        }
    },
    providers: [],
} satisfies NextAuthConfig;