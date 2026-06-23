import { Link } from "react-router-dom";
import {
  round1Meta,
  round1PlainLanguage,
  factorLoadings,
  factorLoadingsTotal,
  statementFactorScores,
  factorInterpretations,
  respondentFactors,
  getFactorInterpretation,
} from "../../data/saudiISStudyRound1Results";
import PersonalSortingVisualization from "./PersonalSortingVisualization";

const HIGHLIGHT_ROW = "bg-primary/15 ring-2 ring-primary/40";
const HIGHLIGHT_CELL = "bg-primary/20 font-semibold text-primary";

function formatScore(value) {
  if (value === null || value === undefined) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function ResultsTable({ columns, rows, striped = true, highlightRow, highlightColumn }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
      <table className="table w-full text-sm">
        <thead>
          <tr className="bg-[#0076BA] text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-semibold ${
                  highlightColumn === col.key ? "bg-[#005f96]" : ""
                } ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.label}
                {highlightColumn === col.key ? " (You)" : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isHighlighted = highlightRow?.(row);
            return (
              <tr
                key={row.id ?? row.factor ?? row.label ?? index}
                className={[
                  striped && index % 2 === 1 && !isHighlighted ? "bg-[#EDF7FC]" : "",
                  isHighlighted ? HIGHLIGHT_ROW : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`text-secondary-content ${
                      col.align === "right" ? "text-right tabular-nums" : "text-left"
                    } ${col.bold ? "font-medium" : ""} ${
                      highlightColumn === col.key ? HIGHLIGHT_CELL : ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ children, highlight = false }) {
  return (
    <h2
      className={`text-xl font-semibold mb-4 ${
        highlight ? "text-primary" : "text-secondary-content"
      }`}
    >
      {children}
    </h2>
  );
}

export default function SaudiISStudyRound1ResultsContent({
  variant = "public",
  participant = null,
  sortingData = [],
  sortingLoading = false,
  sortingError = null,
  sortingDistribution = null,
}) {
  const isPersonal = variant === "personal";
  const hasSubmittedRanking = isPersonal && !sortingLoading && sortingData.length > 0;
  const userFactor = hasSubmittedRanking ? (participant?.factor ?? null) : null;
  const userFactorKey = userFactor ? `f${userFactor}` : null;
  const factorInfo = getFactorInterpretation(userFactor);

  const factorColumns = ["f1", "f2", "f3", "f4", "f5"];

  return (
    <div className={isPersonal ? "" : "bg-base-200 min-h-screen"}>
      <div
        className={`mx-auto px-6 lg:px-10 py-12 lg:py-16 ${
          isPersonal ? "max-w-6xl" : "max-w-5xl"
        }`}
      >
        {!isPersonal && (
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
        )}

        <header className="mb-10">
          <p className="text-primary font-semibold mb-2">
            {isPersonal ? "Your panel results" : "Data collection results"}
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-content leading-tight mb-2">
            {round1Meta.title}
          </h1>
          <p className="text-lg text-secondary-content/80 mb-4">{round1Meta.subtitle}</p>
          {!isPersonal && (
            <div className="flex flex-wrap gap-6 text-sm text-secondary-content/70">
              <span>
                <span className="font-medium text-secondary-content">Published:</span>{" "}
                {round1Meta.published}
              </span>
            </div>
          )}
        </header>

        {isPersonal && (
          <section className="mb-10 space-y-6">
            <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 p-6 lg:p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                Your position in the panel
              </p>
              {hasSubmittedRanking && userFactor ? (
                <>
                  <h2 className="text-2xl font-bold text-secondary-content mb-2">
                    School of Thought {userFactor}: {factorInfo?.interpretation}
                  </h2>
                  <p className="text-secondary-content/90 leading-relaxed mb-4">
                    {factorInfo?.explanation}. Your ranking pattern was grouped with{" "}
                    {factorLoadings.find((entry) => entry.factor === userFactor)?.loadings}{" "}
                    other experts who share a similar perspective.
                  </p>
                </>
              ) : hasSubmittedRanking ? (
                <p className="text-secondary-content/90 leading-relaxed">
                  Your ranking did not load strongly onto a single School of Thought in Round 1.
                  That can happen when your priorities blend several perspectives. The full panel
                  results below still show where the broader group converged and diverged.
                </p>
              ) : (
                <p className="text-secondary-content/90 leading-relaxed">
                  You have not submitted a Round 1 ranking yet. However, you can review round 1
                  results and choose to participate in the next round.
                </p>
              )}
              <p className="text-sm text-secondary-content/70">
                {hasSubmittedRanking
                  ? "Sections highlighted below are connected to your submission. Other participants remain anonymous."
                  : "The panel results below are available to review now. Complete the ranking exercise when you are ready to add your own priorities."}
              </p>
            </div>

            <div>
              <SectionHeading highlight>Your Round 1 ranking</SectionHeading>
              <PersonalSortingVisualization
                sortingData={sortingData}
                loading={sortingLoading}
                error={sortingError}
                distribution={sortingDistribution}
              />
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-primary">32</p>
            <p className="text-sm text-secondary-content mt-1">Respondents</p>
          </div>
          <div
            className={`rounded-xl border bg-base-100 p-5 shadow-sm ${
              isPersonal && userFactor ? "border-primary/40 ring-2 ring-primary/20" : "border-base-300"
            }`}
          >
            <p className="text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-secondary-content mt-1">Schools of Thought</p>
            {isPersonal && userFactor && (
              <p className="text-xs text-primary mt-2 font-medium">You align with Factor {userFactor}</p>
            )}
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
                      <li
                        key={label}
                        className="flex gap-3 text-secondary-content/90 leading-relaxed"
                      >
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
          <SectionHeading highlight={isPersonal && !!userFactor}>
            Loadings for each factor (School of Thought)
          </SectionHeading>
          <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-[#0076BA] text-white">
                  <th className="text-right font-semibold">Factor</th>
                  <th className="text-right font-semibold">Loadings</th>
                </tr>
              </thead>
              <tbody>
                {factorLoadings.map(({ factor, loadings }, index) => {
                  const isUserFactor = isPersonal && factor === userFactor;
                  return (
                    <tr
                      key={factor}
                      className={[
                        index % 2 === 1 && !isUserFactor ? "bg-[#EDF7FC]" : "",
                        isUserFactor ? HIGHLIGHT_ROW : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td className="text-right tabular-nums text-secondary-content">
                        {factor}
                        {isUserFactor ? " (You)" : ""}
                      </td>
                      <td className="text-right tabular-nums text-secondary-content">{loadings}</td>
                    </tr>
                  );
                })}
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
          <SectionHeading highlight={isPersonal && !!userFactor}>
            Distinguishing statements by factor
          </SectionHeading>
          <p className="text-sm text-secondary-content/80 mb-4">
            Factor scores for statements that significantly distinguish each School of Thought.
            {isPersonal && userFactor && " Your School of Thought column is highlighted."}
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
            highlightColumn={isPersonal ? userFactorKey : null}
          />
        </section>

        <section className="mb-12">
          <SectionHeading highlight={isPersonal && !!userFactor}>
            Interpretation of the factors
          </SectionHeading>
          <ResultsTable
            columns={[
              { key: "factor", label: "Factor", align: "right" },
              { key: "interpretation", label: "Interpretation", align: "left", bold: true },
              { key: "explanation", label: "Explanation", align: "left" },
            ]}
            rows={factorInterpretations}
            highlightRow={isPersonal ? (row) => row.factor === userFactor : undefined}
          />
        </section>

        <section className="mb-12">
          <SectionHeading highlight={isPersonal}>
            Factor (School of Thought) by respondent
          </SectionHeading>
          <p className="text-sm text-secondary-content/80 mb-4">
            {isPersonal
              ? "Your row is highlighted. Other participants remain anonymous."
              : "An asterisk (*) indicates the factor loading for each participant. Labels are anonymous and cannot be linked to individuals."}
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
                    <th
                      key={key}
                      className={`text-right font-semibold ${
                        isPersonal && userFactorKey === key ? "bg-[#005f96]" : ""
                      }`}
                    >
                      {key.toUpperCase().replace("f", "F")}
                      {isPersonal && userFactorKey === key ? " (You)" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {respondentFactors.map(({ label, respondentId, factor }, index) => {
                  const isCurrentUser =
                    isPersonal && participant && participant.respondentId === respondentId;
                  return (
                    <tr
                      key={label}
                      className={[
                        index % 2 === 1 && !isCurrentUser ? "bg-[#EDF7FC]" : "",
                        isCurrentUser ? HIGHLIGHT_ROW : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td className="text-left text-secondary-content whitespace-nowrap font-medium">
                        {isCurrentUser ? "You" : label}
                      </td>
                      {[1, 2, 3, 4, 5].map((f) => (
                        <td
                          key={f}
                          className={`text-right tabular-nums font-medium ${
                            isCurrentUser && factor === f
                              ? "text-primary font-bold"
                              : "text-secondary-content"
                          } ${isPersonal && userFactor === f ? "bg-primary/10" : ""}`}
                        >
                          {factor === f ? "*" : ""}
                        </td>
                      ))}
                    </tr>
                  );
                })}
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

        {!isPersonal && (
          <div className="pt-6 border-t border-base-300">
            <Link
              to="/projects/saudi-is-study"
              className="inline-flex items-center text-primary hover:underline text-sm"
            >
              ← Back to Saudi IS Study
            </Link>
          </div>
        )}

        {isPersonal && (
          <section className="mt-10 pt-8 border-t border-base-300">
            <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-secondary-content mb-3">
                Ready for the next round?
              </h2>
              <p className="text-secondary-content/90 leading-relaxed mb-6">
                Now that you have reviewed the Round 1 panel results, please complete another
                ranking exercise. You can revise your priorities in light of what the panel found
                in this study round.
              </p>
              <Link
                to="/ranking-exercise"
                className="btn bg-white text-primary border-2 border-primary/70 shadow-md hover:bg-base-100 hover:border-primary"
              >
                Go to Ranking Exercise
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
