// Admin Dashboard Logic

// Sample pending verifications (for demo)
const SAMPLE_PENDING = [
    {
        id: 1,
        name: "Juan Dela Cruz",
        email: "juan.2021@catsu.edu.ph",
        studentId: "2021-12345",
        course: "BSIT - 3rd Year",
        selfieImage: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Selfie+with+ID",
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        status: "pending"
    },
    {
        id: 2,
        name: "Maria Santos",
        email: "maria.santos@gmail.com",
        studentId: "2022-67890",
        course: "BSHM - 2nd Year",
        selfieImage: "https://via.placeholder.com/400x300/ec4899/ffffff?text=ID+Photo",
        submittedAt: new Date(Date.now() - 7200000).toISOString(),
        status: "pending"
    }
];

let currentReviewId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupNavigation();
    setupEventListeners();
    loadAllData();
});

// Check if admin
function checkAdminAuth() {
    const session = sessionStorage.getItem('catsu_session');

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(session);

    if (!user.isAdmin) {
        alert('Admin access only!');
        window.location.href = 'feed.html';
        return;
    }

    document.getElementById('adminName').textContent = user.name;
}

// Setup Navigation
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active menu
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding tab
            const tabId = item.dataset.tab + 'Tab';
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('catsu_session');
        localStorage.removeItem('catsu_user');
        window.location.href = 'index.html';
    });

    // Close modals
    document.getElementById('closeReview').addEventListener('click', () => {
        document.getElementById('reviewModal').classList.remove('active');
    });

    document.getElementById('cancelReject').addEventListener('click', () => {
        document.getElementById('rejectModal').classList.remove('active');
    });

    // Approve button
    document.getElementById('approveBtn').addEventListener('click', approveStudent);

    // Reject flow
    document.getElementById('rejectBtn').addEventListener('click', () => {
        document.getElementById('rejectModal').classList.add('active');
    });

    document.getElementById('confirmReject').addEventListener('click', rejectStudent);

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Load All Data
function loadAllData() {
    loadPendingVerifications();
    loadVerifiedStudents();
    loadAllPosts();
    updateStats();
}

// Load Pending Verifications
function loadPendingVerifications() {
    // Get from localStorage or use sample data
    let pending = JSON.parse(localStorage.getItem('catsu_pending') || '[]');

    // Add sample data if empty (for demo)
    if (pending.length === 0) {
        pending = SAMPLE_PENDING;
        localStorage.setItem('catsu_pending', JSON.stringify(pending));
    }

    const container = document.getElementById('verificationList');
    const emptyState = document.getElementById('emptyPending');
    const countBadge = document.getElementById('pendingCount');

    countBadge.textContent = pending.length;

    if (pending.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = pending.map(student => `
        <div class="verification-card" data-id="${student.id}">
            <div class="verification-preview" onclick="openReview(${student.id})">
                <img src="${student.selfieImage}" alt="ID Photo">
            </div>
            <div class="verification-info">
                <h4>${escapeHtml(student.name)}</h4>
                <div class="verification-meta">
                    <span>📧 ${escapeHtml(student.email)}</span>
                    <span>🎓 ${escapeHtml(student.studentId)}</span>
                    <span>📚 ${escapeHtml(student.course)}</span>
                    <span>⏰ ${getTimeAgo(student.submittedAt)}</span>
                </div>
            </div>
            <div class="verification-actions">
                <button class="btn-review" onclick="openReview(${student.id})">
                    Review
                </button>
                <button class="btn-quick-reject" onclick="quickReject(${student.id})">
                    Quick Reject
                </button>
            </div>
        </div>
    `).join('');
}

// Load Verified Students
function loadVerifiedStudents() {
    const verified = JSON.parse(localStorage.getItem('catsu_verified') || '[]');
    const container = document.getElementById('verifiedList');
    const countBadge = document.getElementById('verifiedCount');

    countBadge.textContent = verified.length;

    if (verified.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No verified students yet
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = verified.map(student => `
        <tr>
            <td>
                <div class="student-cell">
                    <div class="student-avatar">${student.avatar || '👤'}</div>
                    <div class="student-info">
                        <span class="student-name">${escapeHtml(student.name)}</span>
                        <span class="student-email">${escapeHtml(student.email)}</span>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(student.studentId)}</td>
            <td>${escapeHtml(student.course)}</td>
            <td>${formatDate(student.verifiedAt)}</td>
            <td>
                <span class="status-badge status-verified">Verified</span>
            </td>
            <td>
                <button class="btn-action" onclick="viewStudent('${student.email}')">View</button>
                <button class="btn-action btn-action-danger" onclick="suspendStudent('${student.email}')">Suspend</button>
            </td>
        </tr>
    `).join('');
}

// Load All Posts (Admin View)
function loadAllPosts() {
    const posts = JSON.parse(localStorage.getItem('catsu_posts') || '[]');
    const container = document.getElementById('adminPostsList');
    const countBadge = document.getElementById('postsCount');

    countBadge.textContent = posts.length;

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Community hasn't started posting</p>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="admin-post-card">
            <div class="admin-post-header">
                <div class="post-header" style="padding: 0;">
                    <div class="post-avatar">${post.authorAvatar}</div>
                    <div class="post-info">
                        <div class="post-author">${escapeHtml(post.authorName)}</div>
                        <div class="post-meta">${post.authorCourse} • ${getTimeAgo(post.timestamp)}</div>
                    </div>
                </div>
                <div class="admin-post-actions">
                    <button class="btn-action" onclick="viewPost(${post.id})">View</button>
                    <button class="btn-action btn-action-danger" onclick="deletePost(${post.id})">Delete</button>
                </div>
            </div>
            <div class="post-content" style="padding: 0;">
                ${post.caption ? `<p class="post-text">${escapeHtml(post.caption)}</p>` : ''}
                ${post.image ? `<img src="${post.image}" class="post-image" style="max-height: 200px;" alt="Post">` : ''}
            </div>
        </div>
    `).join('');
}

// Update Stats
function updateStats() {
    const verified = JSON.parse(localStorage.getItem('catsu_verified') || '[]');
    const pending = JSON.parse(localStorage.getItem('catsu_pending') || '[]');

    document.getElementById('totalUsers').textContent = verified.length + pending.length;

    // Count today's signups
    const today = new Date().toDateString();
    const todaySignups = [...verified, ...pending].filter(s => 
        new Date(s.submittedAt || s.verifiedAt).toDateString() === today
    ).length;

    document.getElementById('todaySignups').textContent = todaySignups;
}

// Open Review Modal
function openReview(id) {
    const pending = JSON.parse(localStorage.getItem('catsu_pending') || '[]');
    const student = pending.find(s => s.id === id);

    if (!student) return;

    currentReviewId = id;

    document.getElementById('reviewImage').src = student.selfieImage;
    document.getElementById('reviewName').textContent = student.name;
    document.getElementById('reviewEmail').textContent = student.email;
    document.getElementById('reviewId').textContent = student.studentId;
    document.<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
