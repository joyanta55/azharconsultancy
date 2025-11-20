# Blog Management Guide

## Quick Start: Adding a New Blog Post

### Step 1: Create HTML File
```bash
cp site/blog/post-template.html site/blog/posts/YYYY-MM-DD-your-title.html
```

Edit the file and replace all `[PLACEHOLDER]` text:
- `[POST TITLE]` - Your blog title
- `[POST EXCERPT]` - Brief summary (150-200 chars)
- `[FEATURED IMAGE PATH]` - `../assets/img/blog-XXX.jpg`
- `[DATE]` - "January 22, 2025"
- Replace the content section with your HTML

### Step 2: Update blogs.json

Open `site/blog/data/blogs.json` and add at the **top**:

```json
{
  "id": "002",
  "slug": "2025-01-22-your-title",
  "title": "Your Blog Title",
  "date": "2025-01-22",
  "author": "CalcHvac Team",
  "excerpt": "Brief summary...",
  "featuredImage": "../assets/img/blog-002.jpg",
  "categories": ["Newsletter"],
  "tags": ["HVAC", "Design"],
  "readTime": "5 min read"
}
```

### Step 3: Add Featured Image

Place image at `site/blog/assets/img/blog-XXX.jpg` (1200x630px, <500KB)

### Step 4: Deploy

```bash
git add site/blog/data/blogs.json site/blog/posts/YYYY-MM-DD-your-title.html site/blog/assets/img/blog-XXX.jpg
git commit -m "Add new blog post: Your Title"
git push origin master
```

---

## Blog Structure

```
/site/blog/
  ├── index.html              # Blog listing (auto-generated from JSON)
  ├── post-template.html      # Copy this for new posts
  ├── posts/                  # Individual blog post HTML files
  ├── data/
  │   └── blogs.json         # EDIT THIS to add posts
  └── assets/
      ├── css/blog.css
      ├── js/blog.js
      └── img/              # Blog images
```

---

## HTML Content Guidelines

Your blog HTML can include:

```html
<p>Paragraph text...</p>

<h2>Section Heading</h2>
<h3>Subsection Heading</h3>

<ul>
  <li>List item</li>
</ul>

<blockquote>Important callout</blockquote>

<img src="../assets/img/your-image.jpg" alt="Description">

<a href="../../products.html">Internal link</a>
```

---

## blogs.json Fields

| Field | Example | Notes |
|-------|---------|-------|
| id | `"002"` | Increment for each post |
| slug | `"2025-01-22-post-title"` | Must match filename |
| title | `"Post Title"` | Max 60 chars |
| date | `"2025-01-22"` | YYYY-MM-DD format |
| excerpt | `"Brief summary..."` | 150-200 chars |
| featuredImage | `"../assets/img/blog-002.jpg"` | Relative path |
| categories | `["Newsletter"]` | 1-3 categories |
| tags | `["HVAC", "Design"]` | Relevant keywords |
| readTime | `"5 min read"` | Estimated time |

---

## Testing Locally

Before deploying:
1. Open `site/blog/index.html` in browser
2. Verify post appears at top of listing
3. Click through to verify post displays correctly
4. Test search and category filter

---

## Troubleshooting

**Post doesn't appear on listing page:**
- Check JSON syntax at https://jsonlint.com
- Ensure post is at top of array in blogs.json
- Hard refresh browser (Ctrl+Shift+R)

**Featured image not showing:**
- Verify path in blogs.json: `../assets/img/filename.jpg`
- Check file exists in correct location
- Verify filename matches exactly (case-sensitive)

**Recent posts sidebar not loading:**
- Check browser console for errors
- Verify blogs.json path is correct

---

## File Naming Convention

Always use: `YYYY-MM-DD-descriptive-slug.html`

✅ Good: `2025-01-22-hvac-design-tips.html`
❌ Bad: `blog-post-2.html`, `mypost.html`

---

## Categories

Use consistent names:
- Newsletter
- HVAC Design
- Energy Modeling
- Case Studies
- Tutorials
- Industry Trends
