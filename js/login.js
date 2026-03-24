// Login Page Logic - FIXED with admin support

// Test accounts database
const TEST_ACCOUNTS = {
    'admin@catsu.edu.ph': {
        password: 'admin123',
        name: 'Admin Moderator',
        course: 'BSIT - Admin',
        avatar: '👨‍💼',
        isAdmin: true
    },
    'test@gmail.com': {
        password: 'test123',
        name: 'Test Student',
        course: 'BSIT - 3rd Year',
        avatar: '🎓',
        isAdmin: false
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupPasswordToggle();
    setupForgotPassword();
    checkRememberedUser();
});

// Login Form - FIXED
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        // Validation
        if (!email || !password) {
            shakeElement(form);
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Check test accounts
        const testAccount = TEST_ACCOUNTS[email];

        if (testAccount && testAccount.password === password) {
            // Successful login with test account
            const user = {
                email: email,
                name: testAccount.name,
                course: testAccount.course,
                avatar: testAccount.avatar,
                isAdmin: testAccount.isAdmin
            };

            // Save session
            sessionStorage.setItem('catsu_session', JSON.stringify(user));

            if (rememberMe.checked) {
                localStorage.setItem('catsu_user', JSON.stringify({
                    email: email,
                    timestamp: Date.now()
                }));
            }

            showNotification(`Welcome back, ${user.name}!`, 'success');

            // Redirect based on role
            setTimeout(() => {
                if (user.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'feed.html';
                }
            }, 1000);

        } else {
            // Check if email exists but wrong password
            if (testAccount) {
                showNotification('Wrong password!', 'error');
                passwordInput.style.borderColor = '#ef4444';
            } else {
                showNotification('Account not found. Use test accounts or signup.', 'error');
                emailInput.style.borderColor = '#ef4444';
            }

            shakeElement(form);
        }
    });

    // Clear error styles on input
    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.style.borderColor = '';
    });
}

// Password Toggle
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');

    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
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
        const userData = JSON.parse(remembered);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        if (Date.now() - userData.timestamp < thirtyDays) {
            document.getElementById('loginEmail').value = userData.email;
            document.getElementById('rememberMe').checked = true;
        } else {
            localStorage.removeItem('catsu_user');
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? 'var(--success)' : 
                    type === 'error' ? '#ef4444' : 'var(--primary)';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
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

// Utility: Shake animation for errors
function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add animations to CSS dynamically
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
✅ FIXED login.js with admin support!

Now working:
- admin@catsu.edu.ph / admin123 → redirects to admin.html
- test@gmail.com / test123 → redirects to feed.html
- Wrong password shows error
- Unknown email shows error
