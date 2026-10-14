/**
 * Edit this file to update the website.
 * Services, case studies, biography, and contact links live here.
 * Leave a link as an empty string to hide it.
 * Set a case study's `published` field to false to hide it.
 * Add employer or product names only when you have permission to publish them.
 */

export type CaseStudyStatus = 'experience' | 'demonstration'

export type CaseStudy = {
  slug: string
  title: string
  sector: string
  status: CaseStudyStatus
  statusLabel: string
  summary: string
  challenge: string
  responsibility: string
  approach: string
  technologies: string[]
  outcomes: string[]
  outcomesLabel: string
  note: string
  published: boolean
}

export type Service = {
  id: string
  title: string
  summary: string
  details: string
  value: string
  suitedTo: string
}

export const site = {
  name: 'Christopher Agba',
  role: 'Enterprise Software Engineer | Business Systems & Automation Consultant',
  shortRole: 'Enterprise Software Engineer',
  location: 'Abuja, Nigeria',
  /** Portrait served from /public. Replace the file, or change this path. */
  portrait: '/images/christopher-agba.jpg',
  /**
   * Public site URL for canonical and social metadata.
   * Public address of this site. Used for canonical and social metadata.
   */
  siteUrl: 'https://christopher-agba.onrender.com',
  valueProposition:
    'I help businesses simplify complex operations, automate inefficient processes, and build reliable software systems that improve productivity and support growth.',
  hero: {
    titleStart: 'Technology That Helps Businesses',
    titleEmphasis: 'Run Better.',
    support:
      'I design and build reliable business software, automate complex workflows, and modernize existing systems to help organizations operate more efficiently.',
    availability:
      'Based in Abuja, Nigeria. Open to organizations in Nigeria and internationally.',
  },
  ctas: {
    nav: 'Discuss Your Project',
    primary: 'Discuss Your Project',
    secondary: 'Explore My Work',
    finalTitle: "Have a Business Challenge? Let's Build the Right Solution.",
    finalText:
      'Tell me what is slowing the operation down, or what your engineering team needs delivered. I will reply with a practical next step.',
    finalButton: "Let's Talk Business",
  },
  contact: {
    email: 'agbachris555@gmail.com',
    phoneDisplay: '+234 816 679 7044',
    phoneTel: '+2348166797044',
    whatsapp: 'https://wa.me/2348166797044',
    location: 'Abuja, Nigeria',
    youtube: 'https://www.youtube.com/channel/UCTBvtGeUdEun20bPP2hZRPw',
    youtubeLabel: 'YouTube — talks and leadership topics',
    /** Paste a full profile URL to show the link. Empty hides it. */
    linkedin: '',
    github: '',
    /** Example: /christopher-agba-cv.pdf after you add the file to /public. */
    resumeUrl: '',
  },
  audiences: [
    {
      title: 'Businesses with operational complexity',
      text: 'Construction and engineering firms, logistics and distribution companies, and growing organizations that still depend on manual approvals, spreadsheets, or software staff have to work around.',
      href: '/solutions',
      action: 'See business solutions',
    },
    {
      title: 'Technology teams that need a backend partner',
      text: 'Startups, software agencies, and engineering groups that need help with APIs, integrations, modernization, or steady backend delivery.',
      href: '/solutions#backend-engineering-partnerships',
      action: 'See engineering partnerships',
    },
  ],
  problems: [
    {
      title: 'Delayed manual approvals and repetitive administrative work',
      detail:
        'Teams lose hours chasing signatures, status updates, and the same data entered more than once.',
      value:
        'A defined workflow gives each request an owner and a status, so work moves without constant follow-up.',
    },
    {
      title: 'Disconnected spreadsheets and fragmented business records',
      detail:
        'When records live in separate files, people disagree about which version is current and handovers become fragile.',
      value:
        'A shared system of record reduces rework and makes the operation less dependent on one person’s files.',
    },
    {
      title: 'Poor visibility into business operations',
      detail:
        'Leaders ask for updates because the operation itself cannot show what is waiting, done, or blocked.',
      value:
        'Operational reporting turns everyday activity into a view people can manage.',
    },
    {
      title: 'Inefficient inventory, procurement, or equipment management',
      detail:
        'Materials, requests, and equipment are hard to track when the process depends on memory and messages.',
      value:
        'Clear records and approvals help teams see what was requested, approved, and received.',
    },
    {
      title: 'Outdated software requiring modernization',
      detail:
        'Older systems can still run the business while becoming slow, difficult to change, or frustrating to use.',
      value:
        'Modernization improves reliability and usability without discarding what already works.',
    },
    {
      title: 'Applications that need reliable integrations and reporting',
      detail:
        'Useful data stays trapped when systems do not exchange it, and reports are rebuilt by hand.',
      value:
        'Secure APIs and practical reporting connect the tools people already depend on.',
    },
  ],
  services: [
    {
      id: 'custom-business-software',
      title: 'Custom Business Software',
      summary:
        'Tailored web applications, ERP modules, internal tools, and operational management platforms.',
      details:
        'When a spreadsheet or a generic product no longer fits the way the company works, I design software around the actual process. That can be an internal tool, a module alongside an existing system, or a focused application for one part of the operation.',
      value:
        'Your team gets software that matches the work, instead of working around a tool built for someone else.',
      suitedTo:
        'Construction and engineering firms, logistics businesses, and growing companies whose operations are not a standard template.',
    },
    {
      id: 'business-process-automation',
      title: 'Business Process Automation',
      summary:
        'Digital approvals, automated reporting, workflow optimization, and less repetitive manual work.',
      details:
        'I look for the tasks people repeat: chasing approvals, copying data, and rebuilding the same reports. Automation is useful when it removes that drag and leaves a process someone can still understand and check.',
      value:
        'Staff spend less time on administration, and leaders wait less for basic answers.',
      suitedTo:
        'Organizations that still run important work through inboxes, paper, and spreadsheets.',
    },
    {
      id: 'enterprise-software-modernization',
      title: 'Enterprise Software Modernization',
      summary:
        'Improving legacy systems: usability, performance, reliability, and maintainability.',
      details:
        'Replacing an entire system is not always the right first step. I look at what the current software does well, where it fails the people using it, and what can be improved safely. The aim is a system the business can keep using and a developer can keep changing.',
      value:
        'You reduce operational friction without a disruptive rewrite the organization is not ready for.',
      suitedTo: 'Companies with older internal systems that still carry the business.',
    },
    {
      id: 'api-development-integration',
      title: 'API Development & Integration',
      summary:
        'Secure APIs and connections between business applications and third-party services.',
      details:
        'I build APIs and integrations so systems can exchange the data the business actually needs. The work includes clear boundaries, careful handling of data, and a result another developer can maintain.',
      value:
        'Information moves between tools without repeated manual entry, and reporting can use a more complete picture.',
      suitedTo:
        'Businesses joining existing software together, and technology teams that need dependable backend integration.',
    },
    {
      id: 'technical-consulting-support',
      title: 'Technical Consulting & Ongoing Support',
      summary:
        'Systems assessment, technical problem-solving, software maintenance, and continuous improvement.',
      details:
        'Some engagements start with a question, not a build. I can review how a system is put together, help unblock a technical problem, and stay on to maintain and improve software after delivery.',
      value:
        'You get a direct technical partner who can explain options in business language and then do the work.',
      suitedTo:
        'Owners and managers who need a clear recommendation, and teams that need continuity after a project ships.',
    },
    {
      id: 'backend-engineering-partnerships',
      title: 'Backend Engineering Partnerships',
      summary:
        'Backend development, integrations, architecture support, and delivery for software companies and engineering teams.',
      details:
        'I join product and agency teams that need an engineer for backend features, integrations, and the practical parts of delivery. I am used to business applications where correctness and maintainability matter more than a demo.',
      value:
        'Your team gets additional engineering capacity from someone who has worked on operational software.',
      suitedTo:
        'Technology startups, software agencies, and international teams looking for experienced backend support.',
    },
  ] satisfies Service[],
  serviceNote:
    'I do not publish fixed prices. A construction workflow, an integration, and a modernization effort are not the same project. Describe the problem and I will recommend an approach and a scoped proposal.',
  otherServiceOption: {
    id: 'not-sure',
    title: 'Not sure yet — help me define it',
  },
  process: [
    {
      title: 'Discover the business problem',
      text: 'We start with what is slow, unclear, or fragile in the operation. The software question comes after the business question.',
    },
    {
      title: 'Assess requirements and recommend an approach',
      text: 'I look at the people, the current tools, and the constraints, then recommend a practical way forward. That may be a new tool, a change to an existing system, or an integration.',
    },
    {
      title: 'Agree on scope, timeline, and deliverables',
      text: 'You will know what is included, what is not, and how the work will be handed over. I would rather narrow a scope than promise a system nobody can maintain.',
    },
    {
      title: 'Develop, test, and deliver the solution',
      text: 'I build against the agreed scope, test the paths people will actually use, and keep you informed in plain language while the work is in progress.',
    },
    {
      title: 'Provide agreed support and improvements',
      text: 'After delivery, support and improvements follow what we agreed. The goal is software your organization can keep running, not a project that ends in confusion.',
    },
  ],
  reasons: [
    {
      title: 'Business-first thinking',
      text: 'I start from the operational problem, then choose the software approach. The point is a business that runs more clearly, not a stack for its own sake.',
    },
    {
      title: 'Practical enterprise software experience',
      text: 'I have developed and maintained business applications people use to run real operations, including construction-related systems, workflows, databases, and reporting.',
    },
    {
      title: 'Reliable and maintainable solutions',
      text: 'I care about software another developer can understand after the project ends. A clever build that nobody can change is a future problem.',
    },
    {
      title: 'Clear communication',
      text: 'You get direct answers, explicit scope, and explanations a manager can use. Technical detail is available when the decision needs it.',
    },
    {
      title: 'A long-term partnership mindset',
      text: 'Support, maintenance, and the next improvement are part of the conversation from the beginning.',
    },
  ],
  about: {
    lead: 'I build business software for organizations that need their operations to be clearer, more reliable, and easier to manage.',
    paragraphs: [
      'I studied Computer Science and have hands-on experience developing and maintaining enterprise business applications. That work includes construction and operational systems, workflow management, databases, operational reporting, and business automation.',
      'The tools I use in that work include PHP, MySQL, APIs, and the practical job of modernizing systems that are already part of how a company runs. I am interested in the organization as well as the code. A useful system has to fit the way people approve work, keep records, and answer questions from leadership.',
      'I am also interested in technology leadership and in building software products over time. Robes Leadership | Technology is the business brand I am developing for that work. RobesAPI, an API platform concept, belongs to that longer direction. It is not a product you can buy today. Clients hire me to solve an operational or engineering problem and to leave behind software that can be maintained.',
    ],
  },
  expertise: [
    {
      title: 'Application development',
      items: ['PHP', 'MySQL', 'Enterprise web applications', 'Internal operational tools'],
    },
    {
      title: 'Business systems',
      items: [
        'Workflow management',
        'Operational reporting',
        'Process automation',
        'Records and approvals',
      ],
    },
    {
      title: 'Integration and modernization',
      items: [
        'API development',
        'Connecting business applications',
        'Improving legacy systems',
        'Maintenance and support',
      ],
    },
    {
      title: 'Also part of my background',
      items: ['Computer Science', 'Networking', 'UI/UX design with Figma', 'Technical problem-solving'],
    },
  ],
  caseStudies: [
    {
      slug: 'construction-operations-systems',
      title: 'Business systems for construction operations',
      sector: 'Construction and operations',
      status: 'experience',
      statusLabel: 'Professional experience',
      summary:
        'Development and maintenance of enterprise business applications used to support construction and operational work, including workflows, databases, and reporting.',
      challenge:
        'Construction and operational teams depend on internal software to keep records, move approvals, and see what is happening in the business. When that software is difficult to use or difficult to change, everyday work becomes slower and harder to supervise.',
      responsibility:
        'I developed and maintained enterprise application features in a live business setting. The work included workflow support, database-backed records, operational reporting, and the practical fixes required to keep a business system useful.',
      approach:
        'I start from the operational task, then improve the software around it: clearer workflows, reliable data handling, and reporting that can answer management questions. Changes are made so the system stays understandable and maintainable.',
      technologies: [
        'PHP',
        'MySQL',
        'Enterprise web applications',
        'Operational reporting',
        'Workflow management',
      ],
      outcomesLabel: 'What this work covered',
      outcomes: [
        'Enterprise application development and maintenance in a real operational setting',
        'Workflow, database, and reporting features that support daily business work',
        'Modernization and reliability work typical of long-lived internal systems',
      ],
      note: 'Client, employer, and product names are withheld, along with internal screens and any performance figures. This summary describes the type of responsibility only. It is not a public endorsement and it does not claim measured results.',
      published: true,
    },
    {
      slug: 'approval-flow-demonstration',
      title: 'From spreadsheet handoffs to a visible approval flow',
      sector: 'Operations, procurement, and administration',
      status: 'demonstration',
      statusLabel: 'Independent demonstration',
      summary:
        'A working model of how a growing company can replace scattered requests with one path for submission, approval, recording, and management visibility. This is not a client project.',
      challenge:
        'Approvals for purchases, equipment, or operational tasks often move through chat, paper, and spreadsheets. People chase updates, records diverge, and managers cannot see what is waiting.',
      responsibility:
        'I use this demonstration to show how I structure the problem before proposing software: the request, the decision, the record, and the view a manager needs.',
      approach:
        'Map one process from start to finish. Give every request an owner and a status. Keep a single record. Show what is pending, approved, or blocked. Only then decide whether the right build is a focused internal tool, a module in an existing system, or an integration.',
      technologies: ['Process design', 'Web application structure', 'Operational reporting'],
      outcomesLabel: 'What this demonstration is for',
      outcomes: [
        'A concrete way to discuss a real approval or request process',
        'A clear split between the business problem and the software options',
        'A starting point for a scoped proposal',
      ],
      note: 'Independent demonstration. There is no client, no production deployment, and no performance statistic attached to this example.',
      published: true,
    },
    {
      slug: 'replace-this-slug',
      title: 'Case study title',
      sector: 'Industry',
      status: 'experience',
      statusLabel: 'Professional experience',
      summary: 'One or two sentences a managing director can understand.',
      challenge: 'Describe the business or technical problem.',
      responsibility: 'Describe what you were personally responsible for.',
      approach: 'Describe the approach you took.',
      technologies: ['PHP', 'MySQL'],
      outcomesLabel: 'What this work covered',
      outcomes: ['Describe only what you can verify. Do not invent metrics.'],
      note: 'Add a confidentiality note if names or figures should stay private.',
      published: false,
    },
  ] satisfies CaseStudy[],
}

