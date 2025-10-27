# Screenshots Documentation

This folder contains all the screenshots used in the main README.md file.

## Image Index

| Filename | Description | Used In |
|----------|-------------|---------|
| `image.png` | Landing page with locked complaint form | Step 1 - Landing Page |
| `image-1.png` | Login page | Step 2 - User Authentication |
| `image-2.png` | Complaint form - Title field | Step 3.1 - Fill Complaint Title |
| `image-3.png` | Complaint form - Category selection | Step 3.2 - Select Category |
| `image-4.png` | Complaint form - Priority selection | Step 3.3 - Choose Priority |
| `image-5.png` | Complaint form - Description and submit | Step 3.4 - Add Description |
| `image-6.png` | Header with Admin Login button | Step 4 - Admin Login Button |
| `image-7.png` | Admin login page | Step 5 - Admin Login Page |
| `image-8.png` | Admin dashboard with complaints table | Step 6 - Admin Dashboard |
| `image-9.png` | Status dropdown in admin dashboard | Step 7 - Update Status |
| `image-10.png` | Email notification to admin (new complaint) | Step 8.1 - Admin Email |
| `image-11.png` | Email notification to user (status update) | Step 8.2 - User Email |
| `image-12.png` | Email details view | Step 8.2 - Email Details |
| `image-13.png` | Git workflow example from other project | Git Workflow Section |

## Screenshot Guidelines

### For Future Screenshots

1. **Resolution:** Use consistent resolution (1920x1080 or similar)
2. **Format:** PNG format for better quality
3. **Naming:** Use descriptive names (e.g., `admin-dashboard.png`)
4. **Content:** Ensure no sensitive information is visible
5. **Quality:** Use high-quality screenshots with clear text

### Taking New Screenshots

1. Clear browser cache for clean UI
2. Use incognito/private mode
3. Zoom to 100% for consistency
4. Capture full viewport or relevant section
5. Crop unnecessary parts

### Updating Screenshots

When updating screenshots:
1. Replace the old file with the same filename
2. Update this README if description changes
3. Verify all README links still work
4. Commit with descriptive message

## Image Optimization

All images should be optimized before committing:

```bash
# Using ImageOptim (Mac)
imageoptim screenshots/*.png

# Using pngquant (Cross-platform)
pngquant --quality=65-80 screenshots/*.png

# Using TinyPNG API
# Visit https://tinypng.com/
```

## Maintenance

- **Last Updated:** October 27, 2025
- **Total Images:** 14
- **Total Size:** ~[Check actual size]
- **Maintained By:** Project Contributors

## Notes

- All screenshots are taken from the development environment
- Dummy credentials are used for demonstration
- Email screenshots are from Mailtrap test inbox
- Git workflow screenshot is from a private repository (example only)
