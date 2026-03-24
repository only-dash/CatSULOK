// Feed Page Logic

// Test Accounts Data
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

// Current user
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadPosts();
});

// Check if user is logged in
function checkAuth() {
    const session = sessionStorage.getItem('catsu_session');
    const remembered = localStorage.getItem('catsu_user');

    if (session) {
        currentUser = JSON.parse(session);
        updateUI();
    } else if (remembered) {
        const userData = JSON.parse(remembered);
        // Check if it's a test account
        if (TEST_ACCOUNTS[userData.email]) {
            currentUser = {
                email: userData.email,
                ...TEST_ACCOUNTS[userData.email]
            };
            sessionStorage.setItem('catsu_session', JSON.stringify(currentUser));
            updateUI();
        } else {
            showTestAccountModal();
        }
    } else {
        showTestAccountModal();
    }
}

// Show test account modal
function showTestAccountModal() {
    const modal = document.getElementById('testAccountModal');
    modal.classList.add('active');

    // Setup test account buttons
    document.querySelectorAll('.test-account-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const email = btn.dataset.email;
            const pass = btn.dataset.pass;
            const name = btn.dataset.name;
            const course = btn.dataset.course;

            // Login with test account
            currentUser = {
                email: email,
                name: name,
                course: course,
                avatar: email.includes('admin') ? '👨‍💼' : '🎓',
                isAdmin: email.includes('admin')
            };

            sessionStorage.setItem('catsu_session', JSON.stringify(currentUser));
            localStorage.setItem('catsu_user', JSON.stringify({
                email: email,
                timestamp: Date.now()
            }));

            modal.classList.remove('active');
            updateUI();
            showNotification(`Logged in as ${name}`, 'success');
        });
    });

    document.getElementById('closeTestModal').addEventListener('click', () => {
        modal.classList.remove('active');
        // Redirect to login if no account selected
        if (!currentUser) {
            window.location.href = 'login.html';
        }
    });
}

// Update UI with user data
function updateUI() {
    if (!currentUser) return;

    // Update sidebar
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userCourse').textContent = currentUser.course;
    document.getElementById('userAvatar').textContent = currentUser.avatar;
    document.getElementById('createPostAvatar').textContent = currentUser.avatar;

    // Update modal
    document.getElementById('modalAvatar').textContent = currentUser.avatar;
    document.getElementById('modalUserName').textContent = currentUser.name;

    // Update post count
    const posts = JSON.parse(localStorage.getItem('catsu_posts') || '[]');
    const userPosts = posts.filter(p => p.authorEmail === currentUser.email);
    document.getElementById('postCount').textContent = userPosts.length;
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('catsu_session');
        localStorage.removeItem('catsu_user');
        window.location.href = 'index.html';
    });

    // Open post modal
    document.getElementById('openPostModal').addEventListener('click', openPostModal);
    document.getElementById('firstPostBtn').addEventListener('click', openPostModal);
    document.getElementById('mobilePostBtn').addEventListener('click', openPostModal);

    // Close post modal
    document.getElementById('closePostModal').addEventListener('click', closePostModal);

    // Image upload
    document.getElementById('addPhotoBtn').addEventListener('click', () => {
        document.getElementById('postImageInput').click();
    });

    document.getElementById('postImageInput').addEventListener('change', handleImageSelect);

    // Remove image
    document.getElementById('removeImage').addEventListener('click', removeImage);

    // Submit post
    document.getElementById('submitPost').addEventListener('click', createPost);

    // Close modal on outside click
    document.getElementById('postModal').addEventListener('click', (e) => {
        if (e.target.id === 'postModal') closePostModal();
    });
}

// Modal Functions
function openPostModal() {
    document.getElementById('postModal').classList.add('active');
    document.getElementById('postCaption').focus();
}

function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
    // Reset form
    document.getElementById('postCaption').value = '';
    removeImage();
}

// Image Handling
let selectedImage = null;

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        selectedImage = event.target.result;
        document.getElementById('previewImage').src = selectedImage;
        document.getElementById('imagePreviewArea').classList.add('active');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedImage = null;
    document.getElementById('postImageInput').value = '';
    document.getElementById('imagePreviewArea').classList.remove('active');
}

// Create Post
function createPost() {
    const caption = document.getElementById('postCaption').value.trim();

    if (!caption && !selectedImage) {
        showNotification('Please add a caption or image', 'error');
        return;
    }

    const post = {
        id: Date.now(),
        authorName: currentUser.name,
        authorEmail: currentUser.email,
        authorAvatar: currentUser.avatar,
        authorCourse: currentUser.course,
        caption: caption,
        image: selectedImage,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('catsu_posts') || '[]');
    posts.unshift(post);
    localStorage.setItem('catsu_posts', JSON.stringify(posts));

    // Close modal and refresh
    closePostModal();
    loadPosts();
    updateUI();
    showNotification('Post created successfully!', 'success');
}

// Load Posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('catsu_posts') || '[]');
    const container = document.getElementById('postsContainer');
    const emptyState = document.getElementById('emptyFeed');

    if (posts.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = posts.map(post => createPostHTML(post)).join('');

    // Setup like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleLike(btn.dataset.postId));
    });

    // Setup delete buttons (admin only)
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deletePost(btn.dataset.postId));
    });
}

// Create Post HTML
function createPostHTML(post) {
    const timeAgo = getTimeAgo(post.timestamp);
    const isLiked = post.likedBy.includes(currentUser.email);
    const canDelete = currentUser.isAdmin || post.authorEmail === currentUser.email;

    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">${post.authorAvatar}</div>
                <div class="post-info">
                    <div class="post-author">${post.authorName}</div>
                    <div class="post-meta">${post.authorCourse} • ${timeAgo}</div>
                </div>
                ${canDelete ? `
                    <button class="post-menu delete-btn" data-post-id="${post.id}" title="Delete post">×</button>
                ` : ''}
            </div>
            <div class="post-content">
                ${post.caption ? `<p class="post-text">${escapeHtml(post.caption)}</p>` : ''}
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                    <span>${isLiked ? '❤️' : '🤍'}</span>
                    <span>${post.likes || 'Like'}</span>
                </button>
                <button class="action-btn">
                    <span>💬</span>
                    <span>Comment</span>
                </button>
                <button class="action-btn">
                    <span>📤</span>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `;
}

// Toggle Like
function toggleLike(postId) {
    const posts = JSON.parse(localStorage.getItem('catsu_posts') || '[]');
    const post = posts.find(p => p.id == postId);

    if (!post) return;

    const userIndex = post.likedBy.indexOf(currentUser.email);

    if (userIndex === -1) {
        post.likes++;
        post.likedBy.push(currentUser.email);
    } else {
        post.likes--;
        post.likedBy.splice(userIndex, 1);
    }

    localStorage.setItem('catsu_posts', JSON.stringify(posts));
    loadPosts();
}

//<response clipped><NOTE>Result is longer than **10000 characters**, will be **truncated**.</NOTE>
