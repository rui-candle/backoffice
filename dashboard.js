// ============================================================
//  DASHBOARD PAGE — Supabase Auth Guard
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    const sb = window._supabase;

    // ── Auth guard: redirect if not logged in ─────────────────
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { location.href = 'index.html'; return; }

    const user = session.user;

    // ── Populate user info ────────────────────────────────────
    const emailEl  = document.getElementById('user-email');
    const avatarEl = document.getElementById('user-avatar');
    const greetSub = document.getElementById('greeting-sub');

    if (user.email) {
        emailEl.textContent  = user.email;
        avatarEl.textContent = user.email[0].toUpperCase();
    }

    // Personalise greeting if display name available
    const name = user.user_metadata?.full_name || user.user_metadata?.name;
    if (name) {
        greetSub.textContent = `Welcome back, ${name.split(' ')[0]}. Here's your store at a glance.`;
    }

    // ── Date badge ────────────────────────────────────────────
    const dateBadge = document.getElementById('date-badge');
    dateBadge.textContent = new Date().toLocaleDateString('en-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // ── Greeting time-of-day ──────────────────────────────────
    const hour = new Date().getHours();
    const greetTitle = document.querySelector('.page-title');
    if (hour < 12)      greetTitle.textContent = 'Good morning ✦';
    else if (hour < 17) greetTitle.textContent = 'Good afternoon ✦';
    else                greetTitle.textContent = 'Good evening ✦';

    // ── Sign out ──────────────────────────────────────────────
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await sb.auth.signOut();
        location.href = 'index.html';
    });

    // ── Sidebar nav active state ──────────────────────────────
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
