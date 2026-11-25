export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  isPlaceholder: boolean;
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
  grade: string;
}

export interface WorkProcessStep {
  number: string;
  title: string;
  description: string;
  iconName: 'discover' | 'plan' | 'design' | 'develop' | 'deliver';
}

export const PROFILE = {
  fullName: 'Muhammad Saqib',
  firstName: 'MUHAMMAD',
  lastName: 'SAQIB',
  backdropName: 'SAQIB',
  topLeftPrimary: 'FULL STACK DEVELOPER',
  topLeftSecondary: 'DIGITAL CREATOR',
  availability: 'AVAILABLE FOR OPPORTUNITIES',
  roleLine1: 'FULL STACK DEVELOPER',
  roleLine2: 'AI WEB APP DEVELOPER',
  tagline: 'Building Smart Web Solutions with Code and AI.',
  bio: 'I build modern, responsive, and user-friendly websites and web applications using clean code, creative design, and AI-powered development tools.',
  location: 'Lahore, Pakistan',
  defaultPortrait:
    '/assets/aistudio/WhatsApp_Image_2026-04-22_at_1.00.28_AM-removebg-preview_95bad1a2.png',
  quote:
    'Great websites combine thoughtful design, clean code, and meaningful user experiences.',
  signature: 'Muhammad Saqib',
  contactTitleLine1: "LET'S WORK",
  contactTitleLine2: 'TOGETHER',
  contactDescription:
    "I'm open to professional opportunities, web development projects, and collaborations.",
  contactPlaceholders: {
    email: 'saqibkhan.pk51@gmail.com',
    linkedin:
      'https://www.linkedin.com/in/muhammad-saqib-270207403?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/saqib-kha',
    location: 'Lahore, Pakistan',
  },
} as const;

export const PROFILE_HIGHLIGHTS = [
  {
    value: 'MCA',
    labelLine1: 'COMPUTER',
    labelLine2: 'SCIENCE',
  },
  {
    value: 'AI + WEB',
    labelLine1: 'FULL STACK',
    labelLine2: 'SOLUTIONS',
  },
  {
    value: 'GRADE A',
    labelLine1: 'GOMAL',
    labelLine2: 'UNIVERSITY',
  },
] as const;

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'ai-web-application',
    number: '01',
    title: 'AI Web Application',
    category: 'AI-POWERED WEB APP',
    summary:
      'Editable project placeholder showcasing a responsive AI-powered web application combining clean front-end architecture with modern AI workflows.',
    image: '/src/assets/images/project_ai_webapp_1795505111667.jpg',
    stack: ['JavaScript', 'Full Stack Development', 'Google AI Studio', 'Claude AI'],
    liveUrl: '',
    repoUrl: '',
    isPlaceholder: true,
  },
  {
    id: 'ecommerce-website',
    number: '02',
    title: 'E-Commerce Website',
    category: 'FULL STACK STOREFRONT',
    summary:
      'Editable project placeholder presenting a clean, conversion-focused e-commerce storefront with structured product browsing, database integration, and responsive UI.',
    image: '/src/assets/images/project_ecommerce_1795505111734.jpg',
    stack: ['HTML', 'CSS', 'JavaScript', 'C#', 'MySQL', 'Bootstrap'],
    liveUrl: '',
    repoUrl: '',
    isPlaceholder: true,
  },
  {
    id: 'wordpress-website',
    number: '03',
    title: 'WordPress Website',
    category: 'CUSTOM CMS & WEB DESIGN',
    summary:
      'Editable project placeholder demonstrating a tailored WordPress business website engineered for clean visual hierarchy, easy content management, and fast load performance.',
    image: '/src/assets/images/project_wordpress_1795505111907.jpg',
    stack: ['WordPress', 'HTML', 'CSS', 'Front-End Development'],
    liveUrl: '',
    repoUrl: '',
    isPlaceholder: true,
  },
  {
    id: 'fly-kaaba',
    number: '04',
    title: 'FlyKaaba',
    category: 'TRAVEL & VEHICLE BOOKING',
    summary:
      'Vehicle booking and travel agency marketplace across Saudi Arabia for airport transfers, city-to-city travel, and Ziyarat journeys with verified transport companies.',
    image: '/src/assets/images/project_flykaaba_1795597196104.jpg',
    stack: ['Full Stack Development', 'Front-End Development', 'JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://fly-kaaba.netlify.app',
    repoUrl: '',
    isPlaceholder: false,
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Master of Computer Applications',
    field: 'Computer Science',
    institution: 'Gomal University',
    period: '2021–2025',
    grade: 'Grade A',
  },
];

export const SKILLS: string[] = [
  'HTML',
  'CSS',
  'JavaScript',
  'C#',
  'MySQL',
  'Bootstrap',
  'WordPress',
  'Front-End Development',
  'Full Stack Development',
  'Google AI Studio',
  'Antigravity AI',
  'Cursor AI',
  'Claude AI',
];

export const WORK_PROCESS: WorkProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Understanding project goals, user needs, and core functional requirements.',
    iconName: 'discover',
  },
  {
    number: '02',
    title: 'Plan',
    description:
      'Defining site architecture, database structure, and a clear technical roadmap.',
    iconName: 'plan',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Crafting clean, responsive layouts with deliberate hierarchy and usability.',
    iconName: 'design',
  },
  {
    number: '04',
    title: 'Develop',
    description:
      'Building fast, maintainable websites and AI web apps with clean full-stack code.',
    iconName: 'develop',
  },
  {
    number: '05',
    title: 'Deliver',
    description:
      'Testing across devices, refining performance, and launching ready-to-scale work.',
    iconName: 'deliver',
  },
];
