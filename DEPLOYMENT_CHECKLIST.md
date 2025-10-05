# ✅ Netlify Deployment Checklist

## Before Deploying

### Local Development
- [ ] App runs successfully with `npm run dev`
- [ ] Can login/signup locally
- [ ] Videos play correctly
- [ ] All pages navigate properly
- [ ] No console errors

### Backend Preparation
- [ ] PHP backend is hosted on public server (NOT localhost)
- [ ] Backend has HTTPS enabled
- [ ] Can access API endpoints in browser/Postman
- [ ] CORS headers configured in ALL PHP files
- [ ] Database is accessible from hosting server

## Deployment Steps

### 1. GitHub Setup
- [ ] All changes committed to git
- [ ] Pushed to GitHub repository
- [ ] Repository is public or Netlify has access

### 2. Netlify Configuration
- [ ] Created account on Netlify
- [ ] Connected GitHub repository
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Publish directory: `.next`
- [ ] Environment variables added:
  - `NEXT_PUBLIC_API_URL` = your backend URL

### 3. Backend CORS Update
- [ ] Added Netlify domain to allowed origins in PHP
- [ ] Tested CORS with curl or Postman
- [ ] Verified OPTIONS requests work

### 4. Deploy
- [ ] Triggered deployment
- [ ] Build completed successfully
- [ ] Site is live

## After Deployment

### Testing
- [ ] Open deployed site URL
- [ ] Test in incognito mode (no extensions)
- [ ] Can access home page
- [ ] Can signup/login
- [ ] Can select country
- [ ] Can build mission
- [ ] Can complete full game flow
- [ ] Videos play correctly
- [ ] Check browser console (no errors)
- [ ] Check network tab (API calls succeed)

### Mobile Testing
- [ ] Test on mobile device
- [ ] Check responsive design
- [ ] Test touch interactions
- [ ] Verify videos play

### Performance
- [ ] Page loads in under 3 seconds
- [ ] Images load properly
- [ ] No broken links
- [ ] Proper error handling

## Troubleshooting

If something doesn't work:

### Frontend Issues
- [ ] Check Netlify deploy logs
- [ ] Check browser console errors
- [ ] Verify environment variables are set
- [ ] Try clearing browser cache
- [ ] Test in different browser

### API Issues
- [ ] Test API endpoint directly in browser
- [ ] Check CORS headers in Network tab
- [ ] Verify API URL in environment variables
- [ ] Check backend server logs
- [ ] Test with curl/Postman

### Common Fixes
- [ ] Redeploy after adding environment variables
- [ ] Clear Netlify cache and redeploy
- [ ] Check PHP error logs on backend
- [ ] Verify database connection
- [ ] Test in incognito mode

## Documentation Reference

- **Quick fixes**: See `QUICK_FIX.md`
- **Full guide**: See `DEPLOYMENT.md`
- **Summary**: See `DEPLOYMENT_SUMMARY.md`
- **Design system**: See `DESIGN_SYSTEM.md`

## Support

If you're stuck:
1. Check deployment documentation files
2. Review Netlify deploy logs
3. Check browser console and network tab
4. Test API endpoints independently
5. Verify all environment variables

---

**Remember**: Your PHP backend MUST be hosted separately from Netlify!

Current Status: [ ] Not Started / [ ] In Progress / [ ] Completed ✅
