// Login Page Logic

document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupPasswordToggle();
    setupForgotPassword();
    checkRememberedUser();
});

// Login Form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validation
        if (!email || !password) {
            shakeElement(form);
            return;
        }

        // Simulate login
        const btn = form.querySelector('button[type="submit"]');
        btn.classList.add('btn-loading');
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.classList.remove('btn-loading');
            btn.disabled = false;

            // Save to localStorage if remember me
            if (rememberMe.checked) {
                localStorage.setItem('catsu_user', JSON.stringify({
                    email: email,
                    timestamp: Date.now()
                }));
            }

            // Redirect to feed (placeholder)
            showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                // window.location.href = 'feed.html';
                console.log('Redirect to feed page');
            }, 1000);

        }, 1500);
    });
}

// Password Toggle
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');

    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Change icon
        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

// Forgot Password Modal
function setupForgotPassword() {
    const forgotLink = document.querySelector('.forgot-link');
    const modal = document.getElementById('forgotModal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('forgotForm');

    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        btn.classList.add('btn-loading');
        btn.disabled = true;

        setTimeout(() => {
            btn.classList.remove('btn-loading');
            btn.disabled = false;
            modal.classList.remove('active');
            showNotification('Reset link sent to your email!', 'success');
            form.reset();
        }, 1500);
    });
}

// Check for remembered user
function checkRememberedUser() {
    const remembered = localStorage.getItem('catsu_user');
    if (remembered) {
        const user = JSON.parse(remembered);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        if (Date.now() - user.timestamp < thirtyDays) {
            document.getElementById('loginEmail').value = user.email;
            document.getElementById('rememberMe').checked = true;
        } else {
            localStorage.removeItem('catsu_user');
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 3000;
        animation: slideDown 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility: Shake animation
function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    @keyframes slideDown {
        from { 
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to { 
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);


==================================================
✅ Login page complete!

Features:
- Animated background glows
- Password show/hide toggle
- Remember me functionality
- Forgot password modal
- Loading states
- Toast notifications
- Auto-fill remembered email
