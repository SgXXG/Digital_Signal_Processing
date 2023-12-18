"use client";
import React, { useState } from "react";
import "../styles/css/Image.css";
import Header from '../Header/page'

function applyConvolutionKernel(imageData, kernel) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  const resultImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const resultData = resultImageData.data;

  const halfKernelSize = Math.floor(kernel.length / 2);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let r = 0,
      g = 0,
      b = 0;

      for (let ky = 0; ky < kernel.length; ky++) {
        for (let kx = 0; kx < kernel[ky].length; kx++) {
          const pixelX = x + kx - halfKernelSize;
          const pixelY = y + ky - halfKernelSize;

          if (
            pixelX >= 0 &&
            pixelX < canvas.width &&
            pixelY >= 0 &&
            pixelY < canvas.height
            ) {
            const index = (pixelY * canvas.width + pixelX) * 4;
            r += imageData.data[index] * kernel[ky][kx];
            g += imageData.data[index + 1] * kernel[ky][kx];
            b += imageData.data[index + 2] * kernel[ky][kx];
          }
        }
      }

      const index = (y * canvas.width + x) * 4;
      resultData[index] = Math.round(r);
      resultData[index + 1] = Math.round(g);
      resultData[index + 2] = Math.round(b);
    }
  }

  return resultImageData;
}

export default function page() {
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
      setOriginalImage(reader.result);
      setAppliedFilters([]); // Сброс примененных фильтров
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const applyConvolution = (kernel, filterName) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = selectedImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const originalImageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
        );
      const resultImageData = applyConvolutionKernel(originalImageData, kernel);

      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = img.width;
      resultCanvas.height = img.height;
      const resultCtx = resultCanvas.getContext("2d");
      resultCtx.putImageData(resultImageData, 0, 0);

      setSelectedImage(resultCanvas.toDataURL());
      setAppliedFilters([...appliedFilters, { name: filterName, matrix: kernel }]); // Сохранение примененного фильтра
    };
  };

  const clearFilters = () => {
    setSelectedImage(originalImage);
    setAppliedFilters([]);
  };

  return (
    <>
    <Header/>
    <div className="image-container">
      <input type="file" accept="image/*" onChange={handleFileInputChange} />
      <div className="images-container">
        {selectedImage && (
          <>
          <div className="image-wrapper">
            <h3>Исходное изображение</h3>
            <img
              className="image-loaded"
              src={originalImage}
              alt="Original"
            />
          </div>
          <div className="image-wrapper">
            <h3>Обработанное изображение</h3>
            <img
              className="image-after"
              src={selectedImage}
              alt="Processed"
            />
          </div>
          <div className="image-btn-container">
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [-2, -1, 0],
                    [-1, 1, 1],
                    [0, 1, 2],
                    ],
                                   "Тиснение")
                }
              >
              Тиснение
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [1/16, 1/8, 1/16],
                    [1/8, 1/4, 1/8],
                    [1/16, -1/16, 1/16],
                    ],
                                   "Размытие по Гауссу (3*3)")
                }
              >
              Размытие по Гауссу (3*3)
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [0, 0, 0],
                    [0, 4, 0],
                    [0, 0, 0],
                    ], 
                                   "Тождественное отображение")
                }
              >
              Тождественное отображение
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1],
                    ],
                                   "Фильтр Собеля (Горизонтальный)")
                }
              >
              Фильтр Собеля (Горизонтальный)
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [1, 2, 1],
                    [0, 0, 0],
                    [-1, -2, -1],
                    ],
                                   "Фильтр Собеля (Вертикальный) ")
                }
              >
              Фильтр Собеля (Вертикальный)
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [0, -1, 0],
                    [-1, 5, -1],
                    [0, -1, 0],
                    ],
                                   "Резкость (3*3)")
                }
              >
              Резкость (3*3)
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, -1],
                    ],
                                   "Фильтр рельфа")
                }
              >
              Фильтр рельефа
            </button>
            <button
              className="btn"
              onClick={() =>
                  applyConvolution([
                    [0, -1, 0],
                    [-1, 4, -1],
                    [0, -1, 0],
                    ],
                                   "Фильтр узоров и текстур")
                }
              >
              Фильтр узоров и текстур
            </button>
            <button onClick={clearFilters}>Очистить фильтр</button>
          </div>
          </>
          )}
        <div className="applied-filters">
          <h3>Применённый фильтр</h3>
          <ul>
            {appliedFilters.map((filter, index) => (
              <li key={index}>
                <strong>{filter.name}</strong>
                <br />
                <ul>
                  {filter.matrix.map((row, rowIndex) => (
                    <li key={rowIndex}>{row.join(', ')}</li>
                    ))}
                </ul>
              </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
    </>

    );
}