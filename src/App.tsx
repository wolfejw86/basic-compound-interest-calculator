/* eslint-disable no-mixed-operators */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import "./index.css";

function calcGrowth(
  ct: number,
  start: number,
  yrlyAdd: number,
  growthRate: number,
  compoundRate: number
) {
  const x = [];
  const y = [];
  for (let i = 0; i < ct; i++) {
    x.push(i + 1);

    start =
      yrlyAdd +
      start * Math.pow(1 + growthRate / 100 / compoundRate, compoundRate);
    y.push(Number(start.toFixed(2)));
  }
  return { x, y };
}

function App() {
  const [startingBalance, setStartingBalance] = useState("0");
  const [growthRate, setgrowthRate] = useState("5");
  const [compoundRate, setCompoundRate] = useState("1");
  const [compoundtime, setCompoundTime] = useState("10");
  const [addYrlyContrib, setAdditionalYrlyContrib] = useState("0");
  const [plotData, setPlotData] = useState<any>([
    { type: "line", x: [], y: [] },
  ]);

  const [gainsByYear, setGainsByYear] = useState<number[]>([]);

  const [Plotly, setPlotly] = useState<any>(null);

  useEffect(() => {
    import("react-plotly.js").then((Plot) => {
      setPlotly(Plot);
    });
  }, []);

  useEffect(() => {
    if (!Plotly) {
      return;
    }

    const a = [];
    let startingBalanceN = Number(startingBalance);
    const growthRateN = Number(growthRate);
    const compoundRateN = Number(compoundRate);
    const compoundtimeN = Number(compoundtime);
    const yrlyContrib = Number(addYrlyContrib);

    const growthRateVariances = [-1, -2, 0, 1, 2].map((rateVariance) => ({
      type: "line",
      name: growthRateN + rateVariance + "% Growth",
      ...calcGrowth(
        compoundtimeN,
        startingBalanceN,
        yrlyContrib,
        growthRateN + rateVariance,
        compoundRateN
      ),
    }));

    for (let i = 0; i < compoundtimeN; i++) {
      startingBalanceN =
        yrlyContrib +
        startingBalanceN *
          Math.pow(1 + growthRateN / 100 / compoundRateN, compoundRateN);
      a.push(startingBalanceN);
    }
    setGainsByYear(a);
    setPlotData([...growthRateVariances]);
  }, [
    startingBalance,
    growthRate,
    compoundRate,
    compoundtime,
    addYrlyContrib,
    Plotly,
  ]);

  return (
    <div className="App">
      <div className="input-container" title="balance to begin compounding with">
        <label htmlFor="startingBalance">Starting Balance $</label>
        <input
          type="number"
          name="startingBalance"
          value={startingBalance}
          onChange={(e) => setStartingBalance(e.target.value)}
        />
      </div>

      <div className="input-container" title="rate of growth is in whole percentage integers">
        <label htmlFor="growthRate">Rate Of Growth %</label>
        <input
          type="number"
          name="growthRate"
          value={growthRate}
          onChange={(e) => setgrowthRate(e.target.value)}
        />
      </div>

      <div className="input-container" title="per time ex. 1 means yearly if time is in years">
        <label htmlFor="compoundRate">Compound Rate</label>
        <input
          type="number"
          name="compoundRate"
          value={compoundRate}
          onChange={(e) => setCompoundRate(e.target.value)}
        />
      </div>

      <div className="input-container" title="can be any time, easiest to use years">
        <label htmlFor="compoundtime">Compound Time </label>
        <input
          type="number"
          name="compoundtime"
          value={compoundtime}
          onChange={(e) => setCompoundTime(e.target.value)}
        />
      </div>

      <div className="input-container" title="How much you will contribute per time interval - ex. if rate is years, then this would be a yearly contribution">
        <label htmlFor="addYrlyContrib">Additional Contributions Per Time Interval</label>
        <input
          type="number"
          name="addYrlyContrib"
          value={addYrlyContrib}
          onChange={(e) => setAdditionalYrlyContrib(e.target.value)}
        />
      </div>

      <div className="output-container">
        <div className="table">
          <h2>Compounded Balance By Time Interval</h2>
          <table>
            <thead>
              <tr>
                <td>Year</td>
                <td>Amount</td>
              </tr>
            </thead>
            <tbody>
              {gainsByYear.map((g, j) => (
                <tr key={j}>
                  <td>{j + 1}</td>
                  <td>
                    $
                    {g.toLocaleString().includes(".")
                      ? g.toLocaleString()
                      : g.toLocaleString() + ".00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(Plotly && (
          <div className="chartt">
            <Plotly.default
              data={plotData}
              layout={{
                title: "Growth Over Time",
                yaxis: { tickprefix: "$", title: { text: "Total $$$" } },
                xaxis: { title: { text: "Years Of Growth" } },
              }}
              config={{ responsive: true }}
            />
          </div>
        )) || (
          <div className="loading-container">
            <h2>Loading Chart...</h2>
            <div className="loadingspinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
