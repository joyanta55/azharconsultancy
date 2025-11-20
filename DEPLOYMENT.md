# Cloudflare Pages Deployment Guide

This repository is configured to automatically deploy to Cloudflare Pages via GitHub Actions.

## Prerequisites

You need the following Cloudflare credentials configured as GitHub Secrets:

### 1. Get Cloudflare Account ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Overview**
3. Copy your **Account ID** from the right sidebar

### 2. Get Cloudflare API Token

1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use template: **"Edit Cloudflare Workers"**
   - Or create custom token with: **Account** → **Cloudflare Pages** → **Edit**
4. Click **"Create Token"** and copy the token immediately

### 3. Add GitHub Secrets

1. Go to repository: `Settings` → `Secrets and variables` → `Actions`
2. Add these secrets:
   - `CLOUDFLARE_API_TOKEN` - Your API token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` - Your Account ID from step 1

## Deployment Process

### Automatic Deployment

The site automatically deploys to Cloudflare Pages when:
- Code is pushed to the `master` branch
- A manual deployment is triggered via GitHub Actions

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Click **"Deploy to Cloudflare Pages"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

## Project Configuration

- **Deployment Directory**: `/site`
- **Project Name**: `calchvac`
- **Branch**: `master`

## Site Structure

```
/site/               ← This directory is deployed to Cloudflare
  ├── index.html
  ├── about.html
  ├── contact.html
  ├── products.html
  ├── services.html
  ├── service-details.html
  ├── starter-page.html
  ├── blog/          ← Blog section
  │   ├── index.html
  │   ├── post-template.html
  │   ├── posts/
  │   ├── data/
  │   │   └── blogs.json
  │   └── assets/
  └── assets/
```

**Note**: For managing blog posts, see [BLOG.md](BLOG.md)

## Accessing Your Site

After deployment, your site will be available at:
- Production URL: `https://calchvac.pages.dev`
- Custom domain: Configure in Cloudflare Pages dashboard

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs in the **Actions** tab
2. Verify secrets are correctly set
3. Ensure Cloudflare API token has correct permissions

### Site Not Updating

1. Check if the workflow ran successfully
2. Clear browser cache
3. Wait a few minutes for CDN propagation

## First-Time Setup

If this is your first deployment, you may need to:

1. Create the Cloudflare Pages project manually first:
   - Go to Cloudflare Dashboard → **Workers & Pages**
   - Click **"Create application"** → **"Pages"**
   - Name it: `calchvac`
   - Connect to GitHub or upload manually

2. Or let the GitHub Action create it automatically on first push

## Support

For issues with:
- Cloudflare Pages: [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- GitHub Actions: Check workflow logs in Actions tab
