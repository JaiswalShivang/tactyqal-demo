export type ToolQuestion = {
  question: string;
  options: string[];
  scores: number[];
};

export type ToolData = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  questions: ToolQuestion[];
  resultLabel: string;
  resultVerdict: (score: number) => string;
};

export const TOOLS_DATA: ToolData[] = [
  {
    id: "startup-idea-generator",
    name: "Startup Idea Generator",
    tagline: "Find your unfair advantage",
    description:
      "Identify startup opportunities tailored to your skills, interests, and market gaps.",
    icon: "lightbulb",
    questions: [
      {
        question: "How clearly can you describe the problem your idea solves?",
        options: [
          "I have a vague sense of a problem",
          "I can describe it but haven't validated it",
          "I've spoken to potential users and confirmed the pain",
          "I have data and user interviews proving the problem exists",
        ],
        scores: [0, 15, 35, 50],
      },
      {
        question: "What is your domain expertise in this space?",
        options: [
          "None—I'm entering a completely new field",
          "Some general interest but no experience",
          "1–3 years of relevant experience",
          "Deep domain expertise or personal experience with the problem",
        ],
        scores: [0, 10, 25, 50],
      },
      {
        question: "How do you plan to reach your first 100 customers?",
        options: [
          "I haven't thought about this yet",
          "I'll rely on social media and word of mouth",
          "I have a specific channel in mind and have tested it",
          "I already have a list of warm leads or early adopters",
        ],
        scores: [0, 10, 25, 40],
      },
    ],
    resultLabel: "Idea Strength",
    resultVerdict: (score) => {
      if (score >= 120)
        return "Strong idea with real validation. Build a landing page and start pre-selling this week.";
      if (score >= 80)
        return "Promising direction. Run 10 customer interviews before writing any code.";
      if (score >= 40)
        return "Early stage idea. Sharpen the problem statement and find your unfair advantage.";
      return "Back to the drawing board. Spend a week talking to people before committing to any idea.";
    },
  },
  {
    id: "fundability-assessment",
    name: "Fundability Assessment",
    tagline: "Are investors going to bite?",
    description:
      "Assess how fundable your startup is across team, traction, market, and product dimensions.",
    icon: "chart",
    questions: [
      {
        question: "What traction does your startup currently have?",
        options: [
          "Pre-idea—nothing built yet",
          "Built a prototype but no users",
          "Have active users or paying customers",
          "Growing revenue with month-on-month metrics",
        ],
        scores: [0, 15, 35, 50],
      },
      {
        question: "How large is your target market?",
        options: [
          "Less than 10,000 potential customers",
          "100,000 potential customers",
          "Millions of potential customers in India",
          "Global market in the billions",
        ],
        scores: [0, 15, 30, 50],
      },
      {
        question: "Does your founding team have relevant experience?",
        options: [
          "First-time founders with no domain experience",
          "Some relevant experience but no previous startup",
          "Previous startup experience or deep domain expertise",
          "Serial founders or industry veterans with networks",
        ],
        scores: [0, 15, 30, 40],
      },
    ],
    resultLabel: "Fundability Score",
    resultVerdict: (score) => {
      if (score >= 120)
        return "Investor-ready. Put together your deck and start warm intros immediately.";
      if (score >= 80)
        return "Getting there. Focus on acquiring your next 10 paying customers to strengthen traction.";
      if (score >= 40)
        return "Pre-seed territory. Bootstrap to first revenue before approaching investors.";
      return "Too early for external funding. Validate the idea with real users first.";
    },
  },
  {
    id: "team-evaluation",
    name: "Team Evaluation Tool",
    tagline: "Is your team built to win?",
    description:
      "Evaluate your founding team's complementarity, commitment, and capability to execute.",
    icon: "users",
    questions: [
      {
        question: "Does your team cover the three core functions: Builder, Seller, Operator?",
        options: [
          "Only one person covering everything",
          "Two of three covered by the team",
          "All three covered but with gaps",
          "All three strongly covered with deep experience",
        ],
        scores: [0, 15, 30, 50],
      },
      {
        question: "How long have you worked with your co-founder(s)?",
        options: [
          "We just met recently",
          "Less than 6 months",
          "6 months to 2 years",
          "More than 2 years with a track record of shipping together",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "What is the team's commitment level?",
        options: [
          "Part-time, still in day jobs",
          "Part-time but planning to go full-time",
          "One founder full-time",
          "All founders full-time",
        ],
        scores: [0, 10, 20, 40],
      },
    ],
    resultLabel: "Team Strength",
    resultVerdict: (score) => {
      if (score >= 110)
        return "Strong founding team. Your biggest risk is now execution, not team composition.";
      if (score >= 70)
        return "Solid foundation. Identify the gaps in your team and plan how to fill them.";
      if (score >= 40)
        return "Team needs strengthening. Focus on finding a complementary co-founder before scaling.";
      return "Solo or early team. Consider finding a co-founder who complements your weaknesses.";
    },
  },
  {
    id: "pitch-deck-analyzer",
    name: "Pitch Deck Analyzer",
    tagline: "Will your deck open doors?",
    description:
      "Analyze the structure, clarity, and persuasiveness of your investor pitch deck.",
    icon: "presentation",
    questions: [
      {
        question: "How clearly does your deck communicate the problem and why it matters?",
        options: [
          "We describe what we do but not the problem",
          "We mention the problem in passing",
          "We have a dedicated problem slide with data",
          "We open with a compelling problem story backed by research",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "How do you present your business model?",
        options: [
          "We haven't included one yet",
          "We mention revenue but no detail",
          "We have a clear revenue model with pricing",
          "We show actual revenue data and unit economics",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "How do you handle the 'why us' question in the deck?",
        options: [
          "We don't address it",
          "We list our team's backgrounds",
          "We highlight domain expertise and relevant experience",
          "We show unique advantages that competitors cannot replicate",
        ],
        scores: [0, 10, 25, 50],
      },
    ],
    resultLabel: "Deck Score",
    resultVerdict: (score) => {
      if (score >= 110)
        return "Strong deck. It tells a clear story and builds conviction. Start sending.";
      if (score >= 70)
        return "Good structure, needs sharpening. Focus on the business model and traction slides.";
      if (score >= 40)
        return "Missing key elements. Revisit the problem, solution, and ask before presenting.";
      return "Needs a full rebuild. Start with a 5-slide version: Problem, Solution, Traction, Team, Ask.";
    },
  },
  {
    id: "top-10-traits",
    name: "Top 10 Traits For Business Success",
    tagline: "Do you have the founder mindset?",
    description:
      "Assess your alignment with the 10 core traits of successful entrepreneurs.",
    icon: "star",
    questions: [
      {
        question: "How do you handle repeated failure and rejection?",
        options: [
          "I find it very demotivating and usually stop",
          "It affects me but I recover eventually",
          "I use it as feedback and adjust quickly",
          "Rejection energises me—it means I'm making moves",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "How quickly do you act on a new idea or opportunity?",
        options: [
          "I think about it for months before doing anything",
          "I research extensively before taking action",
          "I do a quick validation test within a week",
          "I build a minimum version within days and learn from real usage",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "How often do you seek out customer feedback proactively?",
        options: [
          "Rarely—I trust my own instincts",
          "When things go wrong",
          "Monthly at least",
          "Weekly or more—customer conversations are core to my routine",
        ],
        scores: [0, 10, 25, 50],
      },
    ],
    resultLabel: "Founder Trait Score",
    resultVerdict: (score) => {
      if (score >= 110)
        return "Strong founder profile. Your mindset is built for the grind. Keep shipping.";
      if (score >= 70)
        return "Good instincts with room to grow. Focus on speed of execution and customer proximity.";
      if (score >= 40)
        return "Developing founder mindset. Work on your bias toward action and comfort with uncertainty.";
      return "Early stage of the founder journey. The traits can be developed—start by shipping something small.";
    },
  },
  {
    id: "cofounder-compatibility",
    name: "Cofounder Compatibility Test",
    tagline: "Will you last the distance?",
    description:
      "Test alignment across values, work style, roles, and long-term vision with your co-founder.",
    icon: "handshake",
    questions: [
      {
        question: "Have you explicitly discussed equity splits and roles?",
        options: [
          "Not yet—we're avoiding the conversation",
          "We've talked vaguely but nothing is decided",
          "We've agreed on a split but haven't documented it",
          "We have a signed founders' agreement covering equity, roles, and vesting",
        ],
        scores: [0, 10, 25, 50],
      },
      {
        question: "How aligned are you on the long-term vision for the company?",
        options: [
          "We haven't really discussed it",
          "We have different ideas about where this should go",
          "Broadly aligned but with some differences",
          "Strongly aligned on mission, scale, and exit strategy",
        ],
        scores: [0, 5, 20, 40],
      },
      {
        question: "How do you handle disagreements with your co-founder?",
        options: [
          "We avoid conflict and don't resolve them well",
          "It gets heated but we figure it out eventually",
          "We have a process—we argue the data, not the emotions",
          "We have clear decision rights so most conflicts resolve quickly",
        ],
        scores: [0, 10, 25, 40],
      },
    ],
    resultLabel: "Compatibility Score",
    resultVerdict: (score) => {
      if (score >= 110)
        return "Strong co-founder alignment. You have the foundations of a durable partnership.";
      if (score >= 70)
        return "Good partnership with some gaps. Have the hard conversations about equity and vision this week.";
      if (score >= 40)
        return "Potential misalignment. Address equity and decision-making before scaling together.";
      return "High risk of co-founder conflict. Have structured conversations about roles, equity, and vision before going further.";
    },
  },
  {
    id: "problem-solution-fit",
    name: "Problem-Solution Fit",
    tagline: "Does your solution actually fit?",
    description:
      "Validate whether your solution genuinely addresses the problem your customers face.",
    icon: "puzzle",
    questions: [
      {
        question: "How many potential customers have you interviewed about this problem?",
        options: [
          "None yet",
          "1–5 conversations",
          "5–20 structured interviews",
          "More than 20, with consistent patterns emerging",
        ],
        scores: [0, 10, 25, 50],
      },
      {
        question: "When you describe your solution, how do customers react?",
        options: [
          "Polite interest but no strong reaction",
          "They say it sounds useful",
          "They ask how to sign up",
          "They pull out their wallet or ask for a beta invite on the spot",
        ],
        scores: [0, 10, 25, 50],
      },
      {
        question: "What workarounds do customers currently use to solve this problem?",
        options: [
          "I don't know",
          "They just live with the problem",
          "They use imperfect alternatives",
          "They use expensive, time-consuming workarounds they hate",
        ],
        scores: [0, 5, 20, 40],
      },
    ],
    resultLabel: "PSF Score",
    resultVerdict: (score) => {
      if (score >= 120)
        return "Strong problem-solution fit. Build the MVP and get it in front of beta users immediately.";
      if (score >= 80)
        return "Good signal. Conduct 10 more customer interviews to sharpen your understanding before building.";
      if (score >= 40)
        return "Weak signal. The problem may not be urgent enough. Keep interviewing before committing resources.";
      return "No clear fit yet. Go back to customer discovery—the solution may need a complete rethink.";
    },
  },
  {
    id: "landing-page-assessment",
    name: "Website Landing Page Assessment",
    tagline: "Does your page convert?",
    description:
      "Evaluate your landing page's clarity, trust signals, and conversion effectiveness.",
    icon: "monitor",
    questions: [
      {
        question: "How clear is your headline—does a stranger understand what you do in 5 seconds?",
        options: [
          "Our headline is creative but vague",
          "It describes what we do but not the benefit",
          "It clearly states the outcome for the customer",
          "It addresses a specific pain point and promises a clear result",
        ],
        scores: [0, 10, 25, 40],
      },
      {
        question: "What social proof do you have on the page?",
        options: [
          "None yet",
          "A generic testimonial or two",
          "Named testimonials with specific results",
          "Case studies, revenue numbers, and verifiable logos",
        ],
        scores: [0, 10, 25, 50],
      },
      {
        question: "How many steps does it take for a visitor to take your primary action?",
        options: [
          "More than 5 steps",
          "3–5 steps",
          "2 steps",
          "One click to get started",
        ],
        scores: [0, 10, 25, 40],
      },
    ],
    resultLabel: "Conversion Score",
    resultVerdict: (score) => {
      if (score >= 110)
        return "High-converting page. Run A/B tests on the headline and CTA to squeeze out more gains.";
      if (score >= 70)
        return "Solid foundation. Add more specific social proof and reduce friction on the CTA.";
      if (score >= 40)
        return "Needs work. Rewrite the headline to focus on customer outcomes, not your features.";
      return "Full rebuild recommended. Start with clarity: one audience, one problem, one action.";
    },
  },
];

