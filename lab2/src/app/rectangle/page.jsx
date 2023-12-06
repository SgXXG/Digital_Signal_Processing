"use client";
import Chart from "chart.js/auto";
import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { compiler } from "../../../next.config";
import {
  calcFourier,
  calcReverseFourier,
  duplicateArray,
} from "../shared/utility";
export default function Rectangle() {
  const [A, setA] = useState(1);
  const [T, setT] = useState(0.3);
  const [N, setN] = useState(32);
  const [dc, setDc] = useState(0.5);

  const [checked, setChecked] = useState(false);
  const [calcClicked, setCalcClicked] = useState(false);
  const [k, setK] = useState(4);

  const [A2, setA2] = useState(1);
  const [T2, setT2] = useState(0.5);
  const [N2, setN2] = useState(30 * T2);
  const [dc2, setDc2] = useState(0.5);

  const x = () => {
    let dataArr = [];
    for (let i = 0; i < N; i++) {
      const value = ((i / N) % T) / T < dc ? A : -A;
      dataArr.push(value);
    }
    return dataArr;
  };
  const kpoints = useMemo(() => {
    let dataArr = [];
    for (let i = 0; i < N; i += N / k) {
      const value = ((i / N) % T) / T < dc ? A : -A;
      dataArr.push(value);
    }
    return dataArr;
  }, [N, A, T, dc, k]);

  const secondData = () => {
    let dataArr = [];
    for (let i = 0; i <= 2 * N; i++) {
      const value = ((i / N) % T2) / T2 < dc2 ? A2 : -A2;
      dataArr.push(value);
    }
    return dataArr;
  };

  const sum = () => {
    const firstArr = x();
    const secArr = secondData();
    let dataArr = [];
    for (let i = 0; i <= 2 * N; i++) {
      const value = firstArr[i] + secArr[i];
      dataArr.push(value);
    }
    return dataArr;
  };

  const trigResults = useMemo(() => {
    const result = [];
    for (let i = 0; i < N * N; i++) {
      const angle = (2 * Math.PI * i) / N;
      result.push({
        sin: Math.sin(angle),
        cos: Math.cos(angle),
      });
    }
    return result;
  }, [N, k]);

  const fourier = useMemo(() => {
    return calcFourier(kpoints, N, trigResults);
  }, [A, T, N, dc, k]);

  const reversePoints = useMemo(() => {
    const reverse = calcReverseFourier(fourier, N, true);
    return reverse;
  }, [A, T, N, dc, k]);
  const xDataset1 = [];
  const xDataset2 = [];
  const x1 = x();
  x1.map((el, index) => {
    const res = { x: index.toString(), y: el };
    xDataset1.push(res);
  });
  reversePoints.map((el, index) => {
    const res = { x: index.toString(), y: el };
    xDataset2.push(res);
  });
  const labels = [...Array(2 * N + 1).keys()];
  const data = {
    //labels: labels,
    datasets: [
      {
        label: "Sinusoida",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: xDataset1,
      },

      {
        label: "Time Spectrum",
        backgroundColor: "rgb(255, 255, 0)",
        borderColor: "rgb(255, 255, 0)",
        data: xDataset2,
      },

      checked
        ? {
            label: "second func",
            backgroundColor: "rgb(44,166,118)",
            borderColor: "rgb(44,166,118)",
            data: secondData(),
          }
        : {},
      calcClicked
        ? {
            label: "sum",
            backgroundColor: "rgb(24,58,226)",
            borderColor: "rgb(24,58,226)",
            data: sum(),
          }
        : {},
    ],
  };

  const amplData = {
    labels: labels,
    datasets: [
      {
        label: "Amplitude Spectrum",
        backgroundColor: "rgb(3, 2, 2)",
        borderColor: "rgb(3, 2, 2)",
        data: fourier.A,
      },
    ],
  };
  const phaseData = {
    labels: labels,
    datasets: [
      {
        label: "Phase Spectrum",
        backgroundColor: "rgb(102, 255, 255)",
        borderColor: "rgb(102, 255, 255)",
        data: fourier.phases,
      },
    ],
  };

  const calcSum = () => {
    setCalcClicked(true);
  };

  return (
    <>
      <div className="sinus-container">
        <div className="sinus-functions-container">
          <div className="params-container">
            First Func:
            <div className="params-box">
              <div className="param-name">k: </div>
              <button className="param-btn" onClick={() => setK(k - 1)}>
                -
              </button>
              <div className="param-value">{k}</div>
              <button
                className="param-btn"
                onClick={() => {
                  setK(k + 1);
                  // k < N ? setK(k + 1) : setK(k);
                }}
              >
                +
              </button>
            </div>
            <div className="params-box">
              <div className="param-name">A:</div>
              <button className="param-btn" onClick={() => setA(A - 1)}>
                -
              </button>
              <div className="param-value">{A}</div>
              <button className="param-btn" onClick={() => setA(A + 1)}>
                +
              </button>
            </div>
            <div className="params-box">
              <div className="param-name">T:</div>
              <button className="param-btn" onClick={() => setT(T - 0.1)}>
                -
              </button>
              <div className="param-value">{T.toFixed(2)}</div>
              <button className="param-btn" onClick={() => setT(T + 0.1)}>
                +
              </button>
            </div>
            <div className="params-box">
              <div className="param-name">N: </div>
              <button className="param-btn" onClick={() => setN(N - 1)}>
                -
              </button>
              <div className="param-value">{N}</div>
              <button className="param-btn" onClick={() => setN(N + 1)}>
                +
              </button>
            </div>
            <div className="params-box">
              <div className="param-name">dc: </div>
              <button className="param-btn" onClick={() => setDc(dc - 0.05)}>
                -
              </button>
              <div className="param-value">{dc.toFixed(1)}</div>
              <button className="param-btn" onClick={() => setDc(dc + 0.05)}>
                +
              </button>
            </div>
          </div>
          <div className="checkbox-container">
            <div className="">Show second func</div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                setChecked(!checked);
                setCalcClicked(false);
              }}
              placeholder="Show"
            />
          </div>

          {checked ? (
            <>
              <div className="params-container">
                Second Func:
                <div className="params-box">
                  <div className="param-name">A:</div>
                  <button className="param-btn" onClick={() => setA2(A2 - 1)}>
                    -
                  </button>
                  <div className="param-value">{A2}</div>
                  <button className="param-btn" onClick={() => setA2(A2 + 1)}>
                    +
                  </button>
                </div>
                <div className="params-box">
                  <div className="param-name">T:</div>
                  <button className="param-btn" onClick={() => setT2(T2 - 0.1)}>
                    -
                  </button>
                  <div className="param-value">{T2.toFixed(2)}</div>
                  <button className="param-btn" onClick={() => setT2(T2 + 0.1)}>
                    +
                  </button>
                </div>
                <div className="params-box">
                  <div className="param-name">N: </div>
                  <button className="param-btn" onClick={() => setN(N - 1)}>
                    -
                  </button>
                  <div className="param-value">{N}</div>
                  <button className="param-btn" onClick={() => setN(N + 1)}>
                    +
                  </button>
                </div>
                <div className="params-box">
                  <div className="param-name">dc: </div>
                  <button
                    className="param-btn"
                    onClick={() => setDc2(dc2 - 0.1)}
                  >
                    -
                  </button>
                  <div className="param-value">{dc2.toFixed(1)}</div>
                  <button
                    className="param-btn"
                    onClick={() => setDc2(dc2 + 0.1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="sumBtn"
                onClick={() => {
                  calcSum();
                }}
              >
                Calculate sum
              </button>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="chart-container">
          <div className="chart">
            <Line data={data} />
          </div>
          <div className="chart">
            <Line data={amplData} />
          </div>
          <div className="chart">
            <Line data={phaseData} />
          </div>
        </div>
      </div>
    </>
  );
}
