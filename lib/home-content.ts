// Homepage copy for the v2 layout. Rule: every fact appears in exactly one
// place on the page. Other sections link to it (#case-*, #journey-*) instead
// of restating it. Numbers come from the resume, project notes or public repos.

export const TOOLS = [
  "Python",
  "Bash",
  "SQL",
  "Node.js",
  "Git",
  "Linux",
  "Docker",
  "Burp Suite",
  "OWASP ZAP",
  "Postman",
  "Nuclei",
  "Nmap",
  "Wireshark",
  "SIEM",
  "AWS",
  "GCP",
  "Terraform",
  "GitHub Actions",
  "Claude",
  "OpenAI",
  "Gemini",
  "LiteLLM",
];

/**
 * Conversation starters. Where a card already covers the topic the chip
 * jumps to it; the rest are plain labels.
 */
export const ASK_ME_ABOUT: { label: string; href?: string }[] = [
  { label: "API Testing", href: "#journey-jiostar" },
  { label: "Automation", href: "#case-regression" },
  { label: "Compliance", href: "#case-grc" },
  { label: "Security Architecture" },
  { label: "Full-Stack Development" },
  { label: "Agentic Workflows", href: "#hobby-agentic" },
  { label: "Detection Engineering", href: "#case-siem" },
  { label: "Cloud Security", href: "#case-iac" },
  { label: "Scripting" },
];

export type JourneyStop = {
  slug: string;
  dates: string;
  place: string;
  role: string;
  now?: boolean;
  /** Short tag for a stop that is neither current nor finished. */
  status?: string;
  workedOn: string;
  learned: string;
  contributed: string;
};

/** Newest first. */
export const JOURNEY: JourneyStop[] = [
  {
    slug: "now",
    dates: "2026 – now",
    place: "Building in the open",
    role: "Independent security projects",
    now: true,
    workedOn:
      "The open-source tools under Work, the HTB CWES path, and lab writeups on the blog.",
    learned:
      "Writing up a lab is the second time I learn it, and usually the time it sticks.",
    contributed:
      "Every project ships with tests and a README that states its limits, so anyone can check the claims.",
  },
  {
    slug: "jiostar",
    dates: "Feb – Aug 2026",
    place: "JioStar",
    role: "Cybersecurity Intern",
    workedOn:
      "Access governance, security test automation, API security testing and VAPT on internal tools, SIEM alert triage, and piracy threat intelligence.",
    learned:
      "The hard part of an access review is getting hundreds of owners to respond. The code is the easy bit.",
    contributed:
      "Slackbots and Chrome extensions for recurring security chores, an API inventory scanner that maps exposed production endpoints, a multi-agent VAPT system I contributed to, and the four builds under Work.",
  },
  {
    slug: "djsce",
    dates: "Nov 2022 – Jun 2026",
    place: "Dwarkadas J. Sanghvi College of Engineering",
    role: "B.Tech CSE (IoT, Cybersecurity, Blockchain)",
    workedOn:
      "Core CS with a security specialization, plus DJS ISACA (Vice President) and DJS Trinity (Co-Chairperson).",
    learned:
      "Designing a CTF challenge teaches the bug better than solving one. You have to know every way it breaks.",
    contributed:
      "Web exploitation and crypto challenges for Breachbytes 2.0 (80+ players), Burp and Wireshark sessions for 80+ students, and co-leading a 3-day fest with a 150+ person team.",
  },
  {
    slug: "optiverse",
    dates: "Since Mar 2021",
    place: "Optiverse",
    role: "Co-founder, student non-profit",
    status: "Relaunch in planning",
    workedOn:
      "A global, remote mentorship org for students aged 11 to 17: workshops, two internship programs and NGO partnerships.",
    learned:
      "We never had a budget, only time and attention, and that turned out to be what changed things for the students we spoke to.",
    contributed:
      "250+ members across 19 countries, 90+ workshops, 150,000+ students reached, and recognition from the Born This Way Foundation.",
  },
];

