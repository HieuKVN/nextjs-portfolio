# 🎨 HieuK Portfolio - Modern Next.js Edition

A sleek, modern web portfolio built with Next.js 15, featuring an intelligent timetable viewer, lyrics processing tools, and secure remote access functionality. Completely rewritten from the original PHP version with significant performance and UX improvements.

## ✨ Features

### 🏠 Main Portfolio (`/`)

- Personal introduction with profile image
- Interactive skills showcase
- Dynamic goals tracking
- Contact links and social integration

### 🎵 Lyrics Processing Tool (`/lyrics`)

- Automatic chord notation removal
- Smart pronoun swapping for Vietnamese songs
- Real-time text processing

### 📅 Intelligent Timetable Viewer (`/tkb`)

- ICS file parsing for university schedules
- Smart color coding for subjects
- Responsive desktop and mobile layouts

### 🔐 Secure Wake-on-LAN Tool (`/wol`)

- Password-protected access
- Magic packet generation for remote wake-up
- Network security features

## 🛠 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/HieuKVN/nextjs-portfolio.git
cd nextjs-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open at http://localhost:3000
```

## 🔧 Configuration

### Environment Variables

```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production

# Wake-on-LAN Configuration (copy from .env.example)
WOL_PASSWORD=your_secure_password
WOL_MAC_ADDRESS=00:11:22:33:44:55
WOL_IP_ADDRESS=192.168.1.255
WOL_PORT=9
```

Create a `.env.local` file in the project root and copy the variables from `.env.example`.

### Personal Files Setup

#### Profile Image

1. Add your profile photo to `public/` directory
2. Rename it to `profile-placeholder.png` (or update the path in `src/app/page.tsx`)
3. Supported formats: PNG, JPG, JPEG, GIF, WebP
4. If no image is provided, a default avatar will be shown

#### Schedule Data

1. Download your university schedule as an ICS file
2. Place it in the `public/` directory
3. The app will automatically detect and use any `.ics` file
4. Supported: Standard iCalendar (.ics) format from university portals

## 🙏 Acknowledgments

- Original PHP version for the inspiration
- Next.js team for the amazing framework
- Font Awesome for beautiful icons
- The open-source community
- [Amp](https://ampcode.com/) for the intelligent coding agent that helped build this project

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
