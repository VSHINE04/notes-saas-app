# Vercel Deployment Script for Frontend
echo "🚀 Deploying Notes SaaS Frontend to Vercel"

# Make sure you're in the frontend directory
cd frontend

# Install Vercel CLI if not already installed
# npm install -g vercel

# Deploy to Vercel
vercel --prod

echo "✅ Frontend deployment complete!"
echo "📝 Next steps:"
echo "1. Set REACT_APP_API_URL in Vercel dashboard"
echo "2. Test the application"