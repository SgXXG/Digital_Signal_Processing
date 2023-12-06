"use client";
import Chart from "chart.js/auto";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { compiler } from "../../../next.config";
import {
  calcFourier,
  calcReverseFourier,
  duplicateArray,
} from "../shared/utility";

export default function Sinus() {
  const [A, setA] = useState(1);
  const [f, setF] = useState(1);
  const [N, setN] = useState(15 * f);
  const [f0, setF0] = useState(0);

  const [checked, setChecked] = useState(false);
  const [modulated, setModulated] = useState(false);
  const [calcClicked, setCalcClicked] = useState(false);

  const [A2, setA2] = useState(1);
  const [f2, setF2] = useState(1);
  const [N2, setN2] = useState(15 * f2);
  const [f02, setF02] = useState(0);

  const [k, setK] = useState(4);
  const x = useMemo(() => {
    let dataArr = [];
    for (let i = 0; i < N; i++) {
      const value = A * Math.sin((2 * Math.PI * f * i) / N + f0);
      dataArr.push(value);
    }
    return dataArr;
  }, [N, A, f0, f]);

  const secondData = useMemo(() => {
    let dataArr = [];
    for (let i = 0; i < N; i++) {
      const value =
        ((2 * A2) / Math.PI) *
        Math.asin(Math.sin((2 * Math.PI * f2 * i) / N + f02));
      dataArr.push(value);
    }
    return dataArr;
  }, [N, A2, f02, f2]);

  const sum = useMemo(() => {
    const firstArr = x;
    const secArr = secondData;
    let dataArr = [];
    for (let i = 0; i < N; i++) {
      const value = firstArr[i] + secArr[i];
      dataArr.push(value);
    }
    return dataArr;
  }, [N, A, f0, f, A2, f02, f2]);

  const kpoints = useMemo(() => {
    let dataArr = [];
    const firstArr = x;
    for (let i = 0; i < N; i += N / k) {
      const val1 = A * Math.sin((2 * Math.PI * f * i) / N + f0);
      const val2 =
        ((2 * A2) / Math.PI) *
        Math.asin(Math.sin((2 * Math.PI * f2 * i) / N + f02));
      const value = val1+val2
      dataArr.push(value);
    }
    console.log(dataArr);
    return dataArr;
  }, [N, A, f0, f, A2, f02, f2, k]);

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

  const fourier = useMemo(
    () => calcFourier(kpoints, N, trigResults),
    [N, A, f0, f, k]
  );

  const reversePoints = useMemo(() => {
    const reverse = calcReverseFourier(fourier, N, false);
    return reverse;
  }, [N, A, f0, f, k]);

  const xDataset1 = [];
  const xDataset2 = [];
  x.map((el, index) => {
    const res = { x: index.toString(), y: el };
    xDataset1.push(res);
  });
  reversePoints.map((el, index) => {
    const res = { x: index.toString(), y: el };
    xDataset2.push(res);
  });
  const labels = [...Array(N + 1).keys()];
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
            label: "Triangle",
            backgroundColor: "rgb(44,166,118)",
            borderColor: "rgb(44,166,118)",
            data: secondData,
          }
        : {},
      {
        label: "Polyharmonic",
        backgroundColor: "rgb(24,58,226)",
        borderColor: "rgb(24,58,226)",
        data: sum,
      },
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
              <div className="param-name">f:</div>
              <button className="param-btn" onClick={() => setF(f - 1)}>
                -
              </button>
              <div className="param-value">{f}</div>
              <button className="param-btn" onClick={() => setF(f + 1)}>
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
              <div className="param-name">f0: </div>
              <button className="param-btn" onClick={() => setF0(f0 - 1)}>
                -
              </button>
              <div className="param-value">{f0}</div>
              <button className="param-btn" onClick={() => setF0(f0 + 1)}>
                +
              </button>
            </div>
          </div>

          {/* <button
            className="sumBtn"
            onClick={() => {
              setModulated(!modulated);
            }}
          >
            Modulate
          </button> */}
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
                  <div className="param-name">f:</div>
                  <button className="param-btn" onClick={() => setF2(f2 - 1)}>
                    -
                  </button>
                  <div className="param-value">{f2}</div>
                  <button className="param-btn" onClick={() => setF2(f2 + 1)}>
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
                  <div className="param-name">f0: </div>
                  <button className="param-btn" onClick={() => setF02(f02 - 1)}>
                    -
                  </button>
                  <div className="param-value">{f02}</div>
                  <button className="param-btn" onClick={() => setF02(f02 + 1)}>
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
