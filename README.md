# 🎵 Know Your Song 🎤
A powerful music discovery application built with React, TypeScript, and Supabase — designed to help you explore and discover detailed information about your favorite songs. 🎶✨

## 🔥 Features
🔍 **Smart song search** with real-time results  
📊 **Interactive popularity charts** with historical data  
🎬 **YouTube integration** for music videos  
📝 **Detailed song information** (artist, album, genre, release date)  
🎯 **Beautiful responsive UI** with modern design  
🌙 **Dark/Light mode** support  
⚡ **Fast performance** with Vite and React Query  
🔔 **Toast notifications** for user feedback  

## 📁 Project Structure
```
/root
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── SongCard.tsx  # Song display component
│   │   ├── SearchBar.tsx # Search functionality
│   │   └── PopularityChart.tsx # Chart visualization
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── integrations/     # Supabase integration
├── supabase/
│   └── functions/        # Edge functions for API calls
└── public/               # Static assets
```

## ⚙️ Getting Started

### 1️⃣ Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account

### 2️⃣ Supabase Setup
1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. The project is already configured with the necessary edge functions

### 3️⃣ Environment Setup
The project is pre-configured with Supabase credentials. No additional environment variables needed for basic functionality.

### 4️⃣ Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage
1. **Search for songs** 🔍 - Enter any song name in the search bar
2. **View detailed information** 📊 - Click on song cards to see charts and details
3. **Explore popularity trends** 📈 - Interactive charts show song performance over time
4. **Watch music videos** 🎬 - Direct YouTube integration for each song
5. **Toggle themes** 🌙 - Switch between dark and light modes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Query** - Data fetching and caching
- **Recharts** - Interactive chart library
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend-as-a-Service
- **Edge Functions** - Serverless API endpoints
- **TypeScript** - Type-safe server code

### Additional Tools
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management
- **Sonner** - Toast notifications

## ✅ Best Practices
🧩 **Modular component architecture**  
🎨 **Consistent design system** with semantic tokens  
📱 **Fully responsive design**  
♿ **Accessible UI** with proper ARIA labels  
⚡ **Optimized performance** with lazy loading  
🔒 **Type safety** with TypeScript throughout  
🌈 **Beautiful animations** and transitions  

## 🚀 Deployment
The project can be easily deployed using:
- **Lovable** - One-click deployment from the platform
- **Vercel** - Connect your GitHub repository
- **Netlify** - Deploy from Git or drag & drop

## 📚 Key Components

### SearchBar
Handles user input and triggers song searches with a beautiful glassmorphism design.

### SongCard
Displays comprehensive song information including:
- Artist and album details
- Genre tags
- Release information
- YouTube video integration
- Interactive popularity charts

### PopularityChart
Interactive Recharts-powered visualization showing song popularity trends over time.

## 🔮 Future Enhancements
- 🎵 Playlist creation and management
- 👥 Social features and song sharing
- 🔊 Audio preview integration
- 📱 Mobile app version
- 🤖 AI-powered song recommendations

---

Built with ❤️ using React, TypeScript, and Supabase.

**Live Demo**: [Visit Know Your Song](https://lovable.app)