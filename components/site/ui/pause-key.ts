/** localStorage key for the "Pausar animaciones" switch. Shared by the toggle
 *  (client) and the boot script in app/layout.tsx (server), so it lives in a
 *  plain module rather than the "use client" one. */
export const PAUSE_KEY = "lab-paused";
