import PortfolioHome from '../assets/PortfolioHomepage.png';
import OBSCSTools from '../assets/OBSCSTools.png';
import PomoImmerse from '../assets/PomoImmerseSS.png';

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  devpostUrl?: string;
}

const projects: Project[] = [
  {
    title: 'CaligraphME',
    description:
      'An interactive language learning application for children that won 2nd place in the GROW track at DubHacks 2025. Uses generative AI to write age-appropriate stories, tracks canvas handwriting inputs via OCR, uses voice cloning, and implements a unique dual grading system to evaluate translation accuracy and penmanship.',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/870/413/datas/gallery.jpg',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'ElevenLabs', 'Gemini API'],
    githubUrl: 'https://github.com/lomacanderson/CaligraphME',
    devpostUrl: 'https://devpost.com/software/calligraph-me',
  },
  {
    title: 'OBSCS.org',
    description:
      'An unofficial open-source platform helping Oregon State University computer science students navigate their degrees and careers. Features an interactive term-by-term course planner, a dynamic D3.js node-based prerequisite visualizer, and a career launchpad.',
    imageUrl: OBSCSTools,
    tags: ['Angular', 'TypeScript', 'D3.js', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/lomacanderson/OBSCS.org',
    liveUrl: 'https://obscs.org',
  },
  {
    title: 'PomoImmerse',
    description:
      'A desktop Pomodoro productivity timer application designed to block out distractions and sustain focus. Developed in C#, featuring customizable work/break cycles, task tracking, and immersive focus environments.',
    imageUrl: PomoImmerse,
    tags: ['C#', '.NET', 'WPF', 'Desktop App', 'Software Engineering'],
    githubUrl: 'https://github.com/lomacanderson/PomoImmerse',
  },
  {
    title: 'Portfolio Site',
    description:
      'This very portfolio site: a responsive, dark/light mode React app featuring animated code snippets, multi-language syntax highlighting, and event-driven typewriter animations.',
    imageUrl: PortfolioHome,
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Anime.js'],
    githubUrl: 'https://github.com/lomacanderson/portfolio-site',
    liveUrl: 'logananderson.dev',
  },
  {
    title: 'SpotShare',
    description:
      "A map-based social platform built during Oregon State University's 2025 Hackathon. Allows users to explore the world through friends' experiences, pin custom locations, and share reviews of favorite spots.",
    imageUrl: 'https://private-user-images.githubusercontent.com/165961740/430723412-8c0e4638-fcec-4b67-8102-2a524316afe9.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODM4MzU5NTcsIm5iZiI6MTc4MzgzNTY1NywicGF0aCI6Ii8xNjU5NjE3NDAvNDMwNzIzNDEyLThjMGU0NjM4LWZjZWMtNGI2Ny04MTAyLTJhNTI0MzE2YWZlOS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwNzEyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDcxMlQwNTU0MTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ZGY0YmI1ZTczODExZDQ4ZTM3OTZlZTc5NDgzZDYwZjdhMDdlMDE2YmQ3NzlkZjEzNTc3NGI2MzVmMGJjNDcyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.U52ogc0nBhdqeOXy9K6OEAd7JuacDWXDI-RYkbk-4OU',
    tags: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'Hackathon'],
    githubUrl: 'https://github.com/lomacanderson/SpotShare',
    devpostUrl: 'https://devpost.com/software/spotshare',
  },
  {
    title: 'Item Sharing App',
    description:
      'A database management web application built in response to the November 2024 Pacific Northwest bomb cyclone. Allows database administrators to view, insert, update, and delete neighborhood items, helping coordinate community aid.',
    imageUrl: 'https://github.com/lomacanderson/Item-Sharing-App/raw/main/screenshots/read_users.png',
    tags: ['Python', 'Flask', 'MySQL', 'Gunicorn', 'HTML/CSS'],
    githubUrl: 'https://github.com/lomacanderson/Item-Sharing-App',
  },
  {
    title: 'EverythingToolbar',
    description:
      'An open-source desktop search integration for the Windows taskbar powered by Voidtools Everything, with over 14.4k stars on GitHub. Contributed key features including launcher window-hiding adjustments, UI spacing fixes, and a Windows auto-start toggle directly in the settings.',
    imageUrl: 'https://raw.githubusercontent.com/srwi/EverythingToolbar/develop/.github/images/fast.png',
    tags: ['C#', '.NET', 'WPF', 'Windows API', 'Open Source'],
    githubUrl: 'https://github.com/srwi/EverythingToolbar',
  },
];

export default projects;
