// Service worker: recebe notificações push dos avisos
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Guarda Joaquim', {
    body: d.body || '',
    tag: d.tag,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('navigate' in c) return c.navigate(url).then(w => w && w.focus()); }
    return clients.openWindow(url);
  }));
});
