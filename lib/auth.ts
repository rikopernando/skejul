import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema/auth";
import { profiles } from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification,
            profile: profiles,
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        // Add a plugin to automatically create profiles when users sign up
        {
            id: "profile-creator",
            hooks: {
                after: [
                    {
                        matcher(context) {
                            return context.path === "/sign-up";
                        },
                        async handler(ctx) {
                            // After successful sign up, create a profile
                            if (ctx.context.session) {
                                await ctx.context.db.insert(profiles).values({
                                    id: ctx.context.session.user.id,
                                    fullName: ctx.context.body.name || "New User",
                                    role: "teacher" // default role
                                });
                            }
                            return ctx;
                        }
                    }
                ]
            }
        }
    ]
});