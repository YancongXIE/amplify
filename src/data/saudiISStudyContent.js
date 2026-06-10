export const institutions = [
  {
    term: "Vision 2030",
    description:
      "Saudi Arabia's national transformation programme launched in 2016 under Crown Prince Mohammed bin Salman. Aims to diversify the economy beyond oil and modernize public services. Most Saudi tech policy is framed as supporting Vision 2030.",
  },
  {
    term: "NTP",
    description:
      "National Transformation Program. One of Vision 2030's executive programmes; covers government digital transformation targets.",
  },
  {
    term: "PIF",
    description:
      "Public Investment Fund. Saudi sovereign wealth fund, ~$940bn AUM, projected $2tn by 2030. Owns or anchors most large Saudi tech and giga-project investments, including HUMAIN.",
  },
  {
    term: "SDAIA",
    description:
      "Saudi Data and Artificial Intelligence Authority. Established 2019. National authority for data and AI; enforces PDPL; sets AI ethics and adoption frameworks. Chaired by the Crown Prince.",
  },
  {
    term: "NDMO",
    description:
      "National Data Management Office. Sub-entity of SDAIA. Issues the national Data Management and Personal Data Protection Standards (15 domains, 77 controls, 191 specifications).",
  },
  {
    term: "NCA",
    description:
      "National Cybersecurity Authority. Established 2017. Issues mandatory cybersecurity controls for public and private sectors.",
  },
  {
    term: "SAMA",
    description:
      "Saudi Central Bank (renamed from Saudi Arabian Monetary Authority in 2020; acronym persists). Regulates banks, insurance, payment providers, finance companies, credit bureaus. Issues the SAMA Cybersecurity Framework.",
  },
  {
    term: "CST",
    description:
      "Communications, Space and Technology Commission (formerly CITC). Telecom and ICT regulator. Issues the Cloud Computing Regulatory Framework and licenses cloud providers.",
  },
  {
    term: "DGA",
    description:
      "Digital Government Authority. Established 2021. Regulates government digital transformation; runs the Qiyas programme and DEMI.",
  },
  {
    term: "SFDA",
    description:
      "Saudi Food and Drug Authority. Regulates healthcare and medical-device cybersecurity.",
  },
  {
    term: "MEWA / SEC",
    description:
      "Ministry of Environment, Water and Agriculture, and Saudi Electricity Company. Sectoral overseers for utilities and energy with their own cybersecurity expectations on top of NCA.",
  },
  {
    term: "PDPL",
    description:
      "Personal Data Protection Law. Saudi Arabia's first comprehensive data protection law. Royal Decree M/19 (2021), amended M/148 (2023). Fully enforced by SDAIA since 14 September 2024. Extraterritorial scope; 72-hour breach notification.",
  },
  {
    term: "NSDAI",
    description:
      "National Strategy for Data and AI. Published by SDAIA in 2020. Targets for AI contribution to GDP, AI talent, and national adoption levels.",
  },
  {
    term: "NCA control sets used in items",
    description:
      "ECC (Essential Cybersecurity Controls, baseline for all entities), ECC-2:2024 (updated version mandating Saudization of cybersecurity roles), CCC (Cloud Cybersecurity Controls), CCC-2:2024 (updated version aligning with national data localization requirements), CSCC (Critical Systems Cybersecurity Controls), OTCC (Operational Technology Cybersecurity Controls, for ICS/SCADA), TCC (Telework Cybersecurity Controls), DCC (Data Cybersecurity Controls), NCNICC-1:2025 (Critical National Infrastructure Cybersecurity Controls, extended in 2026 to cover all private-sector firms).",
  },
  {
    term: "SAMA CSF",
    description:
      "SAMA Cybersecurity Framework. Mandatory framework for SAMA-regulated financial institutions.",
  },
  {
    term: "CCRF",
    description:
      "Cloud Computing Regulatory Framework. CST framework classifying cloud providers (Qualifying, A, B, C) and tenant data classification tiers.",
  },
  {
    term: "Qiyas",
    description:
      "DGA's Digital Transformation Measurement programme for government agencies (10 perspectives, 23 axes, 96 standards).",
  },
  {
    term: "DEMI",
    description:
      "Digital Experience Maturity Index. DGA index for citizen digital experience.",
  },
  {
    term: "Nafath, Tawakkalna, Absher",
    description:
      "National digital identity, government-services, and citizen-services platforms. Common integration anchors for organizational digital services.",
  },
  {
    term: "Once-Only principle",
    description:
      "DGA principle that citizens and businesses should provide data to government only once; backend integration handles the rest.",
  },
  {
    term: "Saudization",
    description:
      "National policy requiring private-sector firms to employ Saudi nationals at specified percentages. Cybersecurity and digital roles fully Saudized under NCA ECC-2:2024.",
  },
  {
    term: "Giga-projects",
    description:
      "Vision 2030 mega-developments: NEOM (futuristic city), The Red Sea Project (luxury tourism), Qiddiya (entertainment), Diriyah (heritage), ROSHN (residential). Each at >$10bn scale.",
  },
  {
    term: "HUMAIN",
    description:
      "PIF-owned AI company launched May 2025. Building Saudi sovereign AI stack: data centers (target 6.6GW over 10 years), cloud infrastructure, the ALLaM Arabic multimodal LLM, and applications. Aramco took a minority stake in late 2025.",
  },
  {
    term: "ALLaM",
    description:
      "Arabic multimodal large language model developed under SDAIA and now hosted by HUMAIN. Saudi sovereign foundation model designed for Arabic-language and culturally-grounded AI applications.",
  },
  {
    term: "Foundation Models / LLMs",
    description:
      "Large language models trained on broad data and adaptable to many downstream tasks. Includes commercial multilingual models (GPT, Claude, Gemini) and sovereign or regional models (ALLaM, others).",
  },
  {
    term: "GenAI",
    description:
      "Generative AI. AI systems that produce text, images, code, audio, or other outputs in response to prompts; includes LLMs, image generators, and multimodal systems.",
  },
  {
    term: "MLOps",
    description:
      "Machine Learning Operations. The discipline of deploying, monitoring, and maintaining AI/ML systems in production reliably and at scale.",
  },
  {
    term: "AI Sovereignty",
    description:
      "An organization's or nation's capacity to control its AI technology stack, including data, models, infrastructure, and operations. Distinct from sovereign AI (which refers to the technical infrastructure underneath).",
  },
  {
    term: "Sovereign AI",
    description:
      "The infrastructure and technical capabilities (data centers, GPUs, locally-developed models) that make AI sovereignty possible. In the Saudi context, anchored by HUMAIN and ALLaM.",
  },
];

