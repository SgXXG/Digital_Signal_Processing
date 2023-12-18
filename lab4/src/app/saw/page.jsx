/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { compiler } from "../../../next.config";
import Header from '../Header/page'
import {
  calcFourier,
  calcReverseFourier,
  getData,
  medianaAveraging,
  setBandpassFilter,
  setLFF,
  setHFF,
  setParabolaFilter,
  setSlidingAverageFilter,
  Correlate
} from '../shared/utility'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
Chart.register(CategoryScale)

export default function Saw() {
  const [A, setA] = useState(1);
  const [f, setF] = useState(1);
  const [N, setN] = useState(200 * f);
  const [f0, setF0] = useState(0);
  const [k, setK] = useState(4);

  const [BigK, setBigK] = useState(0)

  const [selectedTimeFilter, setSelectedTimeFilter] = useState('')
  const [selectedFreqFilter, setSelectedFreqFilter] = useState('')

  const [x, setX] = useState([]);
  const [kpoints, setKPoints] = useState([]);
  const [fourier, setFourier] = useState({});
  const [reversePoints, setReversedFourier] = useState([]);

  const [filteredTimeData, setFilteredTimeData] = useState([])
  const [filteredFreqData, setFilteredFreqData] = useState([])
  const [filteredReverseFourier, setFilteredReverseFourier] = useState([])

  const [slice, setSlice] = useState(0)
  const [lowSlice, setLowSlice] = useState(0)
  const [highSlice, setHighSlice] = useState(0)

  useEffect(() => {
    const x = calcX();
    const kpoints = calckpoints;
    setX(x);
    setKPoints(kpoints);
    const fourier = calcFourier(kpoints, N);
    setFourier(fourier);
    const reverseFourier = calcReverseFourier(fourier, N, true);
    setReversedFourier(reverseFourier);
  }, [A, f, N, f0, k,k]);

  useEffect(() => {
    const filteredData = getfilteredTimeData()
    setFilteredTimeData(filteredData)
  }, [A, f, N, f0, k, k, BigK, selectedTimeFilter])

  useEffect(() => {
    const filteredData = getfilteredFreqData()
    setFilteredFreqData(filteredData)
    const filteredReverseFourier = filteredData.A
      ? calcReverseFourier(filteredData, N, true)
      : []
    setFilteredReverseFourier(filteredReverseFourier)
  }, [A, f, N, f0, k, k, slice, lowSlice, highSlice, selectedFreqFilter])

  const calcX = () => {
    let dataArr = [];
    for (let i = 0; i < N; i++) {
      const value =
        ((-2 * A) / Math.PI) *
        1 *
        Math.atan(1 / Math.tan((Math.PI * f * i) / N + f0));
      dataArr.push(value);
    }
    return dataArr;
  };
  const  calckpoints = useMemo(() => {
    let dataArr = [];
    for (let i = 0; i < N; i += N / k) {
      const value =
        ((-2 * A) / Math.PI) *
        1 *
        Math.atan(1 / Math.tan((Math.PI * f * i) / N + f0));
      dataArr.push(value);
    }
    return dataArr;
  }, [N, A, f0, f, k]);

  const correlationData = useMemo(() => {
    return Correlate(x, x);
  }, [[N, A, f0, f, k]])


  const getfilteredTimeData = () => {
    switch (selectedTimeFilter) {
      case 'sliding': {
        return setSlidingAverageFilter(x, BigK)
      }
      case 'parabola': {
        return setParabolaFilter(x)
      }
      case 'median': {
        return medianaAveraging(x, BigK)
      }
      default: {
        return []
      }
    }
  }

  const getfilteredFreqData = () => {
    switch (selectedFreqFilter) {
      case 'LFF': {
        return setLFF(fourier, slice)
      }
      case 'HFF': {
        return setHFF(fourier, slice)
      }
      case 'bandpass': {
        return setBandpassFilter(fourier, lowSlice, highSlice)
      }
      default: {
        return []
      }
    }
  }

  const data = {
    datasets: [
      {
        label: 'Пилообразный',
        backgroundColor: 'rgb(221,160,221 )',
        borderColor: 'rgb( 221,160,221 )',
        data: x ? getData(x) : [],
        tension: 0.5
      },

      {
        label: 'Временной спектр',
        backgroundColor: 'rgb(0,49,83)',
        borderColor: 'rgb(0,49,83)',
        data: reversePoints ? getData(reversePoints) : [],
        tension: 0.5
      },
      {
        label: 'Фильтр',
        backgroundColor: 'rgb(80,200,120)',
        borderColor: 'rgb(80,200,120)',
        data: filteredTimeData ? getData(filteredTimeData) : [],
        tension: 0.5
      },
      {
        label: 'Фильтр частотный',
        backgroundColor: 'rgb(255, 0, 0)',
        borderColor: 'rgb(255, 0, 0)',
        data: filteredReverseFourier ? getData(filteredReverseFourier) : [],
        tension: 0.5
      }
    ]
  }

  const amplData = {
    datasets: [
      {
        label: 'Амплитудный спектр',
        backgroundColor: 'rgb(221,160,221 )',
        borderColor: 'rgb( 221,160,221 )',
        data: fourier.A ? getData(fourier.A) : []
      },
      {
        label: 'Фильтр',
        backgroundColor: 'rgb(80,200,120)',
        borderColor: 'rgb(80,200,120)',
        data: filteredFreqData.A ? getData(filteredFreqData.A) : [],
        tension: 0.5
      }
    ]
  }
  const phaseData = {
    datasets: [
      {
        label: 'Фазовый спектр',
        backgroundColor: 'rgb(221,160,221 )',
        borderColor: 'rgb( 221,160,221 )',
        data: fourier.phases ? getData(fourier.phases) : []
      },
      {
        label: 'Фильтр',
        backgroundColor: 'rgb(80,200,120)',
        borderColor: 'rgb(80,200,120)',
        data: filteredFreqData.phases ? getData(filteredFreqData.phases) : [],
        tension: 0.5
      }
    ]
  }

  const corrData = {
    datasets: [
      {
        label: 'Корреляция',
        backgroundColor: 'rgb(80,200,120)',
        borderColor: 'rgb(80,200,120)',
        data: correlationData ? getData(correlationData) : []
      }
    ]
  }

  return (
    <>
      <Header/>
      <div className="sinus-container">
        <div className="sinus-functions-container">
          <div className="params-container">
            <div className="params-box">
              <div className="param-name">k: </div>
              <input type="range" max={128} onChange={(e) => setK(e.target.value)} value={k} />
              <div className="param-value">{k}</div>
            </div>
            <div className="params-box">
              <div className="param-name">Amplitude:</div>
              <input type="range" onChange={(e) => setA(e.target.value)} value={A} />
              <div className="param-value">{A}</div>
            </div>
            <div className="params-box">
              <div className="param-name">Frequency:</div>
              <input type="range" onChange={(e) => setF(e.target.value)} value={f} />
              <div className="param-value">{f}</div>
            </div>
            <div className="params-box">
              <div className="param-name">N: </div>
              <input type="range" max={2048} onChange={(e) => setN(e.target.value)} value={N} />
              <div className="param-value">{N}</div>
            </div>
            <div className="params-box">
              <div className="param-name">Phase: </div>
              <input type="range" onChange={(e) => setF0(e.target.value)} value={f0} />
              <div className="param-value">{f0}</div>
            </div>
            <div className="params__filter">
              <select
               className='params__select'
               value={selectedTimeFilter}
               onChange={e => setSelectedTimeFilter(e.target.value)}
               name="" id="">
                <option value="sliding">Скользящее усреднение</option>
                <option value="median">Медианное усреднение</option>
                <option value="parabola">Парабола 4-й степени</option>
              </select>
              <div className='params-box'>
                <div className="param-name">K: </div>
                <input type="range" min={1} max={100} step={2} onChange={(e) => setBigK(e.target.value)} value={BigK} />
                <div className="param-value">{BigK}</div>
              </div>
            </div>
            <div className="params__filter">
              <select
                className='params__select'
                value={selectedFreqFilter}
                onChange={e => setSelectedFreqFilter(e.target.value)}
                name="" id="">
                <option value="LFF">ФНЧ</option>
                <option value="HFF">ФВЧ</option>
                <option value="bandpass">полосовой фильтр</option>
              </select>
              {selectedFreqFilter == 'LFF' && (
                  <><div className="param-name">срез: </div><input type="range" min={0} max={100} step={1} onChange={(e) => setSlice(e.target.value)} value={slice} /><div className="param-value">{slice}</div></>
              )
              }
              {selectedFreqFilter == 'HFF' && (
                  <><div className="param-name">срез: </div><input type="range" min={0} max={100} step={1} onChange={(e) => setSlice(e.target.value)} value={slice} /><div className="param-value">{slice}</div></>
              )
              }
              {selectedFreqFilter == 'bandpass' && (
                  <><div className="param-name">нижний срез: </div><input type="range" min={0} max={100} step={1} onChange={(e) => setLowSlice(e.target.value)} value={lowSlice} /><div className="param-value">{lowSlice}</div><div className="param-name">верхний срез: </div><input type="range" min={0} max={100} step={1} onChange={(e) => setHighSlice(e.target.value)} value={highSlice} /><div className="param-value">{highSlice}</div></>
              )
              }
            </div>
          </div>
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
          <div className="chart">
            <Line data={corrData} />
          </div>
        </div>
      </div>
    </>
  );
}
