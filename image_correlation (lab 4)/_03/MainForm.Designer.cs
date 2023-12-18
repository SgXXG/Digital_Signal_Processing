namespace _03
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.DrawBoxMain = new System.Windows.Forms.PictureBox();
            this.LoadMainButton = new System.Windows.Forms.Button();
            this.DrawBoxSearch = new System.Windows.Forms.PictureBox();
            this.Main = new System.Windows.Forms.Label();
            this.LoadSearchButton = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.SearchButton = new System.Windows.Forms.Button();
            this.DrawBoxResult = new System.Windows.Forms.PictureBox();
            this.label2 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxMain)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxSearch)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxResult)).BeginInit();
            this.SuspendLayout();
            // 
            // DrawBoxMain
            // 
            this.DrawBoxMain.Location = new System.Drawing.Point(89, 196);
            this.DrawBoxMain.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.DrawBoxMain.Name = "DrawBoxMain";
            this.DrawBoxMain.Size = new System.Drawing.Size(255, 332);
            this.DrawBoxMain.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.DrawBoxMain.TabIndex = 0;
            this.DrawBoxMain.TabStop = false;
            // 
            // LoadMainButton
            // 
            this.LoadMainButton.BackColor = System.Drawing.SystemColors.MenuHighlight;
            this.LoadMainButton.Font = new System.Drawing.Font("Segoe UI", 13F);
            this.LoadMainButton.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.LoadMainButton.Location = new System.Drawing.Point(123, 107);
            this.LoadMainButton.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.LoadMainButton.Name = "LoadMainButton";
            this.LoadMainButton.Size = new System.Drawing.Size(174, 33);
            this.LoadMainButton.TabIndex = 1;
            this.LoadMainButton.Text = "Выбрать файл ...";
            this.LoadMainButton.UseVisualStyleBackColor = false;
            this.LoadMainButton.Click += new System.EventHandler(this.LoadMainButton_Click);
            // 
            // DrawBoxSearch
            // 
            this.DrawBoxSearch.Location = new System.Drawing.Point(454, 196);
            this.DrawBoxSearch.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.DrawBoxSearch.Name = "DrawBoxSearch";
            this.DrawBoxSearch.Size = new System.Drawing.Size(255, 332);
            this.DrawBoxSearch.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.DrawBoxSearch.TabIndex = 2;
            this.DrawBoxSearch.TabStop = false;
            // 
            // Main
            // 
            this.Main.AutoSize = true;
            this.Main.Font = new System.Drawing.Font("Segoe UI Semibold", 15.75F, System.Drawing.FontStyle.Bold);
            this.Main.Location = new System.Drawing.Point(104, 55);
            this.Main.Name = "Main";
            this.Main.Size = new System.Drawing.Size(263, 30);
            this.Main.TabIndex = 3;
            this.Main.Text = "Начальное изображение";
            // 
            // LoadSearchButton
            // 
            this.LoadSearchButton.BackColor = System.Drawing.SystemColors.MenuHighlight;
            this.LoadSearchButton.Font = new System.Drawing.Font("Segoe UI", 13F);
            this.LoadSearchButton.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.LoadSearchButton.Location = new System.Drawing.Point(487, 107);
            this.LoadSearchButton.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.LoadSearchButton.Name = "LoadSearchButton";
            this.LoadSearchButton.Size = new System.Drawing.Size(174, 33);
            this.LoadSearchButton.TabIndex = 4;
            this.LoadSearchButton.Text = "Выбрать файл...";
            this.LoadSearchButton.UseVisualStyleBackColor = false;
            this.LoadSearchButton.Click += new System.EventHandler(this.LoadSearchButton_Click_1);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Segoe UI Semibold", 15.75F, System.Drawing.FontStyle.Bold);
            this.label1.Location = new System.Drawing.Point(454, 55);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(269, 30);
            this.label1.TabIndex = 5;
            this.label1.Text = "Изображение для поиска";
            // 
            // SearchButton
            // 
            this.SearchButton.BackColor = System.Drawing.SystemColors.MenuHighlight;
            this.SearchButton.Font = new System.Drawing.Font("Segoe UI", 13F);
            this.SearchButton.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.SearchButton.Location = new System.Drawing.Point(299, 599);
            this.SearchButton.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.SearchButton.Name = "SearchButton";
            this.SearchButton.Size = new System.Drawing.Size(201, 35);
            this.SearchButton.TabIndex = 6;
            this.SearchButton.Text = "Поиск фрагмента";
            this.SearchButton.UseVisualStyleBackColor = false;
            this.SearchButton.Click += new System.EventHandler(this.SearchButton_Click_1);
            // 
            // DrawBoxResult
            // 
            this.DrawBoxResult.Location = new System.Drawing.Point(862, 196);
            this.DrawBoxResult.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.DrawBoxResult.Name = "DrawBoxResult";
            this.DrawBoxResult.Size = new System.Drawing.Size(255, 332);
            this.DrawBoxResult.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.DrawBoxResult.TabIndex = 7;
            this.DrawBoxResult.TabStop = false;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Segoe UI Semibold", 15.75F, System.Drawing.FontStyle.Bold);
            this.label2.Location = new System.Drawing.Point(872, 55);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(250, 30);
            this.label2.TabIndex = 8;
            this.label2.Text = "Итоговое изображение";
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.ClientSize = new System.Drawing.Size(1240, 686);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.DrawBoxResult);
            this.Controls.Add(this.SearchButton);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.LoadSearchButton);
            this.Controls.Add(this.Main);
            this.Controls.Add(this.DrawBoxSearch);
            this.Controls.Add(this.LoadMainButton);
            this.Controls.Add(this.DrawBoxMain);
            this.Margin = new System.Windows.Forms.Padding(3, 2, 3, 2);
            this.Name = "MainForm";
            this.Text = "lab4";
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxMain)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxSearch)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.DrawBoxResult)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private PictureBox DrawBoxMain;
        private Button LoadMainButton;
        private PictureBox DrawBoxSearch;
        private Label Main;
        private Button LoadSearchButton;
        private Label label1;
        private Button SearchButton;
        private PictureBox DrawBoxResult;
        private Label label2;
    }
}