const DEFAULT_DISTRIBUTION = [2, 4, 6, 4, 2];

const SCORE_COLUMNS = [
  {
    value: -2,
    label: "Least critical",
    points: "-2 pts",
    cellClass: "bg-[#5a9e4b] text-white",
    emptyClass: "bg-[#5a9e4b]/25",
  },
  {
    value: -1,
    label: "Less critical",
    points: "-1 pt",
    cellClass: "bg-[#b8ddb0] text-secondary-content",
    emptyClass: "bg-[#b8ddb0]/35",
  },
  {
    value: 0,
    label: "Neutral",
    points: "0 pts",
    cellClass: "bg-[#c8c8c8] text-secondary-content",
    emptyClass: "bg-[#c8c8c8]/40",
  },
  {
    value: 1,
    label: "More critical",
    points: "+1 pt",
    cellClass: "bg-[#f5c4a8] text-secondary-content",
    emptyClass: "bg-[#f5c4a8]/35",
  },
  {
    value: 2,
    label: "Most critical",
    points: "+2 pts",
    cellClass: "bg-[#e89256] text-white",
    emptyClass: "bg-[#e89256]/25",
  },
];

function inferDistribution(sortingData) {
  const counts = SCORE_COLUMNS.map(
    (col) => sortingData.filter((item) => item.qSortValue === col.value).length
  );
  const total = counts.reduce((sum, n) => sum + n, 0);

  if (total > 0 && counts.every((n) => n > 0)) {
    return counts;
  }

  return DEFAULT_DISTRIBUTION;
}

function groupItemsByScore(sortingData) {
  return SCORE_COLUMNS.reduce((groups, col) => {
    groups[col.value] = sortingData
      .filter((item) => item.qSortValue === col.value)
      .sort((a, b) => (a.short || "").localeCompare(b.short || ""));
    return groups;
  }, {});
}

export default function PersonalSortingVisualization({
  sortingData,
  loading,
  error,
  distribution: distributionProp,
  description,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-secondary-content">
        Loading your ranking...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-6 text-secondary-content">
        <p className="font-medium mb-2">Your Round 1 ranking could not be loaded right now.</p>
        <p className="text-sm text-secondary-content/80">
          The panel results below are still available. This is usually a temporary server issue,
          not a problem with your login. Try logging out and back in once; if it persists, please
          contact the study administrator.
        </p>
      </div>
    );
  }

  if (!sortingData?.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-secondary-content">
        No Round 1 ranking was found for your account yet.
      </div>
    );
  }

  const distribution = distributionProp?.length === 5
    ? distributionProp
    : inferDistribution(sortingData);
  const groups = groupItemsByScore(sortingData);
  const maxSlots = Math.max(...distribution);

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4 lg:p-6 shadow-sm">
      <p className="text-sm text-secondary-content/80 mb-6 text-center max-w-2xl mx-auto">
        {description ??
          "Your ranked result is shown below. Each box shows where you placed one of the 18 issues on the −2 to +2 scale."}
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-end justify-center gap-1 sm:gap-2 min-w-[20rem] mx-auto">
          {SCORE_COLUMNS.map((col, columnIndex) => {
            const slots = distribution[columnIndex];
            const items = groups[col.value] || [];
            const paddingSlots = maxSlots - slots;

            return (
              <div
                key={col.value}
                className="flex flex-col justify-end gap-0.5 w-[4.5rem] sm:w-[5.5rem] lg:w-[6.5rem]"
                style={{ minHeight: `${maxSlots * 3.75}rem` }}
              >
                {Array.from({ length: paddingSlots }).map((_, idx) => (
                  <div key={`pad-${idx}`} className="h-[3.5rem] sm:h-[3.75rem]" aria-hidden />
                ))}

                {Array.from({ length: slots }).map((_, slotIndex) => {
                  const item = items[slotIndex];
                  return (
                    <div
                      key={`${col.value}-${slotIndex}`}
                      className={[
                        "h-[3.5rem] sm:h-[3.75rem] border border-black/80 flex items-center justify-center p-1 text-center",
                        item ? col.cellClass : col.emptyClass,
                      ].join(" ")}
                      title={item?.statementText || item?.short}
                    >
                      {item ? (
                        <span className="text-[0.65rem] sm:text-xs font-semibold leading-tight line-clamp-4">
                          {item.short}
                        </span>
                      ) : null}
                    </div>
                  );
                })}

                <div className="pt-2 text-center">
                  <p className="text-[0.65rem] sm:text-xs font-bold text-secondary-content leading-tight">
                    {col.label}
                  </p>
                  <p className="text-[0.6rem] sm:text-[0.65rem] text-secondary-content/70">
                    ({col.points})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
