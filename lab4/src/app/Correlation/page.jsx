/* eslint-disable react/react-in-jsx-scope */
'use client'
import { useMemo, useState,useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { compiler } from '../../../next.config'
import Header from '../Header/page'
import {
  calcFourier,
  calcReverseFourier,
  getData,
  medianaAveraging,
  setParabolaFilter,
  setSlidingAverageFilter,
  Correlate
} from '../shared/utility'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
Chart.register(CategoryScale)

export default function Correlation () {
  const [A1, setA1] = useState(1)
  const [A2, setA2] = useState(1)

  const [f1, setF1] = useState(1)
  const [f2, setF2] = useState(1)

  const [f01, setF01] = useState(0)
  const [f02, setF02] = useState(0)

  const [N, setN] = useState(200)
  const [k, setK] = useState(128)

  const [T1, setT1] = useState(0.3)
  const [T2, setT2] = useState(0.3)

  const [dc1, setDc1] = useState(0.5)
  const [dc2, setDc2] = useState(0.5)

  const [selectedFirstSignal, setSelectedFirstSignal] = useState('sinus')
  const [selectedSecondSignal, setSelectedSecondSignal] = useState('sinus')

  const [firstSignalData, setFirstSignalData] = useState([]);
  const [secondSignalData, setSecondSignalData] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [kpoints, setKPoints] = useState([]);
  const [fourier, setFourier] = useState({});
  const [reversePoints, setReversedFourier] = useState([]);

  const [filteredTimeData, setFilteredTimeData] = useState([])
  const [filteredFreqData, setFilteredFreqData] = useState([])
  const [filteredReverseFourier, setFilteredReverseFourier] = useState([])


  useEffect(() => {
    const firstSignal = calcFirstSignal;
    const secondSignal = calcSecondSignal;
    const correlation = Correlate(firstSignal, secondSignal) 
    
    setFirstSignalData(firstSignal);
    setSecondSignalData(secondSignal);
    setCorrelationData(correlation)
    console.log(correlation)
  }, [N, A1, A2, f1, f2, f01, f02, k, T1,T2,dc1,dc2]);


  const harmonicSum = useMemo(() => {
    const dataArr = []
    for (let i = 0; i < N; i++) {
      const value = A1 * Math.sin(2 * i / N * Math.PI * f1 + f01) +
      A2 * Math.sin(2 * i / N * Math.PI * f2 + f02)
      dataArr.push(value)
    }
    return dataArr
  }, [N, A1, A2, f1, f2, f01, f02])


  const getRandom = (min, max) => {
    return Math.random()*(max - min +1) + min
  }

  const calcFirstSignal = useMemo(() => {
    const dataArr = []
    switch (selectedFirstSignal) {
      case 'sinus': {
        for (let i = 0; i < N; i++) {
          const value = A1 * Math.sin((2 * Math.PI * f1 * i / N) + f01)
          dataArr.push(value)
        }
        return dataArr
      }
      case 'triangle': {
        for (let i = 0; i < N; i++) {
          const value =
            ((2 * A1) / Math.PI) *
            Math.asin(Math.sin((2 * Math.PI * f1 * i) / N + f01));
          dataArr.push(value);
        }
        return dataArr;
      }
      case 'rectangle': {
        for (let i = 0; i < N; i++) {
          const value = ((i / N) % T1) / T1< dc1 ? A1 : -A1
          dataArr.push(value)
        }
        return dataArr
      }
      case 'saw': {
        for (let i = 0; i < N; i++) {
          const value =
            ((-2 * A1) / Math.PI) *
            1 *
            Math.atan(1 / Math.tan((Math.PI * f1 * i) / N + f01));
          dataArr.push(value);
        }
        return dataArr;
      }
      case 'whitenoise': {
        for (let i = 0; i < N; i++) {
          const value = A1 * (getRandom(0.01, 0.02));
          dataArr.push(value);
        }
        return dataArr;
      }
      default: {
        return []
      }
    }
  }, [N, A1, f1, f01, T1, dc1, k])

  const calcSecondSignal = useMemo(() => {
    const dataArr = []
    switch (selectedSecondSignal) {
      case 'sinus': {
        for (let i = 0; i < N; i++) {
          const value = A2 * Math.sin((2 * Math.PI * f2 * i / N) + f02)
          dataArr.push(value)
        }
        return dataArr
      }
      case 'triangle': {
        for (let i = 0; i < N; i++) {
          const value =
            ((2 * A2) / Math.PI) *
            Math.asin(Math.sin((2 * Math.PI * f2 * i) / N + f02));
          dataArr.push(value);
        }
        return dataArr;
      }
      case 'rectangle': {
        for (let i = 0; i < N; i++) {
          const value = ((i / N) % T2) / T2< dc2 ? A2 : -A2
          dataArr.push(value)
        }
        return dataArr
      }
      case 'saw': {
        for (let i = 0; i < N; i++) {
          const value =
            ((-2 * A2) / Math.PI) *
            1 *
            Math.atan(1 / Math.tan((Math.PI * f2 * i) / N + f02));
          dataArr.push(value);
        }
        return dataArr;
      }
      case 'whitenoise': {
        for (let i = 0; i < N; i++) {
          const value = A2 * (getRandom(0.01, 0.02));
          dataArr.push(value);
        }
        return dataArr;
      }
      default: {
        return []
      }
    }
  }, [N, A2, f2, f02, T2, dc2, k])


  const data = {
    datasets: [
      {
        label: 'Сигнал 1',
        backgroundColor: 'rgb(221,160,221 )',
        borderColor: 'rgb( 221,160,221 )',
        data: firstSignalData ? getData(firstSignalData) : [],
        tension: 0.5
      },

      {
        label: 'Сигнал 2',
        backgroundColor: 'rgb(0,49,83)',
        borderColor: 'rgb(0,49,83)',
        data: secondSignalData ? getData(secondSignalData) : [],
        tension: 0.5
      },
    
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
              <div className="param-name">N: </div>
              <input type="range" max={2048} onChange={(e) => setN(e.target.value)} value={N} />
              <div className="param-value">{N}</div>
            </div>
            <div className='params-signal'>
              
              <p className='param-title'>Сигнал 1</p>
              <select
                className='params__select'
                value={selectedFirstSignal}
                onChange={e => setSelectedFirstSignal(e.target.value)}
                name="" id="">
                  <option value="sinus">Синусоидальный</option>
                  <option value="triangle">Треугольный</option>
                  <option value="rectangle">Прямоугольный</option>
                  <option value="saw">Пилообразный</option>
                  <option value="whitenoise">Белый шум</option>
                  <option value="polyharmonic">Полигармонический</option>
                </select>
              <div className="params-box">
                <div className="param-name">Amplitude:</div>
                <input type="range" onChange={(e) => setA1(e.target.value)} value={A1} />
                <div className="param-value">{A1}</div>
              </div>
              {
                selectedFirstSignal !== 'rectangle' && selectedFirstSignal !=="whitenoise" && 
                (
                  <>
                     <div className="params-box">
                      <div className="param-name">Frequency:</div>
                      <input type="range" onChange={(e) => setF1(e.target.value)} value={f1} />
                      <div className="param-value">{f1}</div>
                    </div>
                    <div className="params-box">
                      <div className="param-name">Phase: </div>
                      <input type="range" onChange={(e) => setF01(e.target.value)} value={f01} />
                      <div className="param-value">{f01}</div>
                    </div>
                  </>
                )
              }
              { selectedFirstSignal == "rectangle" && selectedFirstSignal !=="whitenoise" && 
              (
                <>
                  <div className="params-box">
                    <div className="param-name">T1:</div>
                    <input type="range" onChange={(e) => setT1(e.target.value)} value={T1} />
                    <div className="param-value">{T1}</div>
                  </div>
                  <div className="params-box">
                    <div className="param-name">dc1: </div>
                    <input type="range" step={0.01} max={1} onChange={(e) => setDc1(e.target.value)} value={dc1} />
                    <div className="param-value">{dc1}</div>
                  </div>
                </>
              )
              }
            </div>
            <div className="params-signal">
              <p className='param-title'>Сигнал 2</p>
              <select
                className='params__select'
                value={selectedSecondSignal}
                onChange={e => setSelectedSecondSignal(e.target.value)}
                name="" id="">
                  <option value="sinus">Синусоидальный</option>
                  <option value="triangle">Треугольный</option>
                  <option value="rectangle">Прямоугольный</option>
                  <option value="saw">Пилообразный</option>
                  <option value="whitenoise">Белый шум</option>
                  <option value="polyharmonic">Полигармонический</option>
              </select>
              <div className="params-box">
                <div className="param-name">Amplitude 2:</div>
                <input type="range" onChange={(e) => setA2(e.target.value)} value={A2} />
                <div className="param-value">{A2}</div>
              </div>
              { selectedSecondSignal !== 'rectangle' && selectedSecondSignal !=="whitenoise" && 
                (<>
                  <div className="params-box">
                    <div className="param-name">Frequency 2:</div>
                    <input type="range" onChange={(e) => setF2(e.target.value)} value={f2} />
                    <div className="param-value">{f2}</div>
                  </div>
                  <div className="params-box">
                    <div className="param-name">Phase 2: </div>
                    <input type="range" onChange={(e) => setF02(e.target.value)} value={f02} />
                    <div className="param-value">{f02}</div>
                  </div>
                </>)
              }
              { selectedSecondSignal == "rectangle" && selectedSecondSignal !== "whitenoise" && 
              (
                <>
                  <div className="params-box">
                    <div className="param-name">T2:</div>
                    <input type="range" onChange={(e) => setT2(e.target.value)} value={T2} />
                    <div className="param-value">{T2}</div>
                  </div>
                  <div className="params-box">
                    <div className="param-name">dc2: </div>
                    <input type="range" step={0.01} max={1} onChange={(e) => setDc2(e.target.value)} value={dc2} />
                    <div className="param-value">{dc2}</div>
                  </div>
                </>
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
            <Line data={corrData} />
          </div>
        </div>
      </div>
    </>
  )
}
