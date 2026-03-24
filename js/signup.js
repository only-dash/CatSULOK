// Signup Flow Logic

let currentStep = 1;
let userEmail = '';

// DOM Elements
const steps = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');
const formSteps = document.querySelectorAll('.form-step');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEmailForm();
    setupOtpForm();
    setupVerificationForm();
    setupOtpInputs();
    setupFileUpload();
    setupPasswordStrength();
});

// Navigation Functions
function goToStep(stepNumber) {
    // Update progress bar
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update step lines
    stepLines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index < stepNumber - 1) {
            line.classList.add('completed');
        }
    });

    // Show current form step
    formSteps.forEach((formStep, index) => {
        formStep.classList.remove('active');
        if (index + 1 === stepNumber) {
            formStep.classList.add('active');
        }
    });

    currentStep = stepNumber;
}

// Step 1: Email Form
function setupEmailForm() {
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Basic validation
        if (!email || !email.includes('@gmail.com')) {
            shakeElement(emailInput);
            emailInput.style.borderColor = '#ef4444';
            return;
        }

        userEmail = email;

        // Simulate sending OTP
        const btn = emailForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            document.getElementById('emailDisplay').textContent = userEmail;
            goToStep(2);
            btn.innerHTML = originalText;
            btn.disabled = false;

            // Focus first OTP input
            document.querySelector('.otp-digit').focus();
        }, 1500);
    });

    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
    });
}

// Step 2: OTP Form
function setupOtpForm() {
    const otpForm = document.getElementById('otpForm');
    const resendLink = document.getElementById('resendOtp');

    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const digits = document.querySelectorAll('.otp-digit');
        const otp = Array.from(digits).map(d => d.value).join('');

        if (otp.length !== 6) {
            shakeElement(document.querySelector('.otp-inputs'));
            return;
        }

        // Simulate verification
        const btn = otpForm.querySelector('button');
        btn.innerHTML = 'Verifying...';
        btn.disabled = true;

        setTimeout(() => {
            goToStep(3);
            btn.innerHTML = 'Verify Code <span class="btn-arrow">→</span>';
            btn.disabled = false;
        }, 1000);
    });

    // Resend OTP
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        startResendCountdown();
    });
}

// OTP Input Handling
function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-digit');

    inputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                // Move to next input
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                // Move to previous input on backspace
                inputs[index - 1].focus();
            }
        });

        // Paste handling
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            const numbers = pastedData.replace(/[^0-9]/g, '').split('');

            numbers.forEach((num, i) => {
                if (inputs[i]) {
                    inputs[i].value = num;
                }
            });

            // Focus next empty or last input
            const nextEmpty = Array.from(inputs).find(inp => !inp.value);
            if (nextEmpty) {
                nextEmpty.focus();
            } else {
                inputs[inputs.length - 1].focus();
            }
        });
    });
}

function startResendCountdown() {
    const resendLink = document.getElementById('resendOtp');
    const countdownSpan = document.getElementById('countdown');
    let seconds = 60;

    resendLink.style.pointerEvents = 'none';
    resendLink.style.opacity = '0.5';

    const interval = setInterval(() => {
        countdownSpan.textContent = `(${seconds}s)`;
        seconds--;

        if (seconds < 0) {
            clearInterval(interval);
            countdownSpan.textContent = '';
            resendLink.style.pointerEvents = 'auto';
            resendLink.style.opacity = '1';
        }
    }, 1000);
}

// Step 3: Verification Form
function setupVerificationForm() {
    const form = document.getElementById('verificationForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selfieInput = document.getElementById('selfieInput');
        const name = document.getElementById('studentName').value;
        const id = document.getElementById('studentId').value;
        const course = document.getElementById('course').value;
        const password = document.getElementById('password').value;

        // Validation
        if (!selfieInput.files[0]) {
            shakeElement(document.getElementById('selfieUpload'));
            return;
        }

        if (!name || !id || !course || !password) {
            shakeElement(form);
            return;
        }

        // Simulate submission
        const btn = document.getElementById('submitVerification');
        btn.innerHTML = 'Submitting...';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('finalEmail').textContent = userEmail;
            goToStep(4);
        }, 2000);
    });
}

// File Upload Handling
function setupFileUpload() {
    const uploadArea = document.getElementById('selfieUpload');
    const fileInput = document.getElementById('selfieInput');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    const preview = uploadArea.querySelector('.upload-preview');
    const previewImg = document.getElementById('selfiePreview');
    const retakeBtn = uploadArea.querySelector('.btn-retake');

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'var(--bg-hover)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';

        const files = e.dataTransfer.files;
        if (files.length) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    });

    retakeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        placeholder.classList.remove('hidden');
        preview.classList.add('hidden');
        uploadArea.classList.remove('has-file');
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            placeholder.classList.add('hidden');
            preview.classList.remove('hidden');
            uploadArea.classList.add('has-file');
        };
        reader.readAsDataURL(file);
    }
}

// Password Strength
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);

        strengthBar.className = 'strength-bar';

        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
        } else if (strength < 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#ef4444';
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium strength';
            strengthText.style.color = 'var(--warning)';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = 'var(--success)';
        }
    });
}<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
