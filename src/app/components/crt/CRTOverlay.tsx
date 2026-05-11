"use client";

/**
 * Global fixed overlay that produces the CRT illusion:
 *   - Scanlines (repeating gradient)
 *   - Vignette (radial mask)
 *   - Bezel inset shadow (faux glass)
 *   - Moving scan beam
 *   - Subtle flicker
 *
 * Every layer is hidden by globals.css when `html.accessible` is set.
 */
export default function CRTOverlay() {
  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-overlay__scanlines" />
      <div className="crt-overlay__scan" />
      <div className="crt-overlay__vignette" />
      <div className="crt-overlay__bezel" />
      <div className="crt-overlay__flicker" />
    </div>
  );
}
