//
//  IFQ717 Web Development Capstone
//
//  GraphAverages.js - Graphs selected average for selected LGAs by Gary Cazzulino
//
//

import { kGraphLineStyle, kGraphColours } from "../../api/utils/constants";
import { convertToLabel, calculateAreaUnderCurve } from "../../api/utils/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GraphAverages({
  dataSet,
  title,
  field,
  scale,
  LGAs,
}) {
  let options = {
    title: {
      text: title,
    },
    // Data: Data to be displayed in the chart
    data: [
      {
        noosa_lga: "Noosa",
        noosa_average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Noosa")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
        gold_coast_lga: "Gold Coast",
        gold_coast_average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Gold Coast")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
        whitsunday_lga: "Whitsunday",
        whitsunday_average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Whitsunday")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
        cairns_lga: "Cairns",
        cairns_average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Cairns")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      },
    ],
    // Series: Defines which chart type and data to use
    series: [
      LGAs.find((LGA) => LGA === "Noosa")
        ? {
          type: "bar",
          xKey: "noosa_lga",
          yKey: "noosa_average",
          yName: "Noosa",
          interpolation: { type: kGraphLineStyle },
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
        }
        : {},
      LGAs.find((LGA) => LGA === "Gold Coast")
        ? {
          type: "bar",
          xKey: "gold_coast_lga",
          yKey: "gold_coast_average",
          yName: "Gold Coast",
          interpolation: { type: kGraphLineStyle },
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
        }
        : {},
      LGAs.find((LGA) => LGA === "Whitsunday")
        ? {
          type: "bar",
          xKey: "whitsunday_lga",
          yKey: "whitsunday_average",
          yName: "Whitsunday",
          interpolation: { type: kGraphLineStyle },
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
        }
        : {},
      LGAs.find((LGA) => LGA === "Cairns")
        ? {
          type: "bar",
          xKey: "cairns_lga",
          yKey: "cairns_average",
          yName: "Cairns",
          interpolation: { type: kGraphLineStyle },
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
        }
        : {},
    ],
  };


  const data = [
    LGAs.find((LGA) => LGA === "Noosa")
      ? {
        lga: "Noosa",
        average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Noosa")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      }
      : null,
    LGAs.find((LGA) => LGA === "Gold Coast")
      ? {
        lga: "Gold Coast",
        average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Gold Coast")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      }
      : null,
    LGAs.find((LGA) => LGA === "Whitsunday")
      ? {
        lga: "Whitsunday",
        average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Whitsunday")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      }
      : null,
    LGAs.find((LGA) => LGA === "Cairns")
      ? {
        lga: "Cairns",
        average: calculateAreaUnderCurve(
          dataSet
            .filter((sample) => sample.lga_name === "Cairns")
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      }
      : null,
  ];
  return (
    <div style={{ width: "100%", height: "90%" }}>
      <ResponsiveContainer>
        <h2
          className="text-primary-content font-light pb-3"
          style={{ textAlign: "center" }}
        >
          {title}
        </h2>
        {/*<PieChart width={730} height={250}>*/}
        <BarChart
          data={options.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="sample_date" />
          <YAxis />
          <Tooltip />
          {/*<Legend />*/}
          {/*<Pie data={data} nameKey="lga" dataKey="average" >
            {data.map((entry, index) => (
              entry !== null ?
              <Cell key={`cell-${entry.lga}`} fill={kGraphColours[entry.lga]} /> : null
            ))}
          </Pie>*/}
          {LGAs.map((LGA) => {
            return (
              <Bar
                type="monotone"
                name={LGA}
                dataKey={convertToLabel(LGA) + "_average"}
                stroke={kGraphColours[LGA]}
                fill={kGraphColours[LGA]}
                dot={false}
                isAnimationActive={false}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

}
