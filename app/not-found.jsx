import Spline from "@splinetool/react-spline/next";
import NotFoundBodyClass from "@/components/not-found-body-class";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      {/* Blocking inline script — hides header/footer BEFORE first paint (no flash) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.body.classList.add("is-not-found");`,
        }}
      />

      <main className="fixed inset-0 z-[9999] h-[100dvh] w-[100dvw] overflow-hidden bg-[#020817]">
        <NotFoundBodyClass />

        {/* Spline scene — forced to fill entire viewport on any screen */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{ width: '100vw', height: '100vh', minWidth: '100%', minHeight: '100%' }}
        >
          <Spline
            scene="https://prod.spline.design/2fVXOgRLOxQwkn6g/scene.splinecode"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* Physical cover strips to hide Spline watermark badges */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-14 bg-gradient-to-t from-[#020817] to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-12 w-48 bg-[#020817]" />
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-12 w-12 bg-[#020817]" />

        {/* Text overlay — centered inside the circle */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center">
          <h1 className="not-found-glow-text text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-white/90 uppercase">
            404
          </h1>
          <p className="not-found-glow-text mt-2 text-sm sm:text-base md:text-lg font-light tracking-widest text-white/60 uppercase">
            Page Not Found
          </p>
          <Link
            href="/"
            className="pointer-events-auto not-found-btn-pulse mt-6 rounded-full border border-white/20 px-6 py-2.5 text-sm sm:text-base font-medium tracking-wide text-white/80 hover:text-white hover:border-white/40 transition-all duration-300"
          >
            ← Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}
