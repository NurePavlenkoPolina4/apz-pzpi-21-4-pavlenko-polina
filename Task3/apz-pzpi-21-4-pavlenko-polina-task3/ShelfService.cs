using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace shelfy
{
    public class ShelfService
    {
        private readonly string _baseUrl = "http://127.0.0.1:3001/api/v1/shelf";

        public async Task<string?> AddBookToShelfAsync(string isbn, string jwtToken)
        {
            try
            {
                // Create HTTP client
                using (var client = new HttpClient())
                {
                    // Create request data
                    var requestData = new
                    {
                        isbn = isbn
                    };
                    var jsonRequestData = JsonSerializer.Serialize(requestData);
                    var requestContent = new StringContent(jsonRequestData, Encoding.UTF8, "application/json");

                    // Add JWT token as authorization header
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);

                    // Send POST request to shelf endpoint
                    var response = await client.PostAsync(_baseUrl, requestContent);

                    // Read response content
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return jsonResponse;
                    
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"ERROR: HTTP request failed: {ex.Message}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return null;
            }
        }
    }
}
