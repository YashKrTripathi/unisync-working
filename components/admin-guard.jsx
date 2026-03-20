"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Mail, ShieldAlert, Sparkles } from "lucide-react";
import AnimatedArrowButton from "@/components/ui/animated-arrow-button";

const STAFF_ROLE_LABELS = {
    organiser: "Event Manager",
    superadmin: "Superadmin",
    owner: "Admin",
    student: "Student",
};

function AccessRestrictedPanel({ currentRole }) {
    const currentRoleLabel = STAFF_ROLE_LABELS[currentRole] || "Student";

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(120,0,0,0.18),rgba(10,10,10,0.92)_22%,#090909_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[repeating-linear-gradient(90deg,rgba(255,92,92,0.14)_0,rgba(255,92,92,0.14)_48px,transparent_48px,transparent_96px)] opacity-70" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[repeating-linear-gradient(90deg,rgba(255,92,92,0.10)_0,rgba(255,92,92,0.10)_48px,transparent_48px,transparent_96px)] opacity-40" />
            <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-[linear-gradient(180deg,transparent,rgba(255,92,92,0.22),transparent)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-[linear-gradient(180deg,transparent,rgba(255,92,92,0.22),transparent)]" />

            <div className="relative flex min-h-screen w-full flex-col px-4 py-4 sm:px-6 lg:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="inline-flex items-center gap-3 rounded-none border border-[#ff5c5c]/45 bg-[#2a0d0d] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb4b4] shadow-[0_0_0_1px_rgba(255,92,92,0.14)]">
                        <Sparkles className="h-3.5 w-3.5 text-[#ff7b7b]" />
                        Security Warning
                    </div>
                    <div className="flex items-center gap-3 text-right">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5c5c] shadow-[0_0_18px_rgba(255,92,92,0.95)]" />
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">Detected Role</p>
                            <p className="mt-1 text-sm font-semibold text-white">{currentRoleLabel}</p>
                        </div>
                    </div>
                </div>

                <div className="grid min-h-[calc(100vh-96px)] flex-1 grid-cols-1 gap-0 xl:grid-cols-[1.5fr_0.9fr]">
                    <section className="flex flex-col justify-center border-b border-white/10 py-10 xl:border-b-0 xl:border-r xl:border-white/10 xl:pr-10">
                        <div className="flex items-center gap-4 text-[#ff7b7b]">
                            <span className="inline-flex h-16 w-16 items-center justify-center border border-[#ff5c5c]/45 bg-[#210b0b] text-[#ff8b8b] shadow-[0_0_40px_rgba(255,92,92,0.16)]">
                                <ShieldAlert className="h-7 w-7" />
                            </span>
                            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,92,92,0.6),transparent)]" />
                        </div>

                        <div className="mt-8">
                            <p className="font-display text-[clamp(4.8rem,15vw,13rem)] leading-[0.78] tracking-[-0.07em] text-[#fff2f2]">
                                WARNING
                            </p>
                            <p className="mt-3 max-w-5xl text-[clamp(1.15rem,2.8vw,2.3rem)] font-medium uppercase tracking-[0.22em] text-[#ff8f8f]">
                                Unauthorised admin wall interaction detected
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-5">
                                <h1 className="text-2xl font-semibold leading-tight text-white md:text-4xl">
                                    This route is reserved for verified UniSync staff and protected administrative operators.
                                </h1>
                                <p className="max-w-3xl text-base leading-8 text-white/74 md:text-lg">
                                    Your account does not have clearance to pass the admin wall. This access attempt has been classified as a restricted action and logged against the current session.
                                </p>
                            </div>

                            <div className="grid gap-4 self-start">
                                <div className="border border-[#ff5c5c]/24 bg-[#120d0d] p-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff8f8f]">Threat State</p>
                                    <p className="mt-3 text-xl font-semibold text-white">Blocked before entry</p>
                                    <p className="mt-3 text-sm leading-7 text-white/64">
                                        The wall held. No staff controls or protected data were exposed to this account.
                                    </p>
                                </div>
                                <div className="border border-white/10 bg-[#0f0f0f] p-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">Recommended Action</p>
                                    <p className="mt-3 text-sm leading-7 text-white/68">
                                        Return to public pages or contact an authorised UniSync administrator if you believe your access level should be upgraded.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <AnimatedArrowButton href="/" icon="left" color="#ff5c5c" textColor="#140707">
                                Exit To Home
                            </AnimatedArrowButton>
                            <AnimatedArrowButton href="/events" icon="upRight" color="#adff2f" textColor="#212121">
                                Public Event Pages
                            </AnimatedArrowButton>
                        </div>
                    </section>

                    <aside className="flex flex-col justify-center py-10 xl:pl-10">
                        <div className="border border-[#ff5c5c]/22 bg-[linear-gradient(180deg,#150b0b,#0f0f10)] shadow-[0_18px_70px_rgba(0,0,0,0.38)]">
                            <div className="border-b border-[#ff5c5c]/18 bg-[#190d0d] px-6 py-5">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff8f8f]">Incident Feed</p>
                                <p className="mt-3 text-lg font-semibold text-white">Security response initiated</p>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                <div className="border border-[#ff5c5c]/18 bg-[#120c0c] p-5">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-[#ff7b7b]" />
                                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Staff Notification</h2>
                                    </div>
                                    <p className="mt-3 text-sm leading-7 text-white/72">
                                        A security notice has been dispatched. UniSync staff have been notified about this attempt to breach the admin wall.
                                    </p>
                                </div>

                                <div className="border border-white/10 bg-[#0d0d0d] p-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">Access State</p>
                                    <p className="mt-3 text-xl font-semibold text-[#ffb4b4]">Denied</p>
                                    <p className="mt-3 text-sm leading-7 text-white/64">
                                        This workspace remains locked until an authorised staff role is assigned to the account.
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-white/10 px-6 py-4">
                                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/42">
                                    <span>Restricted perimeter</span>
                                    <span>admin wall online</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

/**
 * AdminGuard now receives `adminCheck` as a prop from admin/layout.js
 * instead of making its own duplicate `isAdmin` query.
 * This eliminates one round-trip per admin page navigation.
 */
export default function AdminGuard({ children, adminCheck }) {
    const pathname = usePathname();
    const { user, isSignedIn } = useUser();
    const hasNotifiedRef = useRef(false);

    // Client-side pre-verification for owner emails
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    const publicOwnerEmails = (process.env.NEXT_PUBLIC_OWNER_EMAIL || "")
        .toLowerCase()
        .split(",")
        .map(e => e.trim())
        .filter(Boolean);
    const isActuallyOwner = userEmail && publicOwnerEmails.includes(userEmail.toLowerCase());

    useEffect(() => {
        const isResolved = adminCheck !== undefined;
        const isAllowed = adminCheck?.canAccessAdminPanel === true || isActuallyOwner;
        
        if (!isResolved || isAllowed || !isSignedIn || hasNotifiedRef.current) {
            return;
        }

        hasNotifiedRef.current = true;
        const currentRoleLabel = STAFF_ROLE_LABELS[adminCheck?.role] || "Student";
        const email = userEmail;
        const notificationKey = `admin-access-notice:${pathname}:${email || "anonymous"}`;

        if (!sessionStorage.getItem(notificationKey)) {
            sessionStorage.setItem(notificationKey, "sent");
            toast.error("Security notice: UniSync staff have been notified about this attempt to breach the admin wall.", {
                duration: 7000,
            });

            if (email) {
                fetch("/api/admin-access-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        name: user?.fullName || user?.firstName || "UniSync user",
                        roleLabel: currentRoleLabel,
                        attemptedPath: pathname,
                    }),
                }).catch(() => {});
            }
        }
    }, [adminCheck, isSignedIn, pathname, user, isActuallyOwner, userEmail]);

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

    if (!adminCheck?.canAccessAdminPanel && !isActuallyOwner) {
        return <AccessRestrictedPanel currentRole={adminCheck?.role} />;
    }

    if (!adminCheck?.canAccessAdminPanel && isActuallyOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c1222]">
                <div className="text-center">
                    <BarLoader width={200} color="#f97316" />
                    <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">Syncing Owner Permissions...</p>
                    <p className="text-gray-600 mt-2 text-xs">This only happens during initial session setup.</p>
                </div>
            </div>
        );
    }

    return children;
}
