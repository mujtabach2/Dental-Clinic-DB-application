# Vercel Deployment Guide

This guide will help you deploy the Dental Clinic Management System to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Node.js 18+ installed locally
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Ensure all files are committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- Project name? `dental-clinic-management` (or your preferred name)
- Directory? `.` (current directory)
- Override settings? **No**

4. For production deployment:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect the configuration
4. Click "Deploy"

### 3. Environment Variables

No environment variables are required for basic deployment. The system uses SQLite which will be initialized automatically.

### 4. Post-Deployment Setup

After deployment:

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Navigate to the **Admin** tab
3. Click **"Create Tables"** to initialize the database
4. (Optional) Click **"Populate Data"** to add sample data

## Important Notes

### Database Persistence

⚠️ **Important**: Vercel serverless functions use an ephemeral filesystem. The SQLite database stored in `/tmp` will be reset between function invocations in different regions or after cold starts.

**For production use, consider:**
- Using Vercel Postgres (recommended for production)
- Using an external database service (e.g., Supabase, PlanetScale)
- Migrating to a cloud database solution

### Current Database Behavior

- The database is stored in `/tmp/dental.db` on Vercel
- Data may persist within the same function instance
- For development/demo purposes, this is acceptable
- For production, use a persistent database

## Project Structure

```
.
├── api/
│   └── index.js          # Vercel serverless function
├── public/               # Static frontend files
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── server/               # Backend routes and database
│   ├── routes/
│   └── db/
├── vercel.json          # Vercel configuration
└── package.json         # Root package.json
```

## Troubleshooting

### Database Connection Issues

If you encounter database errors:
1. Check Vercel function logs in the dashboard
2. Ensure tables are created via the Admin panel
3. Verify the database path in `api/index.js`

### API Routes Not Working

- Ensure `vercel.json` routes are correctly configured
- Check that `/api/*` routes are properly mapped
- Verify CORS settings in `api/index.js`

### Build Errors

- Ensure Node.js version is 18+ (check `package.json` engines)
- Verify all dependencies are listed in `package.json`
- Check Vercel build logs for specific errors

## Local Development

To test locally before deploying:

```bash
# Install dependencies
npm install

# Run local server (uses Express)
cd server
npm install
npm start
```

The frontend can be tested by opening `public/index.html` in a browser or using a local server.

## Support

For issues:
1. Check Vercel deployment logs
2. Review function logs in Vercel dashboard
3. Verify all files are properly committed to Git

## Next Steps

- Set up a production database (Vercel Postgres recommended)
- Configure custom domain
- Set up CI/CD for automatic deployments
- Add environment variables for sensitive data
- Implement authentication/authorization

