/**
 * Edit this file to update the Robes Leadership | Technology pages.
 * Do not describe leadership areas as paid services you already sell.
 * Do not add client counts, testimonials, or performance figures here.
 *
 * Logo files belong in /public/brand/. See public/brand/README.txt.
 */

export const robes = {
  name: 'Robes Leadership | Technology',
  shortName: 'Robes',
  proposition: 'Empowering Businesses Through Technology. Advancing People Through Leadership.',
  status:
    'Robes is an emerging brand led by Christopher Agba. This site does not present it as a registered company, an established agency, or a large team.',
  vision:
    'Organizations that can see their work clearly, and people who can lead that kind of change with sound judgment.',
  mission:
    'To help businesses replace fragile manual operations with reliable software, and to develop a leadership practice that stays honest about what is ready and what is still ahead.',
  logos: {
    green: '/brand/robes-logo-green.jpg',
    black: '/brand/robes-logo-green.jpg',
    white: '/brand/robes-logo-green.jpg',
    mark: '/brand/robes-logo-green.jpg',
  },
  navigation: [
    { label: 'About Robes', to: '/robes' },
    { label: 'Solutions', to: '/robes/solutions' },
    { label: 'Leadership', to: '/robes/leadership' },
    { label: 'Contact', to: '/robes/contact' },
  ],
  problems: [
    {
      title: 'Repetitive manual operations',
      detail:
        'Staff re-enter the same information, chase the same approvals, and rebuild the same reports.',
      value: 'Less administrative drag, so people can spend time on the work that actually moves the business.',
    },
    {
      title: 'Approvals and reports that are hard to see',
      detail:
        'Requests live in inboxes and chat threads. Managers ask for updates because the process cannot show its own status.',
      value: 'A visible workflow, with an owner and a status, and reporting that does not have to be assembled by hand.',
    },
    {
      title: 'Software the business has outgrown',
      detail:
        'Older systems still carry the operation, but they are slow to change and frustrating for the people who use them.',
      value: 'A modernization path that improves reliability without throwing away what already works.',
    },
    {
      title: 'Systems that do not talk to each other',
      detail: 'Useful records stay trapped in separate tools, and staff become the integration.',
      value: 'Connections that move the data the business needs, with less repeated entry.',
    },
    {
      title: 'No reliable tool for a specific operation',
      detail:
        'A generic product, or a spreadsheet, is standing in for a process that is particular to the company.',
      value: 'A custom application shaped around that operation, built so it can be maintained.',
    },
    {
      title: 'Poor visibility for people who run the business',
      detail: 'Leaders hear about problems late because everyday work does not produce a clear picture.',
      value: 'Operational visibility: what is waiting, what is done, and what is blocked.',
    },
  ],
  solutions: [
    {
      id: 'enterprise-software-development',
      title: 'Enterprise Software Development',
      summary: 'Business systems that staff can use to run real operations, not a demo that fades after launch.',
      outcome:
        'A system of record for the work that matters: clearer handovers, fewer conflicting versions, and software that can keep being improved.',
    },
    {
      id: 'business-process-automation',
      title: 'Business Process Automation',
      summary: 'Approvals, status, and routine reporting moved out of inboxes and repeated manual effort.',
      outcome:
        'Shorter administrative cycles and a process someone can still understand and check.',
    },
    {
      id: 'custom-business-applications',
      title: 'Custom Business Applications',
      summary: 'Internal tools and operational applications designed around one company’s actual workflow.',
      outcome:
        'Teams stop working around a product that was built for someone else.',
    },
    {
      id: 'software-modernization',
      title: 'Software Modernization and Digital Transformation',
      summary: 'Improve a system the business already depends on: usability, reliability, and the ability to change it.',
      outcome:
        'Less operational risk than a rushed replacement, and a system people are more willing to use.',
    },
    {
      id: 'api-integration',
      title: 'API Development and Systems Integration',
      summary: 'Secure connections between the applications and services the business already uses.',
      outcome: 'Information moves between tools, and reporting can draw on a more complete picture.',
    },
    {
      id: 'it-consulting',
      title: 'IT Consulting and Technical Solutions',
      summary: 'A direct assessment of a systems problem, with a recommendation a decision-maker can use.',
      outcome: 'A clearer choice before money is spent on the wrong build.',
    },
    {
      id: 'software-maintenance',
      title: 'Software Maintenance and Support',
      summary: 'Ongoing care for software after delivery: fixes, small improvements, and continuity.',
      outcome: 'The system keeps serving the business after the first release.',
    },
  ],
  approach: [
    {
      title: 'Name the business challenge',
      text: 'Robes starts with what is slow, unclear, or fragile in the operation. The software question comes after that.',
    },
    {
      title: 'Recommend a practical path',
      text: 'That may be a focused application, a change to a system you already have, or an integration. The recommendation is explained in business language.',
    },
    {
      title: 'Agree the scope',
      text: 'You see what is included, what is not, and how the work will be handed over. Fees follow that scope. They are not published as fixed packages.',
    },
    {
      title: 'Build, test, and leave it maintainable',
      text: 'Delivery includes the paths people will actually use. The result should still make sense to another developer later.',
    },
  ],
  leadership: [
    {
      title: 'Leadership Development',
      text: 'A future practice for helping people take responsibility, communicate clearly, and lead without theatrics.',
    },
    {
      title: 'Technology Leadership',
      text: 'How technical decisions are explained to a business, and how leaders stay close to the systems they depend on.',
    },
    {
      title: 'Organizational Growth and Transformation',
      text: 'The link between how a company works and the technology it adopts as it grows.',
    },
    {
      title: 'Strategic Thinking and Innovation',
      text: 'Choosing a few changes that matter, rather than collecting tools.',
    },
    {
      title: 'Mentorship and Capacity Development',
      text: 'Helping people grow their judgment, not only their task list.',
    },
  ],
  productVision: {
    title: 'RobesAPI',
    text: 'RobesAPI is an API platform concept Christopher intends to pursue. It is a product idea in development. No features are available to buy or integrate today, and this site does not advertise a launch date.',
  },
}

export function robesServiceChoices() {
  return [
    { id: 'clearrequest', title: 'A solution similar to the ClearRequest demonstration' },
    { id: 'waynote', title: 'A solution similar to the Waynote demonstration' },
    { id: 'spendgate', title: 'A solution similar to the SpendGate demonstration' },
    ...robes.solutions.map((item) => ({ id: item.id, title: item.title })),
    { id: 'not-sure', title: 'Not sure yet — help us define the challenge' },
  ]
}

export function brandJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: robes.name,
    slogan: robes.proposition,
    description: robes.status,
  }
}
