import { Link } from "react-router-dom";
import {
  round1Meta,
  round1PlainLanguage,
  factorLoadings,
  factorLoadingsTotal,
  statementFactorScores,
  factorInterpretations,
  respondentFactors,
} from "../../data/saudiISStudyRound1Results";

function formatScore(value) {
  if (value === null || value === undefined) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function ResultsTable({ columns, rows, striped = true }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
      <table className="table w-full text-sm">
        <thead>
          <tr className="bg-[#0076BA] text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-semibold ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id ?? index}
              className={striped && index % 2 === 1 ? "bg-[#EDF7FC]" : ""}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`text-secondary-content ${
                    col.align === "right" ? "text-right tabular-nums" : "text-left"
                  } ${col.bold ? "font-medium" : ""}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-xl font-semibold text-secondary-content mb-4">
      {children}
    </h2>
  );
}

export default function SaudiISStudyRound1ResultsPage() {
  const factorColumns = ["f1", "f2", "f3", "f4", "f5"];

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <nav className="flex flex-wrap items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-primary hover:underline">
            Homepage
          </Link>
          <span className="text-base-content/40">/</span>
          <Link to="/projects/saudi-is-study" className="text-primary hover:underline">
            Saudi IS Study
          </Link>
          <span className="text-base-content/40">/</span>
          <span className="text-secondary-content">Round 1 Results</span>
        </nav>

        <header className="mb-10">
          <p className="text-primary font-semibold mb-2">Data collection results</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-content leading-tight mb-2">
            {round1Meta.title}
          </h1>
          <p className="text-lg text-secondary-content/80 mb-4">{round1Meta.subtitle}</p>
          <div className="flex flex-wrap gap-6 text-sm text-secondary-content/70">
            <span>
              <span className="font-medium text-secondary-content">Published:</span>{" "}
              {round1Meta.published}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-primary">32</p>
            <p className="text-sm text-secondary-content mt-1">Respondents</p>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-secondary-content mt-1">Schools of Thought</p>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-primary">65.63%</p>
            <p className="text-sm text-secondary-content mt-1">Variance explained</p>
          </div>
        </div>

        <section className="mb-12">
          <p className="text-secondary-content leading-relaxed">{round1Meta.intro}</p>
        </section>

        <section className="mb-12 rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-secondary-content mb-3">
            {round1PlainLanguage.title}
          </h2>
          <p className="text-secondary-content leading-relaxed mb-8">
            {round1PlainLanguage.summary}
          </p>
          <div className="space-y-8">
            {round1PlainLanguage.sections.map((block) => (
              <div key={block.heading}>
                <h3 className="text-lg font-semibold text-secondary-content mb-2">
                  {block.heading}
                </h3>
                {block.body && (
                  <p className="text-secondary-content/90 leading-relaxed">{block.body}</p>
                )}
                {block.items && (
                  <ul className="space-y-3 mt-1">
                    {block.items.map(({ label, text }) => (
                      <li key={label} className="flex gap-3 text-secondary-content/90 leading-relaxed">
                        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>
                          <span className="font-medium text-secondary-content">{label}:</span>{" "}
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <SectionHeading>Loadings for each factor (School of Thought)</SectionHeading>
          <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-[#0076BA] text-white">
                  <th className="text-right font-semibold">Factor</th>
                  <th className="text-right font-semibold">Loadings</th>
                </tr>
              </thead>
              <tbody>
                {factorLoadings.map(({ factor, loadings }, index) => (
                  <tr key={factor} className={index % 2 === 1 ? "bg-[#EDF7FC]" : ""}>
                    <td className="text-right tabular-nums text-secondary-content">{factor}</td>
                    <td className="text-right tabular-nums text-secondary-content">{loadings}</td>
                  </tr>
                ))}
                <tr className="bg-base-300 font-medium">
                  <td className="text-right text-secondary-content">Total</td>
                  <td className="text-right tabular-nums text-secondary-content">
                    {factorLoadingsTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeading>Distinguishing statements by factor</SectionHeading>
          <p className="text-sm text-secondary-content/80 mb-4">
            Factor scores for statements that significantly distinguish each School of Thought.
          </p>
          <ResultsTable
            columns={[
              { key: "statement", label: "Statement", align: "left", bold: true },
              ...factorColumns.map((key) => ({
                key,
                label: key.toUpperCase().replace("f", "F"),
                align: "right",
                render: (row) => formatScore(row[key]),
              })),
            ]}
            rows={statementFactorScores}
          />
        </section>

        <section className="mb-12">
          <SectionHeading>Interpretation of the factors</SectionHeading>
          <ResultsTable
            columns={[
              { key: "factor", label: "Factor", align: "right" },
              { key: "interpretation", label: "Interpretation", align: "left", bold: true },
              { key: "explanation", label: "Explanation", align: "left" },
            ]}
            rows={factorInterpretations}
          />
        </section>

        <section className="mb-12">
          <SectionHeading>Factor (School of Thought) by respondent</SectionHeading>
          <p className="text-sm text-secondary-content/80 mb-4">
            An asterisk (*) indicates the factor loading for each participant. Labels are
            anonymous and cannot be linked to individuals.
          </p>
          <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-[#0076BA] text-white">
                  <th className="text-left font-semibold">Participant</th>
                  <th colSpan={5} className="text-center font-semibold">
                    Factors
                  </th>
                </tr>
                <tr className="bg-[#0076BA] text-white">
                  <th />
                  {factorColumns.map((key) => (
                    <th key={key} className="text-right font-semibold">
                      {key.toUpperCase().replace("f", "F")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {respondentFactors.map(({ label, factor }, index) => (
                  <tr
                    key={label}
                    className={index % 2 === 1 ? "bg-[#EDF7FC]" : ""}
                  >
                    <td className="text-left text-secondary-content whitespace-nowrap">
                      {label}
                    </td>
                    {[1, 2, 3, 4, 5].map((f) => (
                      <td
                        key={f}
                        className="text-right tabular-nums text-secondary-content font-medium"
                      >
                        {factor === f ? "*" : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <SectionHeading>Scores for each key issue</SectionHeading>
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 lg:p-6 shadow-sm">
            <img
              src={round1Meta.issueScoreImage}
              alt="Box plot showing scores for each key issue across the ranking scale from -2 to 2"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </section>

        <div className="pt-6 border-t border-base-300">
          <Link
            to="/projects/saudi-is-study"
            className="inline-flex items-center text-primary hover:underline text-sm"
          >
            ← Back to Saudi IS Study
          </Link>
        </div>
      </div>
    </div>
  );
}
