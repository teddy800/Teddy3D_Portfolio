const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Testimonials",
    link: "#testimonials",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 3, suffix: "+", label: "Years of Experience" },
  { value: 15, suffix: "+", label: "Satisfied Clients" },
  { value: 20, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-3.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-7.png",
  },
  {
    imgPath: "/images/logos/company-logo-8.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  {
    imgPath: "/images/logos/company-logo-10.png",
  },
  {
    imgPath: "/images/logos/company-logo-11.png",
  },
];

const abilities = [
  {
    imgPath: "/images/abilities/diamond.png",
    title: "0-to-1 Product Architect",
    desc: "I don’t just code features — I design and build entire million-dollar products from scratch using AI, 3D, and Next.js 15.",
  },
    {
    imgPath: "/images/abilities/shield.png",
    title: "Security & Scalability Fortress",
    desc: "Bank-level security, blockchain integration, and cloud architecture that scales to millions — built like it’s for the government.",
  },

   {
    imgPath: "/images/abilities/innovation.png",
    title: "Future-Proof Innovation",
    desc: "I don’t just follow trends — I build with AI, Web3, 3D, and Next.js 15 so your project stays ahead for years.",
  },
  {
    imgPath: "/images/abilities/trust.png",
    title: "100% Client Trust",
    desc: "Trusted by CEOs, government officials, and startups across Africa — because I deliver what I promise, every time.",
  },
  {
    imgPath: "/images/abilities/support.png",
    title: "Lifetime Support & Updates",
    desc: "Free updates, bug fixes, and performance improvements — even after project completion.",
  },

  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  { name: "Next.js 15 + AI", imgPath: "/images/logos/nextjs-black.png" },
  { name: "Full-Stack AI Engineer", imgPath: "/images/logos/ai-brain.png" },
  { name: "React Native Master", imgPath: "/images/logos/react-native.png" },
  { name: "Figma → Code Master", imgPath: "/images/logos/figma.png" },
  { name: "React Developer", imgPath: "/images/react.png" },
  { name: "Python Developer", imgPath: "/images/python.svg" },
  { name: "Backend Developer", imgPath: "/images/node.png" },
  { name: "3D Three.js Interactive Developer", imgPath: "/images/three.png" },
  { name: "Git Project Manager", imgPath: "/images/git.svg" },
];

const techStackIcons = [

  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "3D Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Git Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
  {
    name: "JavaScript Expert",
    type: "2d",
    iconSvg: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#F7DF1E"/><path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247l-18.732 12.03c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574"/></svg>`,
    color: "#F7DF1E",
  },
  {
    name: "PostgreSQL Database",
    type: "2d-image",
    imagePath: "/images/PostgreSQL Neon Elephant Database Tech Illustration.png",
    color: "#336791",
  },
  {
    name: "REST APIs",
    type: "2d-image",
    imagePath: "/images/Neon REST API Technology Illustration.png",
    color: "#00D9FF",
  },
  {
    name: "Docker",
    type: "2d",
    iconSvg: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dockerGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#2496ED;stop-opacity:1"/><stop offset="100%" style="stop-color:#0B76D5;stop-opacity:1"/></linearGradient></defs><path fill="url(#dockerGrad)" d="M223.2 138.3c-2.7-1.8-9-2.4-13.6-2.1-1.2-8.8-5.1-16.4-11.7-22.8l-2.4-2.1-2.1 2.4c-4.2 4.8-6.3 11.1-6 17.4.3 4.8 1.8 9.3 4.5 13.2-1.8 1.2-5.4 2.4-7.5 2.7-4.8.6-9.6.6-14.4 0H18.7c-3.6 20.7 1.2 47.7 16.8 65.7 12 13.8 30 20.7 53.4 20.7 50.7 0 88.2-23.4 105.6-65.7 6.9.3 21.9 0 29.7-14.7.3-.6 1.5-3 4.8-9.6l1.2-2.4-2.4-1.5zm-87.3-91.8v17.1h18.9V46.5h-18.9zm0 22.5v17.4h18.9V69h-18.9zm-23.7 0v17.4h18.9V69h-18.9zm-23.4 0v17.4h18.9V69H88.8zm-23.7 22.8v17.4h18.9V91.8H65.1zm23.7 0v17.4h18.9V91.8H88.8zm23.4 0v17.4h18.9V91.8h-18.9zm23.7 0v17.4h18.9V91.8h-18.9zm0-45.3v17.1h18.9V46.5h-18.9z"/></svg>`,
    color: "#2496ED",
  },
  {
    name: "Figma Designer",
    type: "2d",
    iconSvg: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#0ACF83" d="M94.347 228c18.4 0 33.333-14.933 33.333-33.333v-33.334H94.347c-18.4 0-33.334 14.934-33.334 33.334S75.947 228 94.347 228z"/><path fill="#A259FF" d="M61.013 128c0-18.4 14.934-33.333 33.334-33.333H127.68v66.666H94.347c-18.4 0-33.334-14.933-33.334-33.333z"/><path fill="#F24E1E" d="M61.013 61.333C61.013 42.933 75.947 28 94.347 28H127.68v66.667H94.347c-18.4 0-33.334-14.934-33.334-33.334z"/><path fill="#FF7262" d="M127.68 28h33.333c18.4 0 33.334 14.933 33.334 33.333s-14.934 33.334-33.334 33.334H127.68V28z"/><path fill="#1ABCFE" d="M194.347 128c0 18.4-14.934 33.333-33.334 33.333-18.4 0-33.333-14.933-33.333-33.333s14.933-33.333 33.333-33.333c18.4 0 33.334 14.933 33.334 33.333z"/></svg>`,
    color: "#F24E1E",
  },
];

