export const duplicateArray = (arr, N) => {
  const duplicatedArray = [];
  while (duplicatedArray.length < N) {
    const remainingLength = N - duplicatedArray.length;
    const elementsToCopy = Math.min(remainingLength, arr.length);
    duplicatedArray.push(...arr.slice(0, elementsToCopy));
  }
  return duplicatedArray;
};
export const getEquallySpacedPoints=(arr, N) => {
  const step = (arr.length - 1) / (N - 1);
  const result = [];

  for (let i = 0; i < N; i++) {
      const index = Math.round(i * step);
      result.push(arr[index]);
  }

  return result;
}
export const calcFourier = (points, N, trigResults) => {
  const res = {
    A: [],
    aCos: [],
    aSin: [],
    phases: [],
  };
  const n = N
  const k = points.length
  for (let j = 0; j < k; j++) {
    let cos = 0;
    let sin = 0;
    for (let i = 0; i < k; i++) {
      cos += points[i] * Math.cos((2 * Math.PI * i * j) / k);
      sin += points[i] * Math.sin((2 * Math.PI * i * j) / k);
    }

    sin *= 2 / k;
    cos *= 2 / k;

    res.aSin.push(sin);
    res.aCos.push(cos);
    res.A.push(Math.sqrt(sin * sin + cos * cos));
    res.phases.push(Math.atan2(sin, cos));
  }

  return res;
};

export const calcReverseFourier = (fourier, n, isHarmonic) => {
  const res = [];
  const k = fourier.A.length;
  const coeff = n/k;
  for (let i = 0; i < n; i++) {
    let signal = 0;

    for (let j = isHarmonic ? 0 : 1; j <k/2; j++) {
      signal +=
        fourier.A[j] * Math.cos((2*Math.PI * i * j) / n - fourier.phases[j]);
    }
    res.push(signal + (!isHarmonic ? fourier.A[0] / 2 : 0));
  }
  return res;
};

export const generatePolyharmonic = (period) => {
  const amplitudes = [1, 3, 5, 8, 10, 12, 16];
  const p = Math.PI;
  const phases = [p / 6, p / 4, p / 3, p / 2, 3 * p * 4, p];
  const res = [];
  const HARMONIC_COUNT = 30;
  for (let i = 0; i < period; i++) {
    let sum = 0;
    for (let j = 0; j < HARMONIC_COUNT; j++) {
      const indAmpl = Math.floor(amplitudes.length * Math.random());
      const indPhase = Math.floor(phases.length * Math.random());
      sum +=
        amplitudes[indAmpl] *
        Math.cos((2 * Math.PI * (j + 1) * (i + 1)) / period - phases[indPhase]);
    }
    res.push(sum);
  }
  return res;
};
