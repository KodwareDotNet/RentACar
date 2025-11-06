namespace RentACar.Utilities
{
    public static class Utilities
    {
        public static void SaveFile(IFormFile file, string path)
        {
            if (file.Length > 0)
            {
                using (Stream fileStream = new FileStream(path, FileMode.Create, FileAccess.Write))
                {
                    file.CopyTo(fileStream);
                }
            }
        }
    }

}