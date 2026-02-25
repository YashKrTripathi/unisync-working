"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

export default function AdminGuard({ children }) {
    const router = useRouter();
    const adminCheck = useQuery(api.admin.isAdmin);

    useEffect(() => {
        if (adminCheck && !adminCheck.canAccessAdminPanel) {
            router.push("/");
        }
    }, [adminCheck, router]);

    // Loading state
    if (adminCheck === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <BarLoader width={200} color="#a855f7" />
                    <p className="text-gray-400 mt-4">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Not authorized
    if (!adminCheck.canAccessAdminPanel) {
        return null;
    }

    return children;
}
