# Vercel Deployment Script for Backend
echo "🚀 Deploying Notes SaaS Backend to Vercel"

# Make sure you're in the backend directory
cd backend

# Install Vercel CLI if not already installed
# npm install -g vercel

# Deploy to Vercel
vercel --prod

echo "✅ Backend deployment complete!"
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Test the health endpoint"
echo "3. Seed the database"