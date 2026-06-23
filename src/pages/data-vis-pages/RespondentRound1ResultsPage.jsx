import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useExerciseStatements } from "../../api/hooks/useExerciseStatements";
import { useRespondentDistribution } from "../../api/hooks/useRespondentDistribution";
import { useRespondentQSort } from "../../api/hooks/useRespondentQSort";
import { getParticipantByRespondentId } from "../../data/saudiISStudyRound1Results";
import SaudiISStudyRound1ResultsContent from "../../sections/study-results/SaudiISStudyRound1ResultsContent";

export default function RespondentRound1ResultsPage() {
  const { user } = useContext(AuthContext);
  const { data: statements, loading: statementsLoading } = useExerciseStatements();
  const { distribution, loading: distributionLoading } = useRespondentDistribution();
  const { data: qSortItems, loading: qSortLoading, error: qSortError } = useRespondentQSort();

  const distributionSlots = useMemo(() => {
    if (!distribution) return null;
    const slots = distribution.split(",").map((value) => parseInt(value, 10));
    return slots.length === 5 && slots.every((n) => !Number.isNaN(n)) ? slots : null;
  }, [distribution]);

  const participant = useMemo(() => {
    if (qSortLoading || !qSortItems?.length) return null;
    return getParticipantByRespondentId(user?.id, user?.username);
  }, [user?.id, user?.username, qSortItems, qSortLoading]);

  const sortingData = useMemo(() => {
    if (!qSortItems?.length) return [];

    return qSortItems
      .map((item) => {
        const statement = statements?.find(
          (entry) =>
            entry.statementID === item.statementID ||
            entry.statementID === item.statementId
        );

        const short = item.short || statement?.short;
        const statementText = item.statementText || statement?.statementText;
        const qSortValue = item.qSortValue;

        if (short == null || qSortValue == null) return null;

        return {
          statementID: item.statementID ?? item.statementId ?? statement?.statementID,
          short,
          statementText,
          qSortValue,
        };
      })
      .filter(Boolean);
  }, [statements, qSortItems]);

  return (
    <SaudiISStudyRound1ResultsContent
      variant="personal"
      participant={participant}
      sortingData={sortingData}
      sortingLoading={statementsLoading || qSortLoading || distributionLoading}
      sortingDistribution={distributionSlots}
      sortingError={qSortError}
    />
  );
}
