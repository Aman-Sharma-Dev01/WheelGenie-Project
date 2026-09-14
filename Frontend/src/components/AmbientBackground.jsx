
/**
 * AmbientBackground
 * Provides an elegant, luminous color atmosphere behind the WheelGenie page:
 * - White/light base with low-opacity, heavily blurred color orbs.
 * - Primary purple accent #B75EFF + WheelGenie blue + soft cyan + subtle green/orange.
 * - Ambient 10-20s slow drift animations via GPU-accelerated CSS keyframes.
 * - Overlaps section boundaries for seamless, continuous visual flow.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      {/* ================================================================= */}
      {/* 1. HERO ATMOSPHERE (Top section: Blue + Purple #B75EFF)          */}
      {/* ================================================================= */}
      
      {/* Top Right: Primary Purple #B75EFF Atmospheric Glow */}
      <div
        className="animate-wg-drift-1 absolute -top-[8%] right-[-10%] h-[550px] w-[550px] sm:h-[700px] sm:w-[700px] rounded-full blur-[130px] sm:blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(183, 94, 255, 0.16) 0%, rgba(183, 94, 255, 0.06) 50%, transparent 75%)",
        }}
      />

      {/* Top Left: WheelGenie Blue Atmospheric Glow */}
      <div
        className="animate-wg-drift-2 absolute -top-[4%] -left-[8%] h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] rounded-full blur-[130px] sm:blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(47, 128, 237, 0.14) 0%, rgba(56, 189, 248, 0.05) 55%, transparent 75%)",
        }}
      />

      {/* Hero Center Car Backlight: Mixed Blue + #B75EFF Radial Glow */}
      <div
        className="animate-wg-hero-glow absolute top-[180px] right-[5%] sm:right-[12%] h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] rounded-full blur-[100px] sm:blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(183, 94, 255, 0.14) 0%, rgba(47, 128, 237, 0.12) 40%, transparent 70%)",
        }}
      />

      {/* ================================================================= */}
      {/* 2. SECTION TRANSITION: HERO -> FEATURES -> STATS                  */}
      {/* ================================================================= */}
      
      {/* Features Left: Soft Cyan / Blue Halo */}
      <div
        className="animate-wg-drift-3 absolute top-[620px] -left-[10%] h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(47, 128, 237, 0.06) 50%, transparent 75%)",
        }}
      />

      {/* Features Right: Soft Purple #B75EFF Halo */}
      <div
        className="animate-wg-drift-2 absolute top-[700px] right-[-6%] h-[480px] w-[480px] sm:h-[580px] sm:w-[580px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(183, 94, 255, 0.12) 0%, rgba(183, 94, 255, 0.04) 55%, transparent 75%)",
        }}
      />

      {/* ================================================================= */}
      {/* 3. STORY & MISSION ATMOSPHERE (Blue, Green, Purple)               */}
      {/* ================================================================= */}

      {/* Behind Our Story (Left): WheelGenie Blue + Purple blend */}
      <div
        className="animate-wg-drift-1 absolute top-[1350px] left-[5%] h-[550px] w-[550px] sm:h-[650px] sm:w-[650px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(47, 128, 237, 0.13) 0%, rgba(183, 94, 255, 0.08) 45%, transparent 70%)",
        }}
      />

      {/* Behind Our Mission (Right): Subtle Green + Cyan blend */}
      <div
        className="animate-wg-drift-2 absolute top-[1420px] right-[4%] h-[520px] w-[520px] sm:h-[620px] sm:w-[620px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(39, 174, 96, 0.10) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 70%)",
        }}
      />

      {/* Mid-section bridge light: Subtle #B75EFF highlight */}
      <div
        className="animate-wg-drift-3 absolute top-[1750px] left-[35%] h-[440px] w-[440px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(183, 94, 255, 0.09) 0%, transparent 65%)",
        }}
      />

      {/* ================================================================= */}
      {/* 4. CEO BANNER & TRANSITION (Warm Subtle Amber / Blue Atmosphere)  */}
      {/* ================================================================= */}

      {/* CEO Right Ambient Accent (Warm subtle orange/amber) */}
      <div
        className="animate-wg-drift-2 absolute top-[2150px] right-[2%] h-[480px] w-[480px] sm:h-[580px] sm:w-[580px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, rgba(183, 94, 255, 0.05) 50%, transparent 70%)",
        }}
      />

      {/* CEO Left Ambient Glow (Deep blue & purple glow) */}
      <div
        className="animate-wg-drift-1 absolute top-[2080px] -left-[6%] h-[520px] w-[520px] sm:h-[620px] sm:w-[620px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(47, 128, 237, 0.12) 0%, rgba(183, 94, 255, 0.07) 45%, transparent 70%)",
        }}
      />

      {/* ================================================================= */}
      {/* 5. TEAM SECTION ATMOSPHERE (Purple #B75EFF + Brand Blue)          */}
      {/* ================================================================= */}

      {/* Behind Team Grid: Wide soft purple & blue ambient wash */}
      <div
        className="animate-wg-drift-3 absolute top-[2700px] left-[15%] h-[600px] w-[600px] sm:h-[750px] sm:w-[750px] rounded-full blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(183, 94, 255, 0.11) 0%, rgba(47, 128, 237, 0.08) 50%, transparent 70%)",
        }}
      />

      <div
        className="animate-wg-drift-1 absolute top-[2800px] right-[8%] h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(39, 174, 96, 0.05) 45%, transparent 70%)",
        }}
      />

      {/* Very subtle decorative ambient light dots (tiny, non-distracting) */}
      <div
        className="absolute top-[280px] left-[15%] h-2 w-2 rounded-full bg-[#B75EFF]/30 blur-[1px] animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute top-[450px] right-[25%] h-2.5 w-2.5 rounded-full bg-[#2F80ED]/30 blur-[1px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute top-[1250px] right-[18%] h-2 w-2 rounded-full bg-[#B75EFF]/25 blur-[1px] animate-pulse"
        style={{ animationDuration: "7s" }}
      />
      <div
        className="absolute top-[1850px] left-[20%] h-2.5 w-2.5 rounded-full bg-[#2F80ED]/25 blur-[1px] animate-pulse"
        style={{ animationDuration: "9s" }}
      />
      <div
        className="absolute top-[2550px] right-[30%] h-2 w-2 rounded-full bg-[#B75EFF]/25 blur-[1px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
    </div>
  );
}