export const navigation = [
  { label: 'About', to: '/about' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Selected Work', to: '/work' },
  { label: 'Contact', to: '/contact' },
] as const

export const personalInquiries = [
  { id: 'employment', title: 'Employment or a professional role' },
  { id: 'collaboration', title: 'Technical collaboration' },
  { id: 'speaking', title: 'Speaking or a leadership conversation' },
  { id: 'networking', title: 'Professional introduction' },
] as const

export function getPublishedCaseStudies() {
  return site.caseStudies.filter((item) => item.published)
}

export function getCaseStudy(slug: string) {
  return getPublishedCaseStudies().find((item) => item.slug === slug)
}

export function serviceChoices() {
  return [
    ...personalInquiries.map((item) => ({ id: item.id, title: item.title })),
    ...site.services.map((service) => ({ id: service.id, title: service.title })),
    site.otherServiceOption,
  ]
}

export function socialLinks() {
  const links = [
    site.contact.linkedin ? { label: 'LinkedIn', href: site.contact.linkedin } : null,
    site.contact.github ? { label: 'GitHub', href: site.contact.github } : null,
    site.contact.youtube
      ? { label: site.contact.youtubeLabel, href: site.contact.youtube }
      : null,
  ]
  return links.filter((item): item is { label: string; href: string } => item !== null)
}

export function personJsonLd() {
  const sameAs = [site.contact.linkedin, site.contact.github, site.contact.youtube].filter(
    (value) => value.length > 0,
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    description: site.valueProposition,
    email: site.contact.email,
    telephone: site.contact.phoneTel,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressCountry: 'NG',
    },
    knowsAbout: [
      'Enterprise software',
      'Business process automation',
      'Software modernization',
      'API development',
      'PHP',
      'MySQL',
    ],
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}
