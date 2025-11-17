/**
 * Blog Posts Dynamic Loader
 * Loads blog posts from JSON and handles filtering, search, and pagination
 */

// Configuration
const POSTS_PER_PAGE = 9;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadBlogPosts();
  setupEventListeners();
});

/**
 * Load blog posts from JSON file
 */
async function loadBlogPosts() {
  try {
    const response = await fetch('data/blogs.json');
    if (!response.ok) {
      throw new Error('Failed to load blog posts');
    }
    const data = await response.json();
    allPosts = data.posts || [];
    filteredPosts = [...allPosts];

    // Populate category filter
    populateCategoryFilter();

    // Display posts
    displayPosts();
    setupPagination();
  } catch (error) {
    console.error('Error loading blog posts:', error);
    showError();
  }
}

/**
 * Display blog posts for current page
 */
function displayPosts() {
  const blogGrid = document.getElementById('blogGrid');
  const noResults = document.getElementById('noResults');

  if (filteredPosts.length === 0) {
    blogGrid.innerHTML = '';
    noResults.style.display = 'block';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  noResults.style.display = 'none';

  // Calculate pagination
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

  // Generate HTML for posts
  blogGrid.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');

  // Re-initialize AOS for new elements
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

/**
 * Create HTML for a single blog post card
 */
function createPostCard(post) {
  const postUrl = `posts/${post.slug}.html`;
  const imageUrl = post.featuredImage || '../assets/img/blog-default.jpg';
  const categories = post.categories ? post.categories.slice(0, 2).map(cat =>
    `<span class="badge bg-primary me-1">${cat}</span>`
  ).join('') : '';

  return `
    <div class="col-lg-4 col-md-6">
      <article class="blog-card">
        <div class="post-img">
          <img src="${imageUrl}" alt="${post.title}" class="img-fluid">
        </div>
        <div class="post-content">
          <div class="post-meta">
            <span class="post-date">
              <i class="bi bi-calendar"></i> ${formatDate(post.date)}
            </span>
            <span class="post-read-time">
              <i class="bi bi-clock"></i> ${post.readTime || '5 min read'}
            </span>
          </div>
          <h3 class="post-title">
            <a href="${postUrl}">${post.title}</a>
          </h3>
          ${categories ? `<div class="post-categories mb-2">${categories}</div>` : ''}
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-footer">
            <a href="${postUrl}" class="read-more">
              Read More <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </article>
    </div>
  `;
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Setup pagination controls
 */
function setupPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;

  pagination.innerHTML = paginationHTML;

  // Add click handlers to pagination links
  pagination.querySelectorAll('a.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      if (page && page !== currentPage) {
        currentPage = page;
        displayPosts();
        setupPagination();
        scrollToTop();
      }
    });
  });
}

/**
 * Populate category filter dropdown
 */
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set();

  allPosts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(cat => categories.add(cat));
    }
  });

  const sortedCategories = Array.from(categories).sort();
  sortedCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/**
 * Setup event listeners for search and filters
 */
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const sortFilter = document.getElementById('sortFilter');
  const categoryFilter = document.getElementById('categoryFilter');

  // Search input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFilters();
    }, 300);
  });

  // Sort filter
  sortFilter.addEventListener('change', applyFilters);

  // Category filter
  categoryFilter.addEventListener('change', applyFilters);
}

/**
 * Apply all filters and search
 */
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const sortBy = document.getElementById('sortFilter').value;
  const category = document.getElementById('categoryFilter').value;

  // Start with all posts
  filteredPosts = [...allPosts];

  // Apply search filter
  if (searchTerm) {
    filteredPosts = filteredPosts.filter(post => {
      return post.title.toLowerCase().includes(searchTerm) ||
             post.excerpt.toLowerCase().includes(searchTerm) ||
             (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
    });
  }

  // Apply category filter
  if (category !== 'all') {
    filteredPosts = filteredPosts.filter(post => {
      return post.categories && post.categories.includes(category);
    });
  }

  // Apply sorting
  if (sortBy === 'newest') {
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'oldest') {
    filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Reset to first page
  currentPage = 1;

  // Display filtered results
  displayPosts();
  setupPagination();
}

/**
 * Scroll to top of blog section
 */
function scrollToTop() {
  const blogSection = document.getElementById('blog');
  if (blogSection) {
    blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Show error message if posts fail to load
 */
function showError() {
  const blogGrid = document.getElementById('blogGrid');
  blogGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
      <h3 class="mt-3">Unable to load blog posts</h3>
      <p>Please try again later or contact support if the problem persists.</p>
    </div>
  `;
}
