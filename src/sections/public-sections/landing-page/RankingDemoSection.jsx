import React, { useState, useEffect } from 'react';
import { staticStatements } from '../../../data/staticDemoData';

const RankingDemoSection = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [warnings, setWarnings] = useState({
    groupNeg2: "",
    groupNeg1: "",
    groupZero: "",
    groupPos1: "",
    groupPos2: "",
  });

  const distribution = [1, 3, 5, 3, 1];
  const demoStatements = staticStatements; // Use all 13 statements for demo

  // Initialize selectedValues
  useEffect(() => {
    const initialSelectedValues = demoStatements.reduce((acc, { statementID }) => {
      acc[statementID] = 0;
      return acc;
    }, {});
    setSelectedValues(initialSelectedValues);
  }, []);

  // Recalculate warnings based on selectedValues changes
  useEffect(() => {
    const groupNeg2 = demoStatements.filter(({ statementID }) => selectedValues[statementID] === -2);
    const groupNeg1 = demoStatements.filter(({ statementID }) => selectedValues[statementID] === -1);
    const groupZero = demoStatements.filter(({ statementID }) => selectedValues[statementID] === 0);
    const groupPos1 = demoStatements.filter(({ statementID }) => selectedValues[statementID] === 1);
    const groupPos2 = demoStatements.filter(({ statementID }) => selectedValues[statementID] === 2);

    const newWarnings = {};
    newWarnings.groupNeg2 = getGroupWarning(groupNeg2, distribution[0]);
    newWarnings.groupNeg1 = getGroupWarning(groupNeg1, distribution[1]);
    newWarnings.groupZero = getGroupWarning(groupZero, distribution[2]);
    newWarnings.groupPos1 = getGroupWarning(groupPos1, distribution[3]);
    newWarnings.groupPos2 = getGroupWarning(groupPos2, distribution[4]);

    setWarnings(newWarnings);
  }, [selectedValues]);

  const getGroupWarning = (group, targetCount) => {
    const groupLength = group.length;
    if (groupLength !== targetCount) {
      const difference = targetCount - groupLength;
      return difference > 0
        ? `Too few statements for this rank - should be ${targetCount} statements`
        : `Too many statements for this rank - should be ${targetCount} statements`;
    }
    return "";
  };

  const handleRadioChange = (id, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    setSelectedValues(
      demoStatements.reduce((acc, { statementID }) => {
        acc[statementID] = 0;
        return acc;
      }, {})
    );
  };

  const isValid = Object.values(warnings).every(w => w === "");
  const getWarningColor = (groupName) => (warnings[groupName] ? "#f8d7da" : "#e3f2fd");

  return (
    <div className="ranking-demo-section bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            INTERACTIVE DEMO
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            GLLM Governance Q-Sort Exercise
          </h2>
          <p className="text-lg text-blue-700 max-w-3xl mx-auto">
            Experience our interactive Q-sort ranking tool for enterprise GLLM governance. 
            Rank governance statements according to their importance using a forced distribution pattern.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-blue-200">
            {/* Demo Notice */}
            <div className="bg-info text-info-content p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Demo Mode:</span>
                <span className="ml-2">This is a demonstration of our GLLM governance ranking interface. Try ranking the 13 governance statements below!</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleReset}
                className="btn btn-outline btn-error"
              >
                Reset Demo
              </button>
            </div>

            {/* Instructions */}
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Rank GLLM governance statements by importance
              </h3>
              <p className="text-base-content">
                Distribute the 13 statements as follows: 1 most important (+2), 3 very important (+1), 
                5 moderately important (0), 3 less important (-1), and 1 least important (-2).
              </p>
            </div>

            {/* Ranking Table */}
            <div className="overflow-x-auto">
              <table className="table table-bordered w-full text-center">
                <tbody>
                  {[
                    { label: "+2", groupName: "groupPos2" },
                    { label: "+1", groupName: "groupPos1" },
                    { label: "0", groupName: "groupZero" },
                    { label: "-1", groupName: "groupNeg1" },
                    { label: "-2", groupName: "groupNeg2" },
                  ].map(({ label, groupName }) => {
                    const group = demoStatements.filter(({ statementID }) => 
                      selectedValues[statementID] === (label === "+2" ? 2 : label === "+1" ? 1 : label === "0" ? 0 : label === "-1" ? -1 : -2)
                    );
                    const warning = warnings[groupName];
                    return (
                      <React.Fragment key={label}>
                        <tr style={{ backgroundColor: getWarningColor(groupName) }}>
                          <td className="w-1/12 text-primary font-bold text-xl">
                            {label}
                          </td>
                          <td colSpan={2} className="w-2/3 text-error italic">
                            {warning || ""}
                          </td>
                          {["-2", "-1", "0", "+1", "+2"].map((val) => (
                            <td key={val} className="w-1/12">
                              {val}
                            </td>
                          ))}
                        </tr>
                        {group.map((statement) => (
                          <tr
                            key={statement.statementID}
                            className="hover:bg-base-200"
                          >
                            <td className="w-1/12"></td>
                            <td className="w-1/12 font-bold">{statement.statementID}</td>
                            <td className="w-1/2 text-left pl-4">{statement.statementText}</td>
                            {[-2, -1, 0, 1, 2].map((val) => (
                              <td key={val} className="w-1/12">
                                <input
                                  type="radio"
                                  name={`option-${statement.statementID}`}
                                  value={val}
                                  checked={selectedValues[statement.statementID] === val}
                                  onChange={() => handleRadioChange(statement.statementID, val)}
                                  className="radio radio-primary"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            {isValid && (
              <div className="mt-8 text-center">
                <button className="btn btn-success btn-lg">
                  Submit Ranking
                </button>
              </div>
            )}

            {/* Demo Features */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingDemoSection;
