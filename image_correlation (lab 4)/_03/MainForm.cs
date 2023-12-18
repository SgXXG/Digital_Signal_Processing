using Emgu.CV.CvEnum;
using Emgu.CV.Structure;
using Emgu.CV;
using Mat = Emgu.CV.Mat;
using System.Windows.Forms;

namespace _03
{
    public partial class MainForm : Form
    {

        public Bitmap BmpMain;
        public Bitmap BmpSearch;
        public byte[] grayscaleMain;
        public byte[] grayscaleSearch;
        int[][] weightMatrix;
        string[] selectedFiles;
        double koeff = 0.7;
        int kernel = 3;
        Bitmap[] bitmap = new Bitmap[2];
        Bitmap cherniy, norm;
        public MainForm()
        {
            InitializeComponent();
        }

        public Bitmap FindSimilarites(Bitmap sourceImage, Bitmap targetImage)
        {
            Mat sourceMat = new Image<Gray, byte>(sourceImage).Mat;
            Mat targetMat = new Image<Gray, byte>(targetImage).Mat;

            Mat result = new Mat();
            CvInvoke.MatchTemplate(sourceMat, targetMat, result, TemplateMatchingType.CcoeffNormed);

            double minVal = 0, maxVal = 0;
            System.Drawing.Point minLoc = new System.Drawing.Point(), maxLoc = new System.Drawing.Point();
            CvInvoke.MinMaxLoc(result, ref minVal, ref maxVal, ref minLoc, ref maxLoc);

            Rectangle bestMatchRect = new Rectangle(maxLoc, targetImage.Size);
            CvInvoke.Rectangle(sourceMat, bestMatchRect, new MCvScalar(255), 2);

            Bitmap correlationMap = sourceMat.ToImage<Gray, byte>().Bitmap;

            //Image<Bgr, byte> colorImage = sourceMat.ToImage<Bgr, byte>();

            return correlationMap;
        }


        public Bitmap CalculateCorrelationMap(Bitmap sourceImage, Bitmap targetImage)
        {
            Image<Gray, float> image1 = new Image<Gray, float>(sourceImage);
            Image<Gray, float> image2 = new Image<Gray, float>(targetImage);

            Image<Gray, float> correlationMap = image1.MatchTemplate(image2, TemplateMatchingType.CcorrNormed);
            CvInvoke.Normalize(correlationMap, correlationMap, 0, 1, NormType.MinMax, DepthType.Cv32F);
            for (int i = 0; i < correlationMap.Rows; i++)
            {
                for (int j = 0; j < correlationMap.Cols; j++)
                {
                    if (correlationMap[i, j].Intensity < koeff)
                    {
                        correlationMap[i, j] = new Gray(0);
                    }
                }
            }

            correlationMap._Mul(255);

            Bitmap correlationBitmap = correlationMap.Bitmap;

            return correlationBitmap;
        }


        private void LoadButton_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Image Files(*.jpg; *.jpeg; *.gif; *.bmp; *.png)|*.jpg; *.jpeg; *.gif; *.bmp; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                BmpMain = new Bitmap(ofd.FileName);
               
                DrawBoxMain.Image = BmpMain;
          
            }
        }

        private void LoadSearchButton_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Image Files(*.jpg; *.jpeg; *.gif; *.bmp; *.png)|*.jpg; *.jpeg; *.gif; *.bmp; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                BmpSearch = new Bitmap(ofd.FileName);
                DrawBoxSearch.Image = BmpSearch;
               
            }
        }

        private void SearchButton_Click(object sender, EventArgs e)
        {
            norm = FindSimilarites(BmpMain, BmpSearch);
            cherniy = CalculateCorrelationMap(BmpMain, BmpSearch);
            DrawBoxResult.Image = norm;
        }


        private void LoadMainButton_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Image Files(*.jpg; *.jpeg; *.gif; *.bmp; *.png)|*.jpg; *.jpeg; *.gif; *.bmp; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                BmpMain = new Bitmap(ofd.FileName);

                DrawBoxMain.Image = BmpMain;

            }
        }

        private void LoadSearchButton_Click_1(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Image Files(*.jpg; *.jpeg; *.gif; *.bmp; *.png)|*.jpg; *.jpeg; *.gif; *.bmp; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                BmpSearch = new Bitmap(ofd.FileName);

                DrawBoxSearch.Image = BmpSearch;

            }
        }

        private void SearchButton_Click_1(object sender, EventArgs e)
        {
            norm = FindSimilarites(BmpMain, BmpSearch);
            cherniy = CalculateCorrelationMap(BmpMain, BmpSearch);
            DrawBoxResult.Image = norm;
        }
    }
}