# CampusFind AI 🎯

An intelligent lost and found system powered by Google Gemini AI that uses advanced computer vision to match lost and found items on campus.

![CampusFind AI](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18+-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6) ![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF)

## ✨ Features

### 🔍 AI-Powered Visual Recognition
- **Smart Image Analysis**: Gemini AI automatically analyzes uploaded images to extract detailed descriptions, tags, and categories
- **Visual Matching Engine**: Advanced computer vision compares images to identify the same physical objects
- **Confidence Scoring**: Each match comes with a confidence percentage and detailed reasoning

### 🚀 Real-time Matching
- **Automatic Scanning**: When items are reported, the system automatically scans for potential matches
- **Manual Scan**: Users can trigger manual AI scans for any item
- **Instant Notifications**: Get notified immediately when potential matches are found

### 🎨 Modern UI/UX
- **Glass Morphism Design**: Beautiful, modern interface with glass effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Dark/Light Themes**: Adaptive design for different preferences

### 🔐 Privacy-First
- **Encrypted Contact Data**: All personal information is securely handled
- **Abstract Visual Hashes**: Images are processed without storing personal data
- **Secure Matching**: High-precision matching while maintaining privacy

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI/ML**: Google Gemini 1.5 Flash & Pro
- **Styling**: Tailwind CSS with custom glass morphism
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Database**: Supabase (with localStorage fallback)
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deekshith804/CampusFind-AI.git
   cd CampusFind-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

## 📱 Usage

### Reporting Lost Items
1. Click "Report Lost" in the navigation
2. Upload a clear photo of the lost item
3. Fill in the details (title, description, location, contact info)
4. Submit - the AI will automatically analyze and tag your item
5. Get notified if matching found items are discovered

### Reporting Found Items
1. Click "Report Found" in the navigation
2. Upload a photo of the found item
3. Provide details about where and when you found it
4. Submit - the system will check for matching lost items
5. Connect with the owner if matches are found

### Browsing Items
- View all reported items in the "Archive" section
- Filter by Lost/Found/All items
- Search by keywords, colors, or locations
- Click on items to view detailed information
- Use the manual scan button to trigger AI matching

## 🧠 AI Features Explained

### Image Analysis
The system uses Gemini 1.5 Flash to analyze uploaded images and extract:
- **Visual Tags**: Colors, materials, brands, conditions
- **Enhanced Descriptions**: Detailed 2-sentence physical descriptions
- **Categories**: Electronics, Clothing, Accessories, Books, etc.

### Visual Matching
Gemini 1.5 Pro compares images to identify identical objects by analyzing:
- Exact color matches
- Brand logos and text
- Scratches, wear patterns, or damage
- Size and proportions
- Unique identifying features

### Match Confidence
Each potential match includes:
- **Confidence Score**: 0-100% likelihood of being the same item
- **Detailed Reasoning**: Specific visual evidence for the match
- **Threshold Filtering**: Only shows matches above 75% confidence

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── BrowseItems.tsx  # Item browsing and filtering
│   ├── Hero.tsx         # Landing page hero section
│   ├── ItemCard.tsx     # Individual item display
│   ├── Layout.tsx       # App layout with notifications
│   └── ReportForm.tsx   # Lost/found item reporting
├── context/             # React context providers
│   └── AppContext.tsx   # Global app state management
├── services/            # External service integrations
│   └── geminiService.ts # Google Gemini AI integration
├── lib/                 # Utility libraries
│   └── supabase.ts      # Supabase client configuration
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
└── index.tsx            # App entry point
```

## 🔧 Configuration

### Supabase Setup (Optional)
For persistent data storage, set up Supabase:

1. Create a new Supabase project
2. Run this SQL to create the items table:
   ```sql
   CREATE TABLE items (
     id TEXT PRIMARY KEY,
     type TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     location TEXT NOT NULL,
     contactName TEXT NOT NULL,
     contactInfo TEXT NOT NULL,
     imageUrl TEXT,
     tags TEXT[],
     aiDescription TEXT,
     date TIMESTAMP NOT NULL,
     status TEXT NOT NULL DEFAULT 'OPEN'
   );
   ```
3. Add your Supabase credentials to `.env.local`

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **AI Prompts**: Adjust AI analysis prompts in `services/geminiService.ts`
- **Matching Threshold**: Change confidence thresholds in the matching logic

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Other Platforms
The project builds to static files and can be deployed anywhere that serves static content.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful vision capabilities
- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React Team** for the amazing framework

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

**Built with ❤️ for campus communities worldwide**