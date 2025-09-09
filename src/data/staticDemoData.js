// Static data for homepage demo sections

export const staticStatements = [
  {
    statementID: 1,
    short: "Data Privacy",
    statementText: "Enterprise GLLM governance must prioritize strict data privacy controls and user consent mechanisms."
  },
  {
    statementID: 2,
    short: "Access Control",
    statementText: "Strict access controls and role-based permissions should govern who can use and modify GLLM systems."
  },
  {
    statementID: 3,
    short: "Audit Trails",
    statementText: "Comprehensive logging and audit trails are essential for tracking GLLM usage and decisions."
  },
  {
    statementID: 4,
    short: "Training Data",
    statementText: "Governance policies must address the quality, sourcing, and management of GLLM training data."
  },
  {
    statementID: 5,
    short: "Ethical AI",
    statementText: "Organizations should establish clear ethical guidelines for GLLM usage to prevent bias and discrimination."
  },
  {
    statementID: 6,
    short: "Regulatory Compliance",
    statementText: "Enterprise GLLM governance must ensure compliance with evolving AI regulations and industry standards."
  },
  {
    statementID: 7,
    short: "Transparency",
    statementText: "Organizations should maintain transparency in GLLM decision-making processes and model explainability."
  },
  {
    statementID: 8,
    short: "Human Oversight",
    statementText: "Human-in-the-loop controls are critical for maintaining accountability in GLLM operations."
  },
  {
    statementID: 9,
    short: "Risk Management",
    statementText: "Comprehensive risk assessment frameworks are essential for managing GLLM-related security and operational risks."
  },
  {
    statementID: 10,
    short: "Model Governance",
    statementText: "Robust model lifecycle management is necessary to ensure GLLM quality and performance standards."
  },
  {
    statementID: 11,
    short: "Emerging Tech Governance",
    statementText: "Governance frameworks should be adaptable to accommodate emerging AI technologies and use cases."
  },
  {
    statementID: 12,
    short: "Legacy System Integration",
    statementText: "GLLM governance must address integration challenges with existing legacy systems and processes."
  },
  {
    statementID: 13,
    short: "Future-Proofing",
    statementText: "Governance policies should be designed to remain relevant as AI technology continues to evolve."
  }
];

export const staticParticipants = [
  {
    id: 1,
    S1: -1, S2: 2, S3: 0, S4: 1, S5: -2, S6: 1, S7: 0, S8: -1, S9: 2, S10: 0
  },
  {
    id: 2,
    S1: 2, S2: -1, S3: 1, S4: 0, S5: 1, S6: -2, S7: 1, S8: 0, S9: -1, S10: 2
  },
  {
    id: 3,
    S1: 0, S2: 1, S3: -2, S4: 2, S5: 0, S6: 1, S7: -1, S8: 2, S9: 0, S10: -1
  },
  {
    id: 4,
    S1: 1, S2: 0, S3: 2, S4: -1, S5: 1, S6: 0, S7: 2, S8: -2, S9: 1, S10: 0
  },
  {
    id: 5,
    S1: -2, S2: 1, S3: 1, S4: 0, S5: 2, S6: -1, S7: 0, S8: 1, S9: -1, S10: 2
  },
  {
    id: 6,
    S1: 1, S2: -1, S3: 0, S4: 2, S5: -1, S6: 2, S7: 1, S8: 0, S9: -2, S10: 1
  },
  {
    id: 7,
    S1: 0, S2: 2, S3: -1, S4: 1, S5: 0, S6: 1, S7: -2, S8: 1, S9: 0, S10: -1
  },
  {
    id: 8,
    S1: 2, S2: 0, S3: 1, S4: -2, S5: 1, S6: 0, S7: 1, S8: -1, S9: 2, S10: 0
  }
];

export const staticUpsetData = [
  {
    name: "Factor 1: Data Protection & Privacy",
    sets: ["Data Privacy", "Access Control", "Audit Trails", "Training Data"]
  },
  {
    name: "Factor 2: Ethical AI & Compliance", 
    sets: ["Ethical AI", "Regulatory Compliance", "Transparency", "Human Oversight"]
  },
  {
    name: "Factor 3: Risk & Security Management",
    sets: ["Risk Management", "Access Control", "Audit Trails", "Model Governance"]
  },
  {
    name: "Factor 4: Governance & Oversight",
    sets: ["Model Governance", "Human Oversight", "Transparency", "Regulatory Compliance"]
  },
  {
    name: "Factor 5: Technical Implementation",
    sets: ["Training Data", "Model Governance", "Access Control", "Audit Trails"]
  },
  {
    name: "Factor 6: Regulatory & Legal",
    sets: ["Regulatory Compliance", "Ethical AI", "Transparency", "Data Privacy"]
  },
  {
    name: "Factor 7: Operational Excellence",
    sets: ["Risk Management", "Model Governance", "Audit Trails", "Human Oversight"]
  },
  {
    name: "Factor 8: Emerging Technologies",
    sets: [] // Empty set - represents factors that may not have clear governance statements yet
  },
  {
    name: "Factor 9: Legacy Systems",
    sets: [] // Empty set - represents factors that are being phased out
  },
  {
    name: "Factor 10: Future Considerations",
    sets: [] // Empty set - represents factors that are planned but not yet implemented
  }
];
