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
    import("react-plotly.js").then(Plot => {
      setPlotly(Plot);
    })
  }, [])

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

    const growthRateVariances = [0, 1, 2, -1, -2].map((rateVariance) => ({
      type: "line",
      name: growthRateN + rateVariance + '% Growth',
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
    setPlotData([ ...growthRateVariances]);
  }, [startingBalance, growthRate, compoundRate, compoundtime, addYrlyContrib, Plotly]);

  return (
    <div className="App">
      <label htmlFor="">Starting Balance $</label>
      <input
        type="number"
        value={startingBalance}
        onChange={(e) => setStartingBalance(e.target.value)}
      />

      <label htmlFor="">Rate Of Growth %</label>
      <input
        type="number"
        value={growthRate}
        onChange={(e) => setgrowthRate(e.target.value)}
      />

      <label htmlFor="">Compound Rate</label>
      <input
        type="number"
        value={compoundRate}
        onChange={(e) => setCompoundRate(e.target.value)}
      />

      <label htmlFor="">Compound Time</label>
      <input
        type="number"
        value={compoundtime}
        onChange={(e) => setCompoundTime(e.target.value)}
      />

      <label htmlFor="">Additional Yearly Contributions</label>
      <input
        type="number"
        value={addYrlyContrib}
        onChange={(e) => setAdditionalYrlyContrib(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        {Plotly && <Plotly.default
          data={plotData}
          layout={{ width: 800, height: 600, title: "Growth Over Time",yaxis: {tickprefix: '$',title: { text: 'Total $$$'}}, xaxis: {title: { text: 'Years Of Growth'}} }}
        />}
      </div>
    </div>
  );
}

export default App;
