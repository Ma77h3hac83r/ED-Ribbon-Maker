# Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Development Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_INARA_API_URL=https://inara.cz/inapi/v1/

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=8c784c6dff142479a8d8b9c602211858
CLOUDFLARE_API_TOKEN=your_api_token_here

# Database Configuration
DATABASE_URL=your_d1_database_url_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Inara API Configuration
INARA_API_BASE_URL=https://inara.cz/inapi/v1/

# Sentry Configuration (for error tracking)
SENTRY_DSN=your_sentry_dsn_here

# R2 Configuration (after enabling R2)
R2_BUCKET_NAME=ed-ribbon-maker-images
```

## Next Steps for Cloudflare Setup:

1. **Enable R2 in Cloudflare Dashboard:**
   - Go to https://dash.cloudflare.com
   - Navigate to R2 Object Storage
   - Enable R2 for your account
   - Create the bucket: `ed-ribbon-maker-images`

2. **Get API Token:**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create a new token with the following permissions:
     - Account: Workers Scripts:Edit
     - Zone: Workers Routes:Edit
     - Account: D1:Edit
     - Account: Workers KV Storage:Edit
     - Account: R2 Storage:Edit

3. **Update wrangler.toml:**
   - Uncomment the R2 bucket section once R2 is enabled
   - Add the bucket ID to the configuration

## Current Cloudflare Resources Created:

- **D1 Database:** `ed-ribbon-maker-db` (ID: a223dac4-b83a-4b5d-bb48-3c095380d615)
- **KV Namespace:** `ED_RIBBON_MAKER_CACHE` (ID: 1e73c468050c425aa6de302e32780389)
- **Account ID:** 8c784c6dff142479a8d8b9c602211858