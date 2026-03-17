"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const isBackendEnabled = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

function MockAdminGuard({ children }) {
    return children;
}

function ConvexAdminGuard({ children }) {
    const router = useRouter();
    const adminCheck = useQuery(api.admin.isAdmin);

    // Removed redirect so dev mode users can hit the Admin page to change their roles.
    // If not admin, the dashboard page will render an access denied or role switcher state.

    if (adminCheck === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c1222]">
                <div className="text-center">
                    <BarLoader width={200} color="#3b82f6" />
                    <p className="text-gray-400 mt-4">Verifying access...</p>
                </div>
            </div>
        );
    }

    return children;
}

export default function AdminGuard({ children }) {
    if (isBackendEnabled) {
        return <ConvexAdminGuard>{children}</ConvexAdminGuard>;
    }
    return <MockAdminGuard>{children}</MockAdminGuard>;
}
