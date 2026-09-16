/* ============================================================
   EDIT EVERYTHING HERE.
   This is the only file you need to touch to change the content
   of the site. Nothing below is hard-coded anywhere else.
   ============================================================ */

export const profile = {
  name: 'Prithviraj Salunke',
  firstName: 'Prithviraj',
  lastName: 'Salunke',
  role: 'Computer Engineering student',
  version: 'v1',

  // Shown in the hero, under the name.
  intro:
    "I'm learning software development, AI/ML and a bit of creative technology — writing code, breaking it, and building my skills one project at a time.",

  // The "this is only V1" message, shown under the hero buttons.
  notice: 'This is the initial version of my portfolio. The main one is currently being built.',
  noticeSub: 'Consider this a first commit, not a finished product — it will keep adapting as I do.',
}

/* ---- Links. Replace the placeholders below. ---------------- */
export const links = {
  email: 'salunkeprithviraj00@gmail.com', // e.g. 'prithviraj@example.com'
  github: 'https://github.com/Prithviraj5004', // e.g. 'https://github.com/username'
  linkedin: 'https://www.linkedin.com/in/prithviraj-salunke-b4a68b272/', // e.g. 'https://linkedin.com/in/username'
  twitter: 'https://x.com/Prithv111', // e.g. 'https://x.com/username'
}

/* Labels shown next to each link in the contact list. */
export const contactHandles = {
  email: links.email,
  github: '@Prithviraj5004',
  linkedin: 'PRITHVIRAJ SALUNKE',
  twitter: '@Prithv111',
}

/* ---- About: one paragraph per array item. ------------------ */
export const about = {
  heading: "Still early, and that's the point.",
  paragraphs: [
    "I'm a Computer Engineering student. Most of my time right now goes into the fundamentals — writing Python, C and Java, working through data structures and algorithms, and getting comfortable with Git.",
    'Outside of coursework I\u2019m curious about AI/ML, and lately about how LLMs and RAG actually work under the hood. I also spend time in Blender and mess around with game ideas and video editing, which is where the more creative side of me ends up.',
    "I don't have a long list of shipped projects yet. I'm building that part now — this site is where it will show up.",
  ],
}

/* ---- Skills, grouped. Add or rename groups freely. ---------- */
export const skillGroups = [
  { title: 'Languages', items: ['Python', 'C', 'Java'] },
  { title: 'Foundations & tools', items: ['DSA', 'Git', 'GitHub'] },
  { title: 'Exploring', items: ['AI/ML', 'RAG', 'LLMs', 'Blender'] },
]

export const skillsCaveat =
  "These are things I've worked with and am actively improving at — not claims of mastery."

/* ---- Currently learning: an evolving roadmap. --------------- */
export const currentlyLearning = [
  { label: 'Python', note: 'Going past syntax — writing small tools instead of exercises.' },
  { label: 'C', note: 'Memory, pointers, and understanding what the machine is actually doing.' },
  {
    label: 'Java + DSA',
    note: 'Solving problems consistently and learning to reason about complexity.',
  },
  { label: 'AI/ML', note: 'The fundamentals first: how models learn, and why they fail.' },
  {
    label: 'RAG and LLM concepts',
    note: 'Embeddings, retrieval, and where these systems break down.',
  },
  {
    label: 'Real projects',
    note: 'Turning all of the above into things that exist outside a folder on my laptop.',
  },
]

/* ---- Contact + footer -------------------------------------- */
export const contact = {
  heading: "Let's build something.",
  body: "I'm learning, experimenting and building. If you want to talk about code, a project, or anything on this page, reach out.",
}

export const footer = {
  copyright: `${profile.name} © 2026`,
  vibe:'I will adapt to environment and Build everything with scratch.'
}

/* ---- Navigation (ids must match the section ids). ---------- */
export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'learning', label: 'Currently learning' },
  { id: 'contact', label: 'Contact' },
]