export type CaseStudy = {
  slug: string;
  tag: string;
  title: string;
  /** The headline number, shown once on the card's title row. */
  metric: {
    value: number;
    from?: number;
    suffix?: string;
    display?: string;
    label: string;
  };
  source: "employer" | "repo";
  problem: string;
  did: string;
  approach: string;
  outcome: string;
  stack: string[];
  link?: { href: string; label: string };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "uar",
    tag: "Access governance at JioStar",
    title: "Quarterly access reviews across the org",
    metric: { value: 6000, suffix: "+", label: "users, 650+ apps" },
    source: "employer",
    problem:
      "Access reviews had to run every quarter across every application, and each app had its own owner.",
    did: "Built the UAR workflow end to end: reminders, reviewer approvals, evidence collection and fulfillment tracking.",
    approach:
      "Designed it with the GRC team and app owners before writing code, so the process matched how reviews really get signed off.",
    outcome:
      "Designed and built for org-wide rollout, with evidence captured inside the flow instead of chased afterwards.",
    stack: ["Python", "Workflow automation", "IAM", "GRC"],
  },
  {
    slug: "regression",
    tag: "Test automation at JioStar",
    title: "Security regression tests on demand",
    metric: { value: 20, display: "2h → 20s", label: "per test case" },
    source: "employer",
    problem:
      "Writing a security regression test case by hand was slow, so retesting fixed issues happened rarely.",
    did: "Shipped a regression testing engine, integrated with Jira and GitHub, that automates security test-case creation.",
    approach:
      "Started from where findings already lived, Jira, and plugged into the repos the teams already used.",
    outcome:
      "Regression testing became a standing capability instead of a manual one-off.",
    stack: ["Python", "Jira API", "GitHub API"],
  },
  {
    slug: "telegram",
    tag: "Threat intel at JioStar",
    title: "Finding piracy leaks without scrolling Telegram",
    metric: { value: 282, label: "confirmed threats" },
    source: "employer",
    problem:
      "Piracy leaks get shared in Telegram channels, and finding them meant someone searching by hand.",
    did: "Built a persistent crawler fleet that passively monitors channels and flags piracy intelligence.",
    approach:
      "Passive collection only, paced to stay inside Telegram’s rate limits, with filtering tuned so the output was confirmed threats, not raw keyword matches.",
    outcome:
      "167,000+ messages scanned in 5 days across 3 runs, with nobody searching by hand.",
    stack: ["Python", "Telegram API", "Threat intelligence"],
  },
  {
    slug: "siem",
    tag: "Detection at JioStar",
    title: "Cutting SIEM noise before an analyst sees it",
    metric: { value: 100, suffix: "+", label: "alert definitions" },
    source: "employer",
    problem:
      "DLP and InfraSec alerts arrived mixed in with false positives, and analysts sorted them by hand.",
    did: "Designed a triage layer over the existing SIEM that classifies alerts automatically and filters out false positives.",
    approach:
      "Built on top of the existing SIEM and its alert definitions instead of replacing either.",
    outcome:
      "Less noise reaches the analyst queue before a real alert surfaces.",
    stack: ["Python", "SIEM", "DLP", "Alert tuning"],
  },
  {
    slug: "reachability",
    tag: "AppSec tooling, open source",
    title: "Which CVEs can actually reach you?",
    metric: { value: 6, display: "6 / 7", label: "self-found threats fixed" },
    source: "repo",
    problem:
      "Dependency scanners list every advisory. Most point at code the application never calls, and triage time goes to the wrong ones.",
    did: "Built a CLI and GitHub Action that ranks advisories by static reachability from HTTP routes and CLI entry points, with OSV and CISA KEV data.",
    approach:
      "AST import graph plus route detection, SARIF and JSON output for code scanning, then a STRIDE threat model of the tool itself.",
    outcome:
      "Three threats confirmed by actually running them, every fix pinned by a regression test, and the one accepted risk documented with reasons.",
    stack: ["Python", "AST", "OSV", "CISA KEV", "SARIF", "STRIDE"],
    link: {
      href: "https://github.com/devalkotak/Reachability-CVE-Triage",
      label: "Read the repo",
    },
  },
  {
    slug: "iac",
    tag: "Cloud security, open source",
    title: "Catching AWS misconfigs before deploy",
    metric: { value: 23, display: "23 / 23", label: "tests passing" },
    source: "repo",
    problem:
      "The misconfigurations in my AWS assessment were found by hand, after the infrastructure was already live.",
    did: "Wrote a Terraform scanner that checks CIS AWS Foundations v3.0.0 controls with a PASS, FAIL or UNKNOWN result.",
    approach:
      "Recreated the assessed environment in Terraform and tested against it, so every result had a known right answer.",
    outcome:
      "Reproduced 2 real findings from the manual assessment and confirmed 3 true negatives. CI green.",
    stack: ["Python", "Terraform", "HCL", "CIS AWS"],
    link: {
      href: "https://github.com/devalkotak/IaC-Misconfig-Scanner",
      label: "Read the repo",
    },
  },
  {
    slug: "grc",
    tag: "GRC, open source",
    title: "A risk register built on real infrastructure",
    metric: { value: 21, from: 18, display: "18 → 21", label: "risks to controls" },
    source: "repo",
    problem:
      "Most risk assessment samples describe imaginary systems, so nothing in them can be checked.",
    did: "Stood up EC2, S3, IAM and a VPC on AWS, inventoried it, and mapped every risk to CIS and ISO 27001 controls.",
    approach:
      "A documented 3×3 matrix for every rating, redacted CLI evidence and screenshots indexed by SHA-256 hash, and scope decisions labelled as scope, not risk acceptance.",
    outcome:
      "Every rating reproduces and every evidence citation resolves. The resources were torn down afterwards.",
    stack: ["AWS", "CIS AWS v3.0.0", "ISO 27001", "Risk register"],
    link: {
      href: "https://github.com/devalkotak/GRC-AWS-Lab",
      label: "Read the repo",
    },
  },
];

