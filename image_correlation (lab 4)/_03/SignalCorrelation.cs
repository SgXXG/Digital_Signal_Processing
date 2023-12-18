using AForge.Imaging;
using System.Drawing.Imaging;
using Emgu.CV;
using Emgu.CV.CvEnum;
using Emgu.CV.Structure;

public class SignalCorrelation
{
    public double[] Correlate(double[] signalA, double[] signalB)
    {
        int n = signalA.Length;
        int m = signalB.Length;
        int maxLength = Math.Max(signalA.Length, signalB.Length);
        Array.Resize(ref signalA, maxLength);
        Array.Resize(ref signalB, maxLength);

        int resultLength = n + m - 1;
        double[] result = new double[resultLength];

        for (int i = 0; i < resultLength; i++)
        {
            result[i] = 0.0;
        }

        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < m; j++)
            {
                result[i + j] += signalA[i] * signalB[j];
            }
        }
        /*double max = result.Max();
        for (int i = 0; i < resultLength; i++)
        {
            result[i] = result[i] / max;
        }*/
        return result;
    }


    public double[] Correlate2(double[] signalA, double[] signalB)
    {
        int n = signalA.Length;
        int m = signalB.Length;
        int resultSize = n + m - 1;
        double[] result = new double[resultSize];

        for (int i = 0; i < resultSize; i++)
        {
            for (int j = 0; j < n; j++)
            {
                int indexA = i - j;
                if (indexA >= 0 && indexA < n)
                {
                    result[i] += signalA[indexA] * signalB[j];
                }
            }
        }

        return result;
    }

    public static Bitmap FindAndMarkMatches(Bitmap sourceImage, Bitmap targetImage)
    {
        ExhaustiveTemplateMatching templateMatching = new ExhaustiveTemplateMatching();

        if (targetImage.Width > sourceImage.Width || targetImage.Height > sourceImage.Height)
        {
            throw new ArgumentException("Target image size cannot be larger than source image size.");
        }
        TemplateMatch[] matches = templateMatching.ProcessImage(sourceImage, targetImage);

        Bitmap resultImage = new Bitmap(sourceImage);

        

        using (Graphics g = Graphics.FromImage(resultImage))
        {
            foreach (TemplateMatch match in matches)
            {
                Rectangle rectangle = match.Rectangle;

                rectangle.X = (int)(rectangle.X * sourceImage.Width / (float)sourceImage.Width);
                rectangle.Y = (int)(rectangle.Y * sourceImage.Height / (float)sourceImage.Height);
                rectangle.Width = (int)(rectangle.Width * sourceImage.Width / (float)sourceImage.Width);
                rectangle.Height = (int)(rectangle.Height * sourceImage.Height / (float)sourceImage.Height);

                g.DrawRectangle(Pens.Red, rectangle);
            }
        }

        return resultImage;
    }


    public static Bitmap FindAndMarkMatchesParalell(Bitmap sourceImage, Bitmap targetImage)
    {
        ExhaustiveTemplateMatching templateMatching = new ExhaustiveTemplateMatching();

        if (targetImage.Width > sourceImage.Width || targetImage.Height > sourceImage.Height)
        {
            throw new ArgumentException("Target image size cannot be larger than source image size.");
        }
        TemplateMatch[] matches = templateMatching.ProcessImage(sourceImage, targetImage);

        Bitmap resultImage = new Bitmap(sourceImage);

        Parallel.ForEach(matches, match =>
        {
            Rectangle rectangle = match.Rectangle;

            rectangle.X = (int)(rectangle.X * sourceImage.Width / (float)sourceImage.Width);
            rectangle.Y = (int)(rectangle.Y * sourceImage.Height / (float)sourceImage.Height);
            rectangle.Width = (int)(rectangle.Width * sourceImage.Width / (float)sourceImage.Width);
            rectangle.Height = (int)(rectangle.Height * sourceImage.Height / (float)sourceImage.Height);

            using (Graphics g = Graphics.FromImage(resultImage))
            {
                lock (resultImage) // Ensure thread-safe access to the result image
                {
                    g.DrawRectangle(Pens.Red, rectangle);
                }
            }
        });

        return resultImage;
    }

    public static Bitmap FindAndMarkMatchesWithCorrelation(Bitmap sourceImage, Bitmap targetImage)
    {
        ExhaustiveTemplateMatching templateMatching = new ExhaustiveTemplateMatching();
        TemplateMatch[] matches = templateMatching.ProcessImage(sourceImage, targetImage);

        Image<Bgr, byte> sourceEmguImage = new Image<Bgr, byte>(sourceImage);
        Image<Bgr, byte> targetEmguImage = new Image<Bgr, byte>(targetImage);

        Image<Gray, float> correlationMap = sourceEmguImage.MatchTemplate(targetEmguImage, TemplateMatchingType.CcorrNormed);

        Bitmap resultImage = new Bitmap(sourceImage);


        using (Graphics g = Graphics.FromImage(resultImage))
        {
            // Отрисовка карты корреляции с прозрачностью
            using (ImageAttributes attributes = new ImageAttributes())
            {
                ColorMap[] colorMap = new ColorMap[1];
                colorMap[0] = new ColorMap();
                colorMap[0].OldColor = Color.Black;
                colorMap[0].NewColor = Color.FromArgb(128, Color.White);
                attributes.SetRemapTable(colorMap);

                Rectangle destRect = new Rectangle(0, 0, correlationMap.Width, correlationMap.Height);
                g.DrawImage(correlationMap.Bitmap, destRect, 0, 0, correlationMap.Width, correlationMap.Height, GraphicsUnit.Pixel, attributes);
            }
        }

        return resultImage;
    }

    public static Bitmap CreateCorrelationMapBitmap(double[,] correlationMap)
    {
        int width = correlationMap.GetLength(0);
        int height = correlationMap.GetLength(1);

        Bitmap bitmap = new Bitmap(width, height);

        double maxCorrelation = GetMaxCorrelation(correlationMap);
        double minCorrelation = GetMinCorrelation(correlationMap);

        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                double normalizedCorrelation = (correlationMap[x, y] - minCorrelation) / (maxCorrelation - minCorrelation);
                if (normalizedCorrelation < 0.5)
                    normalizedCorrelation = 0;
                int intensity = (int)(normalizedCorrelation * 255);

                Color pixelColor = Color.FromArgb(intensity, intensity, intensity);

                bitmap.SetPixel(x, y, pixelColor);
            }
        }

        return bitmap;
    }

    private static double GetMaxCorrelation(double[,] correlationMap)
    {
        int width = correlationMap.GetLength(0);
        int height = correlationMap.GetLength(1);

        double maxCorrelation = double.MinValue;

        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                double correlation = correlationMap[x, y];
                if (correlation > maxCorrelation)
                {
                    maxCorrelation = correlation;
                }
            }
        }

        return maxCorrelation;
    }

    private static double GetMinCorrelation(double[,] correlationMap)
    {
        int width = correlationMap.GetLength(0);
        int height = correlationMap.GetLength(1);

        double minCorrelation = double.MaxValue;

        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                double correlation = correlationMap[x, y];
                if (correlation < minCorrelation)
                {
                    minCorrelation = correlation;
                }
            }
        }

        return minCorrelation;
    }
}

