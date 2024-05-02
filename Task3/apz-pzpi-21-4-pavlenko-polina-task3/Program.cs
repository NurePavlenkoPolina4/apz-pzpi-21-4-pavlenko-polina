using shelfy;
using System;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        bool exit = false;

        while (!exit)
        {
            try
            {
                var user = await AuthenticateUserAsync();

                var bookInfo = await AddBookToShelfAsync(user);
                if (bookInfo == null)
                    return;

                DisplayBookAddedConfirmation(bookInfo);

                Console.WriteLine("Do you want to add another book? (yes/no)");
                string response = Console.ReadLine();
                if (response.ToLower() != "yes")
                    exit = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
    }

    static async Task<User?> AuthenticateUserAsync()
    {
        while (true)
        {
            Console.WriteLine("Please provide your email:");
            string email = Console.ReadLine();

            Console.WriteLine("Please provide your password:");
            string password = Console.ReadLine();

            var authenticationService = new AuthenticationService();
            var authResponse = await authenticationService.AuthenticateUserAsync(email, password);

            var user = ParseAuthResponse(authResponse);
            if (user != null)
                return user;

            Console.WriteLine("Do you want to try again? (yes/no)");
            string response = Console.ReadLine();
            if (response.ToLower() != "yes")
                return null;
        }
    }

    static async Task<BookInfo?> AddBookToShelfAsync(User user)
    {
        while (true)
        {
            Console.WriteLine("Please provide the full path to the image file containing the barcode:");
            string imagePath = Console.ReadLine();

            var barcodeReader = new BarcodeReaderService();
            string isbn = barcodeReader.ReadBarcode(imagePath);

            if (isbn == null)
            {
                Console.WriteLine("Unable to read ISBN from the provided image. Do you want to try again? (yes/no)");
                string response = Console.ReadLine();
                if (response.ToLower() != "yes")
                    return null;

                continue;
            }

            var shelfService = new ShelfService();
            var shelfResponse = await shelfService.AddBookToShelfAsync(isbn, user.JwtToken);

            var bookInfo = ParseShelfResponse(shelfResponse);
            if (bookInfo != null)
                return bookInfo;

            Console.WriteLine("Do you want to try again? (yes/no)");
            string retryResponse = Console.ReadLine();
            if (retryResponse.ToLower() != "yes")
                return null;
        }
    }


    static User? ParseAuthResponse(string authResponse)
    {
        using (JsonDocument document = JsonDocument.Parse(authResponse))
        {
            var root = document.RootElement;

            if (!root.TryGetProperty("status", out var statusElement))
            {
                Console.WriteLine("Invalid response from server.");
                return null;
            }

            if (statusElement.GetString() == "fail")
            {
                string errorMessage = root.GetProperty("message").GetString();
                Console.WriteLine($"Authentication failed: {errorMessage}");
                return null;
            }

            string jwtToken = root.GetProperty("token").GetString();
            string userName = root.GetProperty("data").GetProperty("user").GetProperty("name").GetString();

            Console.WriteLine($"Hello, {userName}! Authentication successful!");
            return new User { JwtToken = jwtToken };
        }
    }

    static BookInfo? ParseShelfResponse(string shelfResponse)
    {
        using (JsonDocument document = JsonDocument.Parse(shelfResponse))
        {
            var root = document.RootElement;

            if (!root.TryGetProperty("status", out var statusElement))
            {
                Console.WriteLine("Invalid response from server.");
                return null;
            }

            if (statusElement.GetString() == "fail")
            {
                string errorMessage = root.GetProperty("message").GetString();
                Console.WriteLine($"Error adding book: {errorMessage}");
                return null;
            }

            string title = root.GetProperty("data").GetProperty("book").GetProperty("title").GetString();
            string author = root.GetProperty("data").GetProperty("book").GetProperty("author").GetString();
            string despription = root.GetProperty("data").GetProperty("book").GetProperty("description").GetString();

            return new BookInfo { Title = title, Author = author, Description = despription };
        }
    }

    static void DisplayBookAddedConfirmation(BookInfo bookInfo)
    {
        Console.WriteLine($"Congratulations! Book was successfully added to your shelf!");
        Console.WriteLine($"Book Information:");
        Console.WriteLine($"Title: {bookInfo.Title}");
        Console.WriteLine($"Author: {bookInfo.Author}");
        Console.WriteLine($"Description: {bookInfo.Description}");

    }
}

class User
{
    public string JwtToken { get; set; }
}

class BookInfo
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
}
