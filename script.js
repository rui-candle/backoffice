// ============================================================
//  LOGIN PAGE — Supabase Auth
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    const sb = window._supabase;

    // If already logged in, go straight to dashboard
    const { data: { session } } = await sb.auth.getSession();
    if (session) { location.href = 'dashboard.html'; return; }

    // ── Elements ──────────────────────────────────────────────
    const form        = document.getElementById('login-form');
    const emailInput  = document.getElementById('email');
    const pwInput     = document.getElementById('password');
    const submitBtn   = document.getElementById('submit-btn');
    const btnText     = submitBtn.querySelector('.btn-text');
    const googleBtn   = document.getElementById('google-btn');
    const forgotBtn   = document.getElementById('forgot-btn');
    const msgBox      = document.getElementById('message-box');
    const tabs        = document.querySelectorAll('.tab');
    const togglePw    = document.querySelector('.toggle-pw');

    let mode = 'signin'; // or 'signup'

    // ── Tab switching ─────────────────────────────────────────
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            mode = tab.dataset.tab;
            btnText.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
            forgotBtn.style.display = mode === 'signin' ? 'block' : 'none';
            clearMsg();
        });
    });

    // ── Toggle password visibility ────────────────────────────
    togglePw.addEventListener('click', () => {
        const isText = pwInput.type === 'text';
        pwInput.type = isText ? 'password' : 'text';
        togglePw.querySelector('.eye-icon').style.opacity = isText ? '1' : '0.4';
    });

    // ── Input micro-animations ────────────────────────────────
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.input-group').style.transform = 'translateY(-2px)';
        });
        input.addEventListener('blur', () => {
            input.closest('.input-group').style.transform = '';
        });
    });

    // ── Form submit (email + password) ────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMsg();
        setLoading(true);

        const email    = emailInput.value.trim();
        const password = pwInput.value;

        let error, data;

        if (mode === 'signin') {
            ({ data, error } = await sb.auth.signInWithPassword({ email, password }));
        } else {
            ({ data, error } = await sb.auth.signUp({ email, password }));
        }

        setLoading(false);

        if (error) {
            showMsg(error.message, 'error');
            shakePanel();
            return;
        }

        if (mode === 'signup') {
            showMsg('Account created! Check your email to confirm.', 'success');
            return;
        }

        // Signed in — redirect
        showMsg('Welcome back! Redirecting…', 'success');
        setTimeout(() => location.href = 'dashboard.html', 800);
    });

    // ── Google OAuth ──────────────────────────────────────────
    googleBtn.addEventListener('click', async () => {
        const { error } = await sb.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/dashboard.html' }
        });
        if (error) showMsg(error.message, 'error');
    });

    // ── Forgot password ───────────────────────────────────────
    forgotBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email) { showMsg('Enter your email above first.', 'error'); return; }
        const { error } = await sb.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/index.html'
        });
        if (error) showMsg(error.message, 'error');
        else showMsg('Password reset link sent — check your inbox.', 'success');
    });

    // ── Helpers ───────────────────────────────────────────────
    function setLoading(on) {
        submitBtn.classList.toggle('loading', on);
        submitBtn.disabled = on;
    }

    function showMsg(text, type = 'error') {
        msgBox.textContent = text;
        msgBox.className   = 'message-box ' + type;
    }

    function clearMsg() {
        msgBox.textContent = '';
        msgBox.className   = 'message-box';
    }

    function shakePanel() {
        const panel = document.querySelector('.glass-panel');
        panel.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' },
        ], { duration: 350, easing: 'ease-in-out' });
    }
});
