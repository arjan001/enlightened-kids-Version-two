// A minimal Service Worker so the v0 preview can register it successfully.
// It doesn’t intercept any requests – it simply installs and activates.

self.addEventListener("install", () => {
  // Activate the SW immediately after installation.
  self.skipWaiting()
})

self.addEventListener("activate", () => {
  // Become the active SW for all open clients.
  self.clients.claim()
})

/* No fetch/event listeners are registered on purpose.
   This keeps the SW completely passive and prevents it from
   affecting runtime behaviour in production. */
