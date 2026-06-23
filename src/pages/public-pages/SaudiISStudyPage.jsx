import { Link } from "react-router-dom";
import { institutions, studyItems } from "../../data/saudiISStudyContent";

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-secondary-content mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-secondary-content leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function SaudiISStudyPage() {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:underline mb-8 text-sm"
        >
          ← Back to homepage
        </Link>

        <header className="mb-12">
          <p className="text-primary font-semibold mb-2">Saudi IS Study</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-content leading-tight">
            Key Information Systems Issues Facing Saudi Arabian Organizations
          </h1>
        </header>

        <section className="mb-12">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  Round 1 complete
                </div>
                <h2 className="text-xl font-semibold text-secondary-content mb-2">
                  Data collection round 1 results
                </h2>
                <p className="text-secondary-content/80 leading-relaxed max-w-2xl">
                  View the preliminary findings from the first ranking round, including
                  five Schools of Thought, factor loadings, distinguishing statements,
                  and scores across all 18 key issues.
                </p>
              </div>
              <Link
                to="/projects/saudi-is-study/round-1-results"
                className="btn btn-primary shrink-0"
              >
                View round 1 results
              </Link>
            </div>
          </div>
        </section>

        <Section title="About this study">
          <p>
            Saudi Arabia&apos;s information systems landscape has changed
            substantially in the past three years: Vision 2030 acceleration,
            PDPL enforcement, the NCA cybersecurity regime, sovereign AI
            initiatives such as HUMAIN and ALLaM, and the rapid expansion of
            national digital platforms. This study aims to identify which
            information systems issues Saudi expert panelists consider most
            important for organizations operating in this environment, looking
            forward over the next two to three years.
          </p>
          <p>
            The study is led by Prof. Richard T. Watson (University of Georgia),
            in collaboration with Dr. Yancong Xie (RMIT University) and Dr.
            Mazen Shawosh (King Fahd University of Petroleum and Minerals).
            Findings will be submitted to SaudiCIS 2026 and shared with the
            Saudi IS community.
          </p>
        </Section>

        <Section title="About the method">
          <p>
            This study uses Claros, a method that combines Q-methodology with
            Delphi-style iteration. Unlike a traditional survey, Claros asks you
            to compare a set of items against one another and place them into a
            forced distribution, so that your ranking reflects relative
            priorities and trade-offs rather than independent ratings. Across
            multiple rounds, you will see how the panel as a whole ranked the
            items (anonymously) and have the opportunity to revise your ranking
            in light of peer perspectives. The goal is not consensus; it is to
            map both shared priorities and distinct schools of thought across
            the panel.
          </p>
        </Section>

        <Section title="What you will do">
          <p>
            You will be presented with 18 statements describing information
            systems issues facing Saudi organizations. Your task is to rank them
            according to their relative importance from your perspective as an
            expert in the Saudi IS context, by placing them into a fixed
            distribution from most important to least important. There are no
            right or wrong answers. We are interested in your professional
            judgment.
          </p>
          <p>
            Each ranking round takes about 20 to 30 minutes. We expect two to
            three rounds in total, spread over three to four weeks.
          </p>
        </Section>

        <Section title="Confidentiality">
          <p>
            Your responses are confidential. The Claros platform assigns each
            participant a unique anonymous identifier; no individual rankings
            will be attributable to you in any publication or report. Aggregated
            factor structures, not individual responses, will be reported.
            Participation is voluntary, and you may withdraw at any time.
          </p>
        </Section>

        <section className="mt-16 pt-10 border-t border-base-300">
          <h2 className="text-3xl font-bold text-secondary-content mb-8">
            Appendix
          </h2>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-secondary-content mb-4">
              Saudi institutions, abbreviations, and concepts used in the items
            </h3>
            <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr className="bg-base-300">
                    <th className="text-secondary-content font-semibold w-1/4">
                      Term
                    </th>
                    <th className="text-secondary-content font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map(({ term, description }) => (
                    <tr key={term}>
                      <td className="align-top font-medium text-secondary-content whitespace-nowrap">
                        {term}
                      </td>
                      <td className="text-secondary-content">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-secondary-content mb-4">
              Items &amp; their descriptions
            </h3>
            <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr className="bg-base-300">
                    <th className="text-secondary-content font-semibold w-12">
                      #
                    </th>
                    <th className="text-secondary-content font-semibold w-36">
                      Short label
                    </th>
                    <th className="text-secondary-content font-semibold w-64">
                      Item
                    </th>
                    <th className="text-secondary-content font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studyItems.map(
                    ({ number, shortLabel, item, description }) => (
                      <tr key={number}>
                        <td className="align-top text-secondary-content">
                          {number}
                        </td>
                        <td className="align-top font-medium text-secondary-content">
                          {shortLabel}
                        </td>
                        <td className="align-top text-secondary-content">
                          {item}
                        </td>
                        <td className="text-secondary-content">
                          {description}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
