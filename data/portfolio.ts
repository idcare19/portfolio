export const portfolioData = {
  owner: {
    name: "Abhishek",
    username: "idcare19.dev",
    identityLine: "idcare19.dev / India",
    introLine: "Hi, I'm Abhishek",
    role: "Full Stack Developer and Next.js Developer",
    tagline:
      "I craft modern, high-performance websites and web apps with clean architecture and premium user experience.",
    location: "India",
    badges: ["Open to Freelance", "Internship Ready", "Available for Projects"],
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],
  heroTech: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js"],
  about: {
    intro:
      "I turn ideas into premium web products with clear structure, thoughtful interactions, and strong performance. My focus is responsive UI, smooth motion, and production-ready front-end quality.",
    stats: [
      { label: "Projects Completed", value: "16+" },
      { label: "Technologies Learned", value: "7+" },
      { label: "Months of Learning", value: "8+" },
    ],
  },
  skills: [
    "HTML/CSS",
    "JavaScript",
    "PHP",
    "MySQL",
    "WordPress",
    "Git & GitHub",
    "Design (Photoshop)",
    "Laravel",
    "React",
    "Testing",
  ],
  learningPhase: ["App Security", "Advanced Laravel", "Scalable React Apps"],
  projects: [
    {
      title: "Devfolio - Portfolio Template",
      description: "A blazing-fast, accessible portfolio template built with semantic HTML, modern CSS, and vanilla JavaScript.",
      image: "/projects/portfolio.png",
      tech: ["HTML", "CSS", "JavaScript"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Ecommerce Clone",
      description: "Clean storefront with cart, filters, and checkout flow, focused on clarity and conversion.",
      image: "/projects/ecomm.png",
      tech: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://ecommerce-website-clone-ruby.vercel.app",
      githubUrl: "https://github.com/idcare19/ecommerce-website-clone",
    },
    {
      title: "DashX - Analytics Dashboard",
      description: "Responsive dashboard with charts, dark mode, and keyboard navigation.",
      image: "/projects/dash.png",
      tech: ["React", "Laravel", "MySQL"],
      liveUrl: "https://abhishek21.free.nf/dashboard",
      githubUrl: "https://github.com/idcare19/dashboard",
    },
    {
      title: "Hirefind",
      description: "A full-stack job platform built with React and Appwrite where candidates apply, companies post jobs, and admins manage the hiring workflow.",
      image: "/projects/hirefind.png",
      tech: ["React", "Appwrite"],
      liveUrl: "https://hirefind.idcare19.me",
      githubUrl: "https://github.com/idcare19/hirefind",
    },
    {
      title: "Self Destructing Chat Web App",
      description: "A blazing-fast, privacy-first chat application designed for secure and temporary conversations.",
      image: "/projects/chat.png",
      tech: ["Vite", "JavaScript", "Appwrite"],
      liveUrl: "https://vainsh.idcare19.me",
      githubUrl: "https://github.com/idcare19/vainsh/",
    },
  ],
  reviews: [
    {
      clientName: "Rakesh.dev",
      website: "https://rakesh-dev-portfolio.vercel.app",
      quote:
        "Abhishek delivered a clean, fast portfolio with excellent attention to UI details. Communication was smooth and every requested change was implemented quickly.",
    },
    {
      clientName: "Nitin.dev",
      website: "https://nitin-dev-portfolio.vercel.app",
      quote:
        "Very professional and reliable. The final website feels premium, responsive, and polished across devices. Highly recommended for portfolio and frontend work.",
    },
  ],
  collaboration: {
    users: [
      { name: "Abhishek", color: "bg-blue-500" },
      { name: "Teammate", color: "bg-cyan-500" },
      { name: "Designer", color: "bg-violet-500" },
    ],
    board: [
      { title: "UI polish", status: "Live editing" },
      { title: "API integration", status: "Syncing" },
      { title: "Deploy checks", status: "Review" },
    ],
    events: ["Code synced", "New comment added", "Build passed", "Changes deployed"],
  },
  experience: [
    {
      role: "Full Stack Developer - Freelance",
      period: "2026 - Present",
      summary:
        "Began freelancing at 16 years old, providing end-to-end web development and cybersecurity solutions. Built secure, scalable applications, performed penetration testing, and advised clients on best security practices.",
    },
  ],
  socials: [
    { label: "Email", value: "personal@idcare19.me", href: "mailto:personal@idcare19.me" },
    { label: "GitHub", value: "github.com/idcare19", href: "https://github.com/idcare19" },
    { label: "LinkedIn", value: "linkedin.com/in/abhishekidcare19", href: "https://www.linkedin.com/in/abhishekidcare19/" },
  ],
};

export type PortfolioData = typeof portfolioData;