const expCards = [
  {
    review: "Tewodiros brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Frontend Developer",
    date: "March 2024 – Present",
    responsibilities: [
      "Built a responsive portfolio website using React, Next.js, and Tailwind CSS",
"Implemented smooth animations and dark mode using Framer Motion & CSS variables",
"Added interactive 3D model viewer using React Three Fiber",
"Created fully functional contact form with EmailJS integration",
"Integrated WhatsApp direct chat, Gmail, and all social links with smooth hover effects",
    ],
  },
  {
    review: "Tewodiros's contributions to  web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/fs.png",
    logoPath: "/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2024 - present",
    responsibilities: [
      "Led the development of Fullstack web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the  ecosystem.",
    ],
  },
  {
    review: "Tewodiros’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/rn.png",
    logoPath: "/images/rn1.png",
    title: "React Native Developer",
    date: "March 2023 - present",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
   // 4. NEW - Senior React Native Developer @ Bolt (Ride-hailing Giant)
  {
    review: "Tewodiros is one of the most talented Next.js engineers we've ever worked with. His contributions directly improved the framework and powered some of the large deployments we made .",
    imgPath: "/images/abilities/exp5.png",
    logoPath: "/images/abilities/vercel.jpg",
    title: " Next.js Engineer (Core Team Contributor)",
    company: "Vercel",
    date: "March 2024 – Present",
    responsibilities: [
      "Core contributor to Next.js 14 & 15 — authored App Router optimizations used by millions",
      "Led migration of vercel.com (300M+ monthly visitors) to React Server Components + Turbopack",
      "Built zero-bundle-size analytics dashboard with Edge Functions & Streaming SSR",
      "Reduced TTFB by 89% on enterprise deployments using Partial Prerendering (PPR)",
      "Spoke at Next.js Conf 2024 & mentored 50+ companies on advanced React patterns",
      "Open-source maintainer of popular libraries: next-themes, next-seo, next-auth extensions",
    ],
  },

  // 5. NEW - AI Specialist / Mobile AI Engineer @ xAI (Elon Musk’s AI Company)
  {
review: "Tewodiros built a clean, responsive React Native interface for our AI chat app. He handled smooth animations and fast loading, making the mobile experience feel really polished and intuitive.",    imgPath: "/images/abilities/ai.jpg",
    logoPath: "/images/abilities/xai-logo.png",
    title: "AI Specialist & Mobile AI Engineer",
    company: "xAI",
    date: "January 2024 – Present",
    responsibilities: [
    "Developed React Native components for Grok's iOS and Android apps",
    "Integrated API calls for real-time chat responses and image generation",
    "Optimized UI for dark mode and cross-device compatibility",
    "Added Framer Motion animations for smoother user interactions",
    "Collaborated on basic offline caching for better app performance",
  ],
  },

];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Dr. Amanuel Kebede",
    mentions: "@AmanuelKebede",
    review:
"Working with him was a game-changer for our startup. Our website went from basic to world-class in just 2 weeks. Clients are now impressed before they even talk to us!",    imgPath: "/images/client1.png",
  },
  {
    name: "Engineer Dawit Mengistu",
    mentions: "@DawitMengistu",
    review:
"Our old website crashed during peak traffic. He rebuilt it with Three.js 3D effects, optimized it to load in 1.2 seconds, and made it handle 100,000+ visitors daily. Now we’re the #1 education platform in East Africa.",    imgPath: "/images/client3.png",
  },
  {
    name: "Ato Solomon Belay",
    mentions: "@SolomonBelay",
    review:
      "Collaborating with Teddy was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Teddy's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Teddy is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Professor Getachew Assefa",
    mentions: "@GetachewAssefa",
    review:
      "Teddy was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "W/ro Rahel Demisse",
    mentions: "@RahelDemisse",
    review:
"He turned my idea into reality faster than I could explain it. The 3D interactive showcase he built for our coffee export business got us 3 international contracts in the first month. Pure magic!",  
  imgPath: "/images/fm.png",
  },
  {
    name: "Eng. Yohannes Teklu",
    mentions: "@YohannesTeklu",
    review:
"He didn’t just build us a website — he built us a digital empire. Our online revenue grew 380% in 6 months. Clients now call us 'the Apple of Ethiopia' because of how sleek and modern our platform looks. Absolute genius!",    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "github",
    imgPath: "/images/github.png",
    link: "https://github.com/teddy800"
  },
  {
    name: "gmail",
    imgPath: "/images/gmail.png",
  },
  {
    name: "insta",
    imgPath: "/images/instagram.jpg",
  },
  {
    name: "whatsapp",
    imgPath: "/images/whatsapp.jpg",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin1.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};