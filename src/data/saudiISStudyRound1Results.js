export const round1Meta = {
  title: "Saudi Arabia key issues 2026",
  subtitle: "Round 1",
  published: "June 23, 2026",
  intro:
    "For the 18 key issues, there were 32 respondents. Based on an analysis of Q method statistics, five factors, or Schools of Thought, were extracted. These factors explain 65.63 percent of the variance among the respondents.",
  issueScoreImage: "/assets/studyResults/Saudi/Saudi_1_issueScore.png",
};

export const round1PlainLanguage = {
  title: "What does this mean?",
  summary:
    "In Round 1, 32 experts ranked 18 information systems issues facing Saudi organizations. Rather than looking for one “correct” ranking, this analysis maps how different groups of experts think about priorities — and where they agree or disagree.",
  sections: [
    {
      heading: "The big picture",
      body:
        "Think of this page as a snapshot of where the expert panel stands after the first round. You are not being scored individually. The goal is to show the patterns across the whole panel so that everyone can see the landscape before Round 2.",
    },
    {
      heading: "Schools of Thought (the five factors)",
      body:
        "Not everyone prioritises issues the same way. Statistical analysis grouped similar ranking patterns into five “Schools of Thought” — five distinct ways of looking at what matters most. For example, some experts emphasise national sovereignty and Vision 2030 alignment; others focus on ROI and business value; others on compliance and risk. Seeing these groups helps explain why two thoughtful experts can rank the same issue very differently.",
    },
    {
      heading: "What the numbers mean",
      body:
        "In the ranking exercise, issues were placed on a scale from −2 (least important) to +2 (most important). Positive scores mean a group tends to rank that issue as more important; negative scores mean they tend to rank it as less important. A blank cell simply means that issue did not strongly define that particular School of Thought.",
    },
    {
      heading: "What each section on this page shows",
      items: [
        {
          label: "Loadings",
          text: "How many experts align most closely with each School of Thought. Factor 1 has the largest group (7 experts); Factor 5 has the smallest (4).",
        },
        {
          label: "Distinguishing statements",
          text: "Which issues best separate one School of Thought from another — the issues that make each group distinctive.",
        },
        {
          label: "Interpretation of the factors",
          text: "A plain-language label for each School of Thought, describing the mindset behind that group’s rankings.",
        },
        {
          label: "Factor by respondent",
          text: "An anonymous view of which School of Thought each participant most closely matches. No names or identifying information are shown — only anonymous participant labels.",
        },
        {
          label: "Scores for each key issue",
          text: "A chart showing how the full panel ranked every issue on average, including the spread of opinion. Issues higher on the scale were generally seen as more important; issues lower down were seen as less pressing.",
        },
      ],
    },
    {
      heading: "What this means for you in Round 2",
      body:
        "When you take part in the next round, you will see how the panel as a whole ranked the issues — anonymously — and you will have the chance to revise your own ranking in light of these shared patterns. The aim is not to push everyone toward one answer, but to make the diversity of expert views visible and to sharpen the collective picture over time.",
    },
  ],
};

export const factorLoadings = [
  { factor: 1, loadings: 7 },
  { factor: 2, loadings: 6 },
  { factor: 3, loadings: 6 },
  { factor: 4, loadings: 5 },
  { factor: 5, loadings: 4 },
];

export const factorLoadingsTotal = 28;

export const statementFactorScores = [
  { statement: "Data Protection", f1: 1.78, f2: null, f3: 1.5, f4: 1.59, f5: 2.37 },
  { statement: "AI Capability", f1: null, f2: null, f3: 1.39, f4: null, f5: null },
  { statement: "Legacy Tech Debt", f1: -1.92, f2: -1.42, f3: null, f4: -1.33, f5: null },
  { statement: "Cloud Platform Dependencies", f1: null, f2: -1.06, f3: -1.14, f4: -0.92, f5: null },
  { statement: "AI at Scale", f1: null, f2: null, f3: null, f4: null, f5: -0.85 },
  { statement: "IS Resilience Agility", f1: null, f2: null, f3: -1.34, f4: null, f5: null },
  { statement: "AI Workforce Trust", f1: -0.95, f2: -1.87, f3: null, f4: null, f5: null },
  { statement: "IS Talent", f1: null, f2: null, f3: 0.99, f4: null, f5: null },
  { statement: "Data Quality", f1: 0.94, f2: 0.98, f3: null, f4: 1.05, f5: -0.85 },
  { statement: "Vision 2030 Alignment", f1: 1.56, f2: null, f3: 1.14, f4: -1.41, f5: null },
  { statement: "Responsible AI", f1: null, f2: null, f3: null, f4: -1.13, f5: null },
  { statement: "AI Sovereignty", f1: 0.97, f2: -1.05, f3: -1.38, f4: -1.15, f5: null },
  { statement: "Change Management", f1: null, f2: null, f3: null, f4: 1.51, f5: null },
  { statement: "Cloud third Party Risk", f1: null, f2: -0.87, f3: -0.87, f4: null, f5: 1.19 },
  { statement: "Data Governance", f1: null, f2: null, f3: 0.87, f4: 1.07, f5: -0.85 },
  { statement: "Interoperability", f1: null, f2: null, f3: null, f4: -1.18, f5: null },
  { statement: "IS Value ROI", f1: -1.73, f2: 2.15, f3: -1.67, f4: null, f5: -1.09 },
  { statement: "Cyber Regulation", f1: null, f2: 0.94, f3: null, f4: null, f5: 2.21 },
];

export const factorInterpretations = [
  {
    factor: 1,
    interpretation: "National sovereignty alignment",
    explanation: "Saudi strategic adherents & vision-sovereignty aligners",
  },
  {
    factor: 2,
    interpretation: "Performance-driven",
    explanation: "ROI-first pragmatists & value-centric orientation",
  },
  {
    factor: 3,
    interpretation: "National capability builders",
    explanation: "Capability-centric aligners & selective national aligners",
  },
  {
    factor: 4,
    interpretation: "Data-centric transformation",
    explanation: "Enterprise data foundations, data governance, & change",
  },
  {
    factor: 5,
    interpretation: "Compliance & risk",
    explanation: "Regulatory defenders & reactive compliance",
  },
];

export const respondentFactors = [
  { label: "Participant 01", respondentId: 27, factor: 1 },
  { label: "Participant 02", respondentId: 30, factor: 1 },
  { label: "Participant 03", respondentId: 33, factor: 3 },
  { label: "Participant 04", respondentId: 34, factor: 4 },
  { label: "Participant 05", respondentId: 35, factor: 1 },
  { label: "Participant 06", respondentId: 36, factor: 1 },
  { label: "Participant 07", respondentId: 37, factor: 2 },
  { label: "Participant 08", respondentId: 39, factor: 1 },
  { label: "Participant 09", respondentId: 40, factor: 2 },
  { label: "Participant 10", respondentId: 43, factor: 3 },
  { label: "Participant 11", respondentId: 44, factor: null },
  { label: "Participant 12", respondentId: 45, factor: 5 },
  { label: "Participant 13", respondentId: 46, factor: 5 },
  { label: "Participant 14", respondentId: 47, factor: 2 },
  { label: "Participant 15", respondentId: 49, factor: 1 },
  { label: "Participant 16", respondentId: 50, factor: 1 },
  { label: "Participant 17", respondentId: 51, factor: 5 },
  { label: "Participant 18", respondentId: 52, factor: 4 },
  { label: "Participant 19", respondentId: 54, factor: 4 },
  { label: "Participant 20", respondentId: 56, factor: 2 },
  { label: "Participant 21", respondentId: 58, factor: null },
  { label: "Participant 22", respondentId: 59, factor: 2 },
  { label: "Participant 23", respondentId: 60, factor: null },
  { label: "Participant 24", respondentId: 61, factor: 3 },
  { label: "Participant 25", respondentId: 62, factor: 3 },
  { label: "Participant 26", respondentId: 63, factor: 3 },
  { label: "Participant 27", respondentId: 64, factor: 5 },
  { label: "Participant 28", respondentId: 68, factor: 3 },
  { label: "Participant 29", respondentId: 72, factor: null },
  { label: "Participant 30", respondentId: 96, factor: 4 },
  { label: "Participant 31", respondentId: 98, factor: 4 },
  { label: "Participant 32", respondentId: 99, factor: 2 },
];

export function getParticipantByRespondentId(respondentId, username) {
  // Bulk-created accounts use a username suffix that maps to the analysis export id,
  // e.g. SaudiCIS_respondent_1780398542716_99 -> analysis respondent id 99.
  // Do not match by database respondentID alone — ids can collide across systems.
  if (username) {
    const suffixMatch = username.match(/_(\d+)$/);
    if (suffixMatch) {
      const analysisRespondentId = suffixMatch[1];
      const bySuffix = respondentFactors.find(
        (entry) => String(entry.respondentId) === analysisRespondentId
      );
      if (bySuffix) {
        return { ...bySuffix, currentRespondentId: respondentId };
      }
    }
  }

  return null;
}

export function getFactorInterpretation(factor) {
  if (!factor) return null;
  return factorInterpretations.find((entry) => entry.factor === factor) ?? null;
}
