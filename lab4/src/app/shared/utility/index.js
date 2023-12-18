export const duplicateArray = (arr, N) => {
  const duplicatedArray = []
  while (duplicatedArray.length < N) {
    const remainingLength = N - duplicatedArray.length
    const elementsToCopy = Math.min(remainingLength, arr.length)
    duplicatedArray.push(...arr.slice(0, elementsToCopy))
  }
  return duplicatedArray
}
export const getEquallySpacedPoints = (arr, N) => {
  const step = (arr.length - 1) / (N - 1)
  const result = []

  for (let i = 0; i < N; i++) {
    const index = Math.round(i * step)
    result.push(arr[index])
  }

  return result
}

export const getData = (a, leftx = 0) => {
  const xDataset = []

  a.map((el, index) => {
    const newInd = parseInt(index) + parseInt(leftx)
    const res = { x: newInd.toString(), y: el }
    xDataset.push(res)
  })

  return xDataset
}

export const calcFourier = (points, N) => {
  const res = {
    A: [],
    aCos: [],
    aSin: [],
    phases: []
  }
  const k = points.length
  for (let j = 0; j < k; j++) {
    let cos = 0
    let sin = 0
    for (let i = 0; i < k; i++) {
      cos += points[i] * Math.cos((2 * Math.PI * i * j) / k)
      sin += points[i] * Math.sin((2 * Math.PI * i * j) / k)
    }

    sin *= 2 / k
    cos *= 2 / k

    res.aSin.push(sin)
    res.aCos.push(cos)
    res.A.push(Math.sqrt(sin * sin + cos * cos))
    res.phases.push(Math.atan2(sin, cos))
    console.log(res)
  }

  return res
}

export const calcReverseFourier = (fourier, n, isHarmonic) => {
  const res = []
  const k = fourier.A.length

  for (let i = 0; i < n; i++) {
    let signal = 0

    for (let j = isHarmonic ? 0 : 1; j < k / 2; j++) {
      signal +=
        fourier.A[j] * Math.cos((2 * Math.PI * i * j) / n - fourier.phases[j])
    }
    res.push(signal + (!isHarmonic ? fourier.A[0] / 2 : 0))
  }
  return res
}

export const generatePolyharmonic = (period) => {
  const amplitudes = [1, 3, 5, 8, 10, 12, 16]
  const p = Math.PI
  const phases = [p / 6, p / 4, p / 3, p / 2, 3 * p * 4, p]
  const res = []
  const HARMONIC_COUNT = 30
  for (let i = 0; i < period; i++) {
    let sum = 0
    for (let j = 0; j < HARMONIC_COUNT; j++) {
      const indAmpl = Math.floor(amplitudes.length * Math.random())
      const indPhase = Math.floor(phases.length * Math.random())
      sum +=
        amplitudes[indAmpl] *
        Math.cos((2 * Math.PI * (j + 1) * (i + 1)) / period - phases[indPhase])
    }
    res.push(sum)
  }
  return res
}

export const setSlidingAverageFilter = (x, K) => {
  const m = (K - 1) / 2
  console.log(K)
  console.log(x)
  const result = []
  for (let i = 0; i < x.length; i++) {
    let sum = 0
    for (let j = i - m; j <= i + m; j++) {
      if (j >= 0 && j < x.length) {
        sum += x[j]
      }
    }
    result.push(sum / K)
  }
  console.log(result)
  return result
}

export const setParabolaFilter = (x) => {
  const result = []
  for (let i = 0; i < x.length; i++) {
    const value =
      (5 * x[i - 3]
        ? x[i - 3]
        : 0 - 30 * x[i - 2]
          ? x[i - 2]
          : 0 + 75 * x[i - 1]
            ? x[i - 1]
            : 0 + 131 * x[i] + 75 * x[i + 1]
              ? x[i + 1]
              : 0 - 30 * x[i + 2]
                ? x[i + 2]
                : 0 + 5 * x[i + 3]
                  ? x[i + 3]
                  : 0) / 231
    result.push(value)
  }
  return result
}

function bubbleSort (arr) {
  let swapped
  do {
    swapped = false
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
        swapped = true
      }
    }
  } while (swapped)
  return arr
}

function modifyArray (arr, k) {
  if (k >= arr.length) {
    return new Array(arr.length).fill(0)
  }

  const result = arr.slice()
  for (let i = 0; i < k; i++) {
    result[i] = 0
    result[arr.length - 1 - i] = 0
  }

  return result
}

export const medianaAveraging = (x, k) => {
  const arr = Array.from(x)
  const sorted = bubbleSort(arr)
  const kdeleted = modifyArray(sorted, k)
  const idCenter = kdeleted / 2
  let value = 0
  for (
    let m = idCenter - (kdeleted.length - 1) / 2 + k;
    m <= idCenter + (kdeleted.length - 1) / 2 - k;
    m++
  ) {
    value += kdeleted[m]
  }
  value = value / (kdeleted.length - 2 * k)
  kdeleted[idCenter] = value
  return kdeleted
}

export const setLFF = (data, slice) => {
  const result = {
    A: [],
    aCos: [],
    aSin: [],
    phases: []
  }
  result.A = Array.from(data.A)
  result.phases = Array.from(data.phases)
  for (let i = slice; i <= data.A.length; i++) {
    result.A[i] = null
    result.phases[i] = null
  }
  return result
}

export const setHFF = (data, slice) => {
  const result = {
    A: [],
    aCos: [],
    aSin: [],
    phases: []
  }
  result.A = Array.from(data.A)
  result.phases = Array.from(data.phases)
  for (let i = 0; i <= slice; i++) {
    result.A[i] = null
    result.phases[i] = null
  }
  return result
}

export const setBandpassFilter = (data, low, high) => {
  const result = {
    A: [],
    aCos: [],
    aSin: [],
    phases: []
  }
  result.A = Array.from(data.A)
  result.phases = Array.from(data.phases)
  for (let i = high; i < data.A.length; i++) {
    result.A[i] = null
    result.phases[i] = null
  }
  for (let i = 0; i < low; i++) {
    result.A[i] = null
    result.phases[i] = null
  }
  return result
}

export const Correlate = (f, g) => {
  const n = f.length
  const m = g.length
  const K = (n + m - 1 > 0) ? n + m - 1 : 0
  console.log(K)
  let nSum = 0;
  let mSum = 0;
  console.log('k', K)
  const result = Array(K).fill(0)
  for (let i = 0; i < n; i++) {
    nSum += f[i] ** 2
    mSum += g[i] ** 2
  }
  const normalizeCoff = 1 / Math.sqrt(nSum * mSum)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      result[i + j] += f[i] * g[j] * normalizeCoff
    }
  }
  console.log('result', result)
  return result
}