export const studyItems = [
  {
    number: 1,
    shortLabel: "Data Protection",
    item: "Complying with the Personal Data Protection Law (PDPL) across the data lifecycle",
    description:
      "PDPL has been fully enforced by SDAIA since 14 September 2024, with extraterritorial scope, 72-hour breach notification, and tightened cross-border transfer restrictions under the Implementing Regulations and NCA CCC-2:2024. The challenge is sustaining compliance across the full data lifecycle (collection, processing, sharing, retention, deletion), particularly cross-border flows and vendor-mediated data movement.",
  },
  {
    number: 2,
    shortLabel: "Data Governance",
    item: "Aligning with NDMO and DGA national standards for enterprise data governance",
    description:
      "NDMO Data Management Standards establish 15 knowledge domains, 77 controls, and 191 specifications covering governance, classification, sharing, and protection of all enterprise data. Organizations must build operating models that satisfy these national standards alongside DGA Freedom of Information obligations while keeping pace with AI-driven data demands.",
  },
  {
    number: 3,
    shortLabel: "Cyber Regulation",
    item: "Navigating NCA controls and sectoral cybersecurity regulators across the Saudi landscape",
    description:
      "NCA controls (ECC-2:2024, CCC-2:2024, CSCC, OTCC, TCC, DCC, NCNICC-1:2025) set the baseline; sectoral overlays add SAMA for FS, CST for telecom and cloud, SFDA for healthcare. Managing alignment across multiple regulators with overlapping yet distinct expectations is itself the strategic issue, with NCNICC-1:2025 extending mandatory reach to private-sector critical infrastructure in 2026.",
  },
  {
    number: 4,
    shortLabel: "Cloud & third-Party Risk",
    item: "Managing cloud and third-party risk under NCA, CST, and sector-specific mandates",
    description:
      "CST's Cloud Computing Regulatory Framework classifies providers and tenant data tiers; NCA CCC-2:2024 imposes localization-aligned controls; supplier security requirements appear in ECC, CSCC, and OTCC. With AWS and Microsoft data centers launching in-Kingdom in 2026, cloud is the largest third-party-risk surface and requires formal vendor risk governance.",
  },
  {
    number: 5,
    shortLabel: "IS Resilience & Agility",
    item: "Building information systems resilience and agility to maintain continuity and adapt to disruptions, external events, and shifting operational demands",
    description:
      "Saudi organizations face ongoing disruptions to information systems continuity: pandemics and public health events (as demonstrated during COVID-19), geopolitical shifts affecting technology access, cloud provider outages, regional supply disruptions, sanctions exposure, and rapid policy or regulatory shifts. Building IS resilience and adaptive capacity, including service continuity, rapid reconfiguration of digital services, alternative sourcing, and recovery planning, is a strategic IS capability distinct from regulatory compliance and routine incident handling.",
  },
  {
    number: 6,
    shortLabel: "Cloud & Platform Dependencies",
    item: "Managing vendor lock-in and strategic dependencies on cloud, AI, and platform infrastructure",
    description:
      "AWS and Microsoft data centers launch in-Kingdom in 2026 alongside Google Cloud, Oracle, and HUMAIN sovereign infrastructure, creating strategic choices around vendor lock-in, exit complexity, FinOps, multi-cloud architecture, and partnership ecosystems. Many Saudi organizations face contractual and architectural dependencies on a small number of global providers with long-term flexibility implications.",
  },
  {
    number: 7,
    shortLabel: "Responsible AI",
    item: "Governing responsible and accountable use of AI",
    description:
      "SDAIA's AI Ethics Principles (2023), Generative AI Guidelines (Jan 2024), AI Adoption Framework (Sep 2024), and draft AI Risk Management Framework set national expectations for transparency, accountability, fairness, privacy, and human oversight. Organizations face the challenge of operationalizing these principles into internal governance, risk assessments, and oversight structures across procured and developed AI systems.",
  },
  {
    number: 8,
    shortLabel: "AI Capability",
    item: "Building enterprise AI capability to drive organizational performance",
    description:
      "SDAIA's AI Adoption Framework, NSDAI capability pillars, and the National Occupational Standard Framework for Data & AI define the national agenda. KPMG Saudi shows ~74% of Saudi organizations see some return from AI but only ~33% scale to production-level value, reflecting capability gaps in infrastructure, processes, and governance that limit AI's contribution to organizational performance distinct from individual workforce adoption.",
  },
  {
    number: 9,
    shortLabel: "AI at Scale",
    item: "Scaling AI from experimentation to production and value realization",
    description:
      "Moving AI from PoC to production requires solving the operational stack: data foundations, MLOps, build-vs-buy decisions, GenAI-specific risks (hallucinations, jailbreaks, prompt injection), and experimentation models. IDC warns up to 30% of organizations may reassess GenAI investments due to cost, developer shortages, and infrastructure gaps; value realization framing spans financial, operational, and mission outcomes.",
  },
  {
    number: 10,
    shortLabel: "AI Sovereignty",
    item: "Pursuing AI sovereignty across data, models, infrastructure, and operations",
    description:
      "Saudi organizations face strategic choices about how to participate in the country's AI sovereignty agenda: whether to adopt sovereign AI capabilities such as HUMAIN-hosted infrastructure and the ALLaM Arabic multimodal LLM or rely on global commercial AI providers, and how to balance data residency, operational control, model provenance, and Arabic-language requirements across AI deployments. Distinct from broader cloud and platform dependencies (item 10), this is about the AI-specific dimensions of sovereignty: which models, which data, which infrastructure, and which operational controls.",
  },
  {
    number: 11,
    shortLabel: "AI Workforce Trust",
    item: "Building workforce trust in AI systems and AI-driven decisions",
    description:
      "KPMG Saudi shows 87% of Saudi organizations are concerned employees view AI as a \"black box,\" and 81% expect AI to challenge existing operational structures with job-reduction and ethical concerns. Building trust in AI outputs, decisions, and recommendations is essential for productive use across the workforce, distinct from broader change management (item 17) and from building technical AI capability (item 7).",
  },
  {
    number: 12,
    shortLabel: "Data Quality",
    item: "Ensuring enterprise data quality, integrity, and trustworthiness for AI and analytics",
    description:
      "AI and analytics initiatives in Saudi organizations frequently fail not from technological constraints but from inadequate data foundations: accuracy, completeness, consistency, timeliness, lineage, and reliability across enterprise systems. As organizations increase AI investment, high-quality and trustworthy data becomes a critical determinant of AI value and decision-making integrity.",
  },
  {
    number: 13,
    shortLabel: "Vision 2030 Alignment",
    item: "Aligning organizational digital strategy with Vision 2030 and NSDAI priorities",
    description:
      "Vision 2030's digital economy goals, NSDAI targets, NTP digital initiatives, and PIF investment strategy create implicit and explicit pressure for organizations to align corporate digital strategy with national priorities. Public and semi-public organizations face direct measurement (DGA Qiyas, DEMI); private organizations face indirect pressure through procurement and ecosystem participation.",
  },
  {
    number: 14,
    shortLabel: "IS Value & ROI",
    item: "Delivering measurable organizational and public value from Information Systems investments",
    description:
      "Gartner finds only ~48% of digital initiatives globally meet outcome targets; KPMG Saudi shows only ~33% of Saudi organizations scale AI to production-level value. Rising board demand for ROI accountability, portfolio-level evaluation, and demonstration of organizational or mission value spans the full IS investment portfolio, not only AI.",
  },
  {
    number: 15,
    shortLabel: "Legacy & Tech Debt",
    item: "Modernizing legacy systems and managing technical debt",
    description:
      "KPMG Saudi shows 66% of organizations report flaws in foundational enterprise IT systems disrupt business-as-usual weekly, while 79% plan to invest in new technology rather than fix existing systems. Legacy modernization, technical debt management, and architectural simplification are foundational to AI and cloud bets; without them, new initiatives fail on weak foundations.",
  },
  {
    number: 16,
    shortLabel: "IS Talent",
    item: "Developing and retaining specialized information systems, AI, and data professionals",
    description:
      "NCA ECC-2:2024 requires all cybersecurity roles to be filled by Saudi nationals; PwC finds 40% of Saudi workers face significant skill change by 2030, with AI-exposed skills evolving 66% faster. KPMG shows 24% of Saudi CEOs cite workforce upskilling as a top priority. Giga-project demand intensifies competition for specialized digital talent, making retention and reskilling as critical as hiring.",
  },
  {
    number: 17,
    shortLabel: "Change Management",
    item: "Leading organizational change and workforce readiness for digital transformation",
    description:
      "Many digital transformation programs fail not from technology limitations but from resistance to change, process redesign challenges, inadequate executive sponsorship, and poor communication. Saudi organizations executing large-scale transformation under Vision 2030 face significant change-readiness demands distinct from the AI-specific workforce trust dimension covered in item 11.",
  },
  {
    number: 18,
    shortLabel: "Interoperability",
    item: "Enabling interoperability and integration with national platforms and ecosystem partners",
    description:
      "Saudi organizations must increasingly integrate with national digital platforms (Nafath, Tawakkalna, Absher), DGA's Once-Only principle, and government data lakes, alongside cross-organizational data sharing under Vision 2030 ecosystem initiatives. Operational interoperability poses daily challenges around API standards, real-time uptime, and audit trails across systems organizations do not fully control.",
  },
];
