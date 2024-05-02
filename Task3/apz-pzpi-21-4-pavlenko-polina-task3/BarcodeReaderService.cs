using System;
using System.Drawing;
using ZXing;
using ZXing.Windows.Compatibility;

namespace shelfy
{
    public class BarcodeReaderService
    {
        public string ReadBarcode(string imagePath)
        {
            try
            {
                // Check if the image path is provided
                if (string.IsNullOrEmpty(imagePath))
                {
                    Console.WriteLine("ERROR: Image path cannot be empty.");
                    return null;
                }

                // Check if the image file exists
                if (!System.IO.File.Exists(imagePath))
                {
                    Console.WriteLine("ERROR: Image file does not exist.");
                    return null;
                }

                // Create a barcode reader for Windows Compatibility
                var reader = new BarcodeReader();

                // Load the image
                var barcodeBitmap = new Bitmap(imagePath);

                // Convert bitmap to luminance source
                var luminanceSource = new BitmapLuminanceSource(barcodeBitmap);

                // Detect and decode the barcode inside the luminance source
                var result = reader.Decode(luminanceSource);

                // Check if a barcode was found
                if (result != null)
                {
                    // Print the ISBN if barcode is found
                    return result.Text;
                }
                else
                {
                    Console.WriteLine("ERROR: No barcode found in the provided image.");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");

                return null;
            }
        }
    }
}
