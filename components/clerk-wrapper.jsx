"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export default function ClerkWrapper({ children }) {
    if (!isBackendEnabled) {
        // Frontend-only mode — skip Clerk
        return <>{children}</>;
    }
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            {children}
        </ClerkProvider>
    );
}
