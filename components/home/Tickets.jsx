"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Ban } from "lucide-react";

export default function Tickets() {
    return (
        <section className="py-12 bg-black w-full text-white font-sans relative">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Floating Banner from Screenshot */}
                <div className="absolute right-[-10px] md:right-10 bottom-[30%] bg-white text-black font-sans font-medium px-4 md:px-8 py-3 rounded-full text-[13px] md:text-sm -rotate-6 z-20 shadow-xl flex items-center gap-2 pointer-events-none origin-bottom-right">
                    Questions about when to buy? Message Support on WhatsApp <span className="bg-[#25D366] text-white p-1 rounded-full"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-32.3 0-64-8.7-91.8-25l-6.6-3.9-68.1 17.8 18.2-66.4-4.3-6.8c-18.2-28.7-27.8-62.1-27.8-95.6 0-103.5 84.3-187.8 187.9-187.8 50.1 0 97.2 19.5 132.6 54.9 35.5 35.5 55 82.6 55 132.7 0 103.5-84.3 187.9-187.9 187.9zM315.6 280c-5-2.5-29.8-14.7-34.4-16.4-4.6-1.6-8-2.5-11.4 2.5-3.4 5-13 16.4-16 19.8-3 3.4-5.9 3.8-10.9 1.3-5-2.5-21.3-7.9-40.6-25.1-15-13.4-25.2-30-28.1-35-3-5-.3-7.7 2.2-10.2 2.2-2.2 5-5.9 7.5-8.8 2.5-3 3.4-5 5-8.4 1.7-3.4.8-6.3-.4-8.8-1.3-2.5-11.4-27.5-15.6-37.7-4.1-9.9-8.3-8.6-11.4-8.7-3 0-6.4-.1-9.8-.1-3.4 0-8.9 1.3-13.6 6.5-4.6 5.2-17.7 17.3-17.7 42.2 0 24.9 18.1 49 20.6 52.3 2.5 3.4 35.6 54.4 86.3 76.3 12 5.2 21.4 8.3 28.7 10.6 12.1 3.9 23.1 3.3 31.8 2 9.5-1.4 29.8-12.2 34-24 4.1-11.8 4.1-22 2.9-24-1.2-2-4.6-3.1-9.6-5.6z"></path></svg></span>
                </div>

                {/* TICKET CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
                    {/* Card 1 */}
                    <div className="relative group overflow-hidden rounded-md flex flex-col items-center text-center py-12 px-6 h-[500px] justify-between transition-transform duration-500 hover:scale-[1.02] cursor-pointer bg-gradient-to-b from-[#ffcd94] to-[#ff7b00]">
                        <div className="flex flex-col items-center">
                            <h3 className="text-5xl font-display uppercase tracking-tighter leading-[0.9] text-white drop-shadow-sm">
                                General<br />Admission
                            </h3>
                            <p className="mt-4 text-2xl font-sans tracking-tight font-semibold text-white/90 drop-shadow-sm">
                                Regular Tickets<br />3rd Release
                            </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-white/50 flex flex-col items-center justify-center opacity-80 mt-auto mb-auto">
                            <span className="text-[10px] font-bold">U</span>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-2xl font-sans font-bold text-white mb-6 drop-shadow-sm">
                                3 Days<br />Festival Pass
                            </p>
                            <div className="w-full bg-black/20 backdrop-blur-sm -mb-12 absolute bottom-0 left-0 right-0 py-4">
                                <span className="text-xl font-bold">€144</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group overflow-hidden rounded-md flex flex-col items-center text-center py-12 px-6 h-[500px] justify-between transition-transform duration-500 hover:scale-[1.02] cursor-pointer bg-gradient-to-b from-[#ff6b4a] to-[#e63920]">
                        <div className="flex flex-col items-center">
                            <h3 className="text-7xl font-display uppercase tracking-tighter leading-[0.9] text-white drop-shadow-sm mt-2">
                                VIP
                            </h3>
                            <p className="mt-6 text-2xl font-sans tracking-tight font-semibold text-white/90 drop-shadow-sm">
                                Regular Tickets
                            </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-white/50 flex flex-col items-center justify-center opacity-80 mt-auto mb-auto">
                            <span className="text-[10px] font-bold">U</span>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-2xl font-sans font-bold text-white mb-6 drop-shadow-sm">
                                3 Days<br />Festival Pass
                            </p>
                            <div className="w-full bg-black/20 backdrop-blur-sm -mb-12 absolute bottom-0 left-0 right-0 py-4">
                                <span className="text-xl font-bold">€349</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group overflow-hidden rounded-md flex flex-col items-center text-center py-12 px-6 h-[500px] justify-between transition-transform duration-500 hover:scale-[1.02] cursor-pointer bg-gradient-to-b from-[#ffb5cd] to-[#d86ab3]">
                        <div className="flex flex-col items-center">
                            <h3 className="text-5xl font-display uppercase tracking-tighter leading-[0.9] text-white drop-shadow-sm">
                                General<br />Admission
                            </h3>
                            <p className="mt-4 text-2xl font-sans tracking-tight font-semibold text-white/90 drop-shadow-sm">
                                Early Tickets
                            </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-white/50 flex flex-col items-center justify-center opacity-80 mt-auto mb-auto">
                            <span className="text-[10px] font-bold">U</span>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-2xl font-sans font-bold text-white mb-6 drop-shadow-sm">
                                1 Day<br />Daily Ticket
                            </p>
                            <div className="w-full bg-black/20 backdrop-blur-sm -mb-12 absolute bottom-0 left-0 right-0 py-4">
                                <span className="text-sm font-bold uppercase tracking-widest">STARTING AT 69€</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative group overflow-hidden rounded-md flex flex-col items-center text-center py-12 px-6 h-[500px] justify-between transition-transform duration-500 hover:scale-[1.02] cursor-pointer bg-gradient-to-b from-[#d191ff] to-[#8d42f5]">
                        <div className="flex flex-col items-center">
                            <h3 className="text-7xl font-display uppercase tracking-tighter leading-[0.9] text-white drop-shadow-sm mt-2">
                                VIP
                            </h3>
                            <p className="mt-6 text-2xl font-sans tracking-tight font-semibold text-white/90 drop-shadow-sm">
                                Early Tickets
                            </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-white/50 flex flex-col items-center justify-center opacity-80 mt-auto mb-auto">
                            <span className="text-[10px] font-bold">U</span>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className="text-2xl font-sans font-bold text-white mb-6 drop-shadow-sm">
                                1 Day<br />Daily Ticket
                            </p>
                            <div className="w-full bg-black/20 backdrop-blur-sm -mb-12 absolute bottom-0 left-0 right-0 py-4">
                                <span className="text-sm font-bold uppercase tracking-widest">STARTING AT 149€</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COMPARISON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-32 w-full max-w-5xl mx-auto mb-20 px-4">
                    {/* Gen Admission list */}
                    <div>
                        <h2 className="text-4xl font-sans font-bold text-white mb-8">General Admission</h2>
                        <ul className="space-y-3 font-sans text-[15px] font-medium">
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Access to all stages</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Access to all areas (except VIP)</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> Access to all VIP areas</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> UniSync Club</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> Priority line and dedicated entrance</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> VIP Parking</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> Premium food & bar areas</li>
                            <li className="flex items-center gap-3 text-white/40"><Ban className="w-4 h-4" /> VIP toilets</li>
                        </ul>
                    </div>
                    {/* VIP list */}
                    <div>
                        <h2 className="text-4xl font-sans font-bold text-white mb-8">VIP</h2>
                        <ul className="space-y-3 font-sans text-[15px] font-medium">
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Access to all stages</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Access to all areas (except VIP)</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Access to all VIP areas</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> UniSync Club</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Priority line and dedicated entrance</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> VIP Parking</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> Premium food & bar areas</li>
                            <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5" /> VIP toilets</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                    <p className="text-white/90 font-sans text-[15px] font-medium">
                        Choose your ticket and get ready for two unforgettable days of music and connection.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link href="/explore" className="group rounded-full border border-white/20 bg-black hover:bg-white hover:text-black transition-colors duration-300 px-6 py-3 flex items-center gap-2">
                            <span className="text-sm font-sans font-bold uppercase tracking-widest">Buy Tickets</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a href="#" className="rounded-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 px-6 py-3 flex items-center gap-2">
                            <span className="text-sm font-sans font-semibold">Questions about when to buy? Message Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