export type MethodStep = {
  title: string;
  body: string;
  concepts: string[];
};

export const METHOD_STEPS: MethodStep[] = [
  {
    title: "Map the surface",
    body: "Before testing anything, I list what is exposed: endpoints, dependencies, identities, infrastructure. You cannot defend what you have not counted.",
    concepts: ["Attack surface", "Threat modeling", "Cloud posture"],
  },
  {
    title: "Find the weak spot",
    body: "Manual testing for what scanners cannot judge, like broken authorization and business logic. Scanners for breadth: injection, misconfiguration and known CVEs.",
    concepts: ["Web & API testing", "Attack surface"],
  },
  {
    title: "Prove it is real",
    body: "I confirm a finding before I report it. If I cannot reproduce it, the report says so and marks the confidence instead of presenting a guess as fact.",
    concepts: ["Web & API testing"],
  },
  {
    title: "Rank what matters",
    body: "Severity alone does not set the order. Reachability, exposure and known exploitation (CISA KEV) reorder the queue, and an unreachable critical drops down the list, not off it.",
    concepts: ["Reachability"],
  },
  {
    title: "Fix it with the owner",
    body: "The team that owns the system ships the fix. My job is making that easy: clear steps, a test, and evidence.",
    concepts: ["Access governance", "Automation"],
  },
  {
    title: "Retest and automate",
    body: "If I had to check it by hand once, the next check runs itself in CI or on a schedule. What cannot be prevented should at least be detected.",
    concepts: ["Automation", "Reachability", "Cloud posture", "Detection"],
  },
];

export type Concept = {
  name: string;
  group: string;
  take: string;
  /** Links to where the work is described. No facts are restated here. */
  usedIn: { label: string; href: string }[];
  /** Must be symmetric: if A lists B, B lists A. */
  connects: string[];
};

