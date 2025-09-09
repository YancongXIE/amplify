import React, { useState, useMemo } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';
import { staticUpsetData } from '../../../data/staticDemoData';

const UpsetDemoSection = () => {
  const [nfactors, setNfactors] = useState(10);
  const [emptyOption, setEmptyOption] = useState(true);
  const [minSetSizeOption, setMinSetSizeOption] = useState(0);
  const [limitOption, setLimitOption] = useState(20);
  const [orderOption, setOrderOption] = useState('');
  const [groupOption, setGroupOption] = useState('');
  const [selection, setSelection] = useState(null);

  // Use static data for demo, but filter based on number of factors and empty sets option
  let filteredData = staticUpsetData.slice(0, Math.max(1, Math.min(nfactors, staticUpsetData.length)));
  
  // Filter out empty sets if emptyOption is false
  if (!emptyOption) {
    filteredData = filteredData.filter(factor => factor.sets.length > 0);
  }
  
  const elems = filteredData;

  const { sets } = useMemo(() => extractCombinations(elems), [elems]);

  const combinations = useMemo(() => {
    let orderArray = [];

    if (groupOption !== "") {
      orderArray.push(groupOption);
    }

    if (orderOption !== "") {
      orderArray.push(orderOption);
    }

    const combinationsObject = {
      empty: emptyOption,
      limit: limitOption,
      min: minSetSizeOption,
    };

    if (orderArray.length > 0) {
      combinationsObject.order = orderArray;
    }

    return combinationsObject;
  }, [emptyOption, limitOption, minSetSizeOption, orderOption, groupOption]);

  return (
    <div className="upset-demo-section bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            INTERACTIVE DEMO
          </div>
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            GLLM Governance Factor Analysis
          </h2>
          <p className="text-lg text-green-700 max-w-3xl mx-auto">
            Explore our interactive UpSet visualization tool for analyzing factor intersections 
            and patterns in GLLM governance Q-methodology studies.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-green-200">
            {/* Demo Notice */}
            <div className="bg-info text-info-content p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Demo Mode:</span>
                <span className="ml-2">This is a demonstration of our GLLM governance factor analysis interface with sample data.</span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Number of Factors */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Number of factors to display:
                </label>
                <input
                  type="number"
                  className="input input-bordered input-sm w-full"
                  min="1"
                  max="10"
                  value={nfactors}
                  onChange={(e) => setNfactors(parseInt(e.target.value) || 10)}
                />
                <p className="text-xs text-base-content mt-1">
                  Shows first {nfactors} factors from the analysis
                </p>
              </div>

              {/* Allow Empty Sets */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Allow empty sets?
                </label>
                <select
                  value={emptyOption}
                  onChange={(e) => setEmptyOption(e.target.value === 'true')}
                  className="select select-bordered select-sm w-full"
                >
                  <option value={false}>False (Hide empty factors)</option>
                  <option value={true}>True (Show empty factors)</option>
                </select>
                <p className="text-xs text-base-content mt-1">
                  {emptyOption ? 'Showing factors with no governance statements' : 'Hiding factors with no governance statements'}
                </p>
              </div>

              {/* Bar Limit */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Bar limit:
                </label>
                <input
                  type="number"
                  className="input input-bordered input-sm w-full"
                  min="0"
                  value={limitOption}
                  onChange={(e) => setLimitOption(parseInt(e.target.value) || 20)}
                />
                <p className="text-xs text-base-content mt-1">
                  Maximum number of bars to display
                </p>
              </div>

              {/* Minimum Set Size */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Minimum set size:
                </label>
                <input
                  type="number"
                  className="input input-bordered input-sm w-full"
                  min="0"
                  value={minSetSizeOption}
                  onChange={(e) => setMinSetSizeOption(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-base-content mt-1">
                  Minimum items required in a set
                </p>
              </div>

              {/* Group Sorting */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Sort based on group
                </label>
                <select
                  value={groupOption}
                  onChange={(e) => setGroupOption(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="">Do not sort based on group</option>
                  <option value='group:desc'>Descending order</option>
                  <option value="group:asc">Ascending order</option>
                </select>
                <p className="text-xs text-base-content mt-1">
                  Sort combinations by group size
                </p>
              </div>

              {/* Sorting Order */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Sorting order
                </label>
                <select
                  value={orderOption}
                  onChange={(e) => setOrderOption(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="">Default sorting</option>
                  <option value='degree:desc'>Descending order</option>
                  <option value="degree:asc">Ascending order</option>
                </select>
                <p className="text-xs text-base-content mt-1">
                  Sort combinations by degree
                </p>
              </div>
            </div>

            {/* Current Factors Display */}
            <div className="mb-4 p-4 bg-base-100 rounded-lg">
              <h4 className="font-semibold text-base-content mb-2">Currently Displayed Factors ({elems.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {elems.map((factor, index) => (
                  <span key={index} className="badge badge-primary badge-sm">
                    {factor.name}
                  </span>
                ))}
              </div>
            </div>

            {/* UpSet Chart */}
            <div className="flex justify-center items-center w-full h-[600px] my-8 relative">
              <div className="text-center">
                <UpSetJS
                  sets={sets}
                  combinations={combinations}
                  width={1200}
                  height={500}
                  selection={selection}
                  onHover={setSelection}
                  selectionColor="orange"
                  hoverColor="lightblue"
                  hasSelectionOpacity={0.3}
                  exportButtons={true}
                  title="GLLM Governance Factor Analysis"
                  description="Interactive visualization of governance factor intersections and patterns"
                  style={{
                    borderRadius: "8px",
                    padding: "15px",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}
                />
              </div>
            </div>

            {/* Demo Features */}
            

            {/* Sample Data Info */}
            <div className="mt-8 bg-base-100 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-4">GLLM Governance Factor Analysis Results</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3">Identified Governance Factors:</h5>
                  <ul className="text-sm text-base-content space-y-2">
                    <li>• <strong>Factor 1:</strong> Data Protection & Privacy (Data Privacy, Access Control, Audit Trails, Training Data)</li>
                    <li>• <strong>Factor 2:</strong> Ethical AI & Compliance (Ethical AI, Regulatory Compliance, Transparency, Human Oversight)</li>
                    <li>• <strong>Factor 3:</strong> Risk & Security Management (Risk Management, Access Control, Audit Trails, Model Governance)</li>
                    <li>• <strong>Factor 4:</strong> Governance & Oversight (Model Governance, Human Oversight, Transparency, Regulatory Compliance)</li>
                    <li>• <strong>Factor 5:</strong> Technical Implementation (Training Data, Model Governance, Access Control, Audit Trails)</li>
                    <li>• <strong>Factor 6:</strong> Regulatory & Legal (Regulatory Compliance, Ethical AI, Transparency, Data Privacy)</li>
                    <li>• <strong>Factor 7:</strong> Operational Excellence (Risk Management, Model Governance, Audit Trails, Human Oversight)</li>
                    <li>• <strong>Factor 8:</strong> Emerging Technologies (No statements yet - future governance needs)</li>
                    <li>• <strong>Factor 9:</strong> Legacy Systems (No statements - being phased out)</li>
                    <li>• <strong>Factor 10:</strong> Future Considerations (No statements - planned but not implemented)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3">Analysis Capabilities:</h5>
                  <ul className="text-sm text-base-content space-y-2">
                    <li>• <strong>Factor Intersections:</strong> Identify overlapping governance concerns across factors</li>
                    <li>• <strong>Priority Patterns:</strong> Discover which governance elements are most commonly prioritized together</li>
                    <li>• <strong>Gap Analysis:</strong> Find governance areas that may be underrepresented</li>
                    <li>• <strong>Stakeholder Perspectives:</strong> Understand different organizational viewpoints on governance priorities</li>
                    <li>• <strong>Implementation Insights:</strong> Identify practical governance implementation patterns</li>
                    <li>• <strong>Export & Reporting:</strong> Generate detailed analysis reports for decision-making</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsetDemoSection;