// Array order sets group order and card order within each group.
export const CONCEPTS: Concept[] = [
  {
    name: "Threat modeling",
    group: "Design & risk",
    take: "Model the tool, not just the app it protects.",
    usedIn: [{ label: "Which CVEs can actually reach you?", href: "#case-reachability" }],
    connects: ["Attack surface", "Reachability"],
  },
  {
    name: "Attack surface",
    group: "Design & risk",
    take: "The endpoint nobody listed is the one that gets hit.",
    usedIn: [{ label: "API inventory scanner, JioStar", href: "#journey-jiostar" }],
    connects: ["Threat modeling", "Web & API testing"],
  },
  {
    name: "Web & API testing",
    group: "Testing & triage",
    take: "Authorization bugs hide in the boring endpoints.",
    usedIn: [
      { label: "VAPT on internal tools, JioStar", href: "#journey-jiostar" },
      { label: "Lab writeups", href: "/blog" },
    ],
    connects: ["Attack surface", "Detection"],
  },
  {
    name: "Reachability",
    group: "Testing & triage",
    take: "A CVE in the lockfile is a clue, not a finding.",
    usedIn: [{ label: "Which CVEs can actually reach you?", href: "#case-reachability" }],
    connects: ["Threat modeling", "Automation"],
  },
  {
    name: "Access governance",
    group: "Defense",
    take: "Least privilege drifts. Access reviews pull it back.",
    usedIn: [{ label: "Quarterly access reviews", href: "#case-uar" }],
    connects: ["Cloud posture", "Automation"],
  },
  {
    name: "Cloud posture",
    group: "Defense",
    take: "Catch it in the Terraform, not the incident.",
    usedIn: [
      { label: "AWS misconfigs before deploy", href: "#case-iac" },
      { label: "Risk register on real infra", href: "#case-grc" },
    ],
    connects: ["Access governance", "Automation"],
  },
  {
    name: "Detection",
    group: "Defense",
    take: "If no one acts on an alert, it is noise with a timestamp.",
    usedIn: [{ label: "Cutting SIEM noise", href: "#case-siem" }],
    connects: ["Web & API testing", "Automation"],
  },
  {
    name: "Automation",
    group: "Build",
    take: "Fix the process first, then make it run itself.",
    usedIn: [
      { label: "Regression tests on demand", href: "#case-regression" },
      { label: "Quarterly access reviews", href: "#case-uar" },
    ],
    connects: ["Reachability", "Access governance", "Cloud posture", "Detection"],
  },
];

export type Hobby = {
  slug: string;
  kicker: string;
  title: string;
  body: string;
  /** Sets the card size. Listed largest first so the grid tapers. */
  size: "lead" | "mid" | "small";
  /** Not shown on the card; extra words the command palette matches. */
  keywords?: string[];
  link?: { href: string; label: string };
};

export const HOBBIES: Hobby[] = [
  {
    slug: "music",
    kicker: "Music",
    title: "Strings, vocals and rhythm",
    body: "I play guitar, sing, and keep time on whatever percussion is in reach. The part I enjoy most happens before anyone plays a note: shaping the setlist, so a room’s energy builds, breathes and lands exactly where it should.",
    size: "lead",
    keywords: ["guitar", "vocals", "percussion", "setlists"],
  },
  {
    slug: "sports",
    kicker: "Sports",
    title: "Anything with a team and a scoreline",
    body: "Football, badminton, volleyball and cricket for the noise and the strategy. When the ground is closed, Valorant: the same teamwork, worse posture.",
    size: "mid",
    keywords: ["football", "badminton", "volleyball", "cricket", "valorant"],
  },
  {
    slug: "community",
    kicker: "Giving back",
    title: "Community outreach",
    body: "I organize donation drives and do the slow part properly: finding the people who need the donations most, then showing up in person. Through Optiverse, that often means an afternoon running self-awareness sessions with students, not just a handover.",
    size: "mid",
  },
  {
    slug: "systems",
    kicker: "Systems",
    title: "A second brain in Notion",
    body: "Everything I work on, read or plan flows into a Notion system I built, so nothing that passes through gets lost.",
    size: "small",
  },
  {
    slug: "markets",
    kicker: "Markets",
    title: "Reading the tape",
    body: "Charts, strategies and a paper-trading bot that runs end to end without ever placing a real order.",
    size: "small",
    link: {
      href: "https://github.com/devalkotak/SMACrossoverStrategy-DhanAPI",
      label: "The bot",
    },
  },
  {
    slug: "agentic",
    kicker: "Building",
    title: "Small tools for people I know",
    body: "When someone close to me has a nagging problem, I build a quick full-stack or agent-driven fix for it.",
    size: "small",
    link: { href: "https://github.com/devalkotak/Reel-Resource-Logger", label: "One example" },
  },
  {
    slug: "travel",
    kicker: "Travel",
    title: "Always one trip ahead",
    body: "New places, new food, new perspective. I am usually planning the next trip before I have unpacked from the last.",
    size: "small",
    keywords: ["trips", "places"],
  },
];
