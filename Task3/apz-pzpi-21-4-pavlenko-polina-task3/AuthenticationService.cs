using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace shelfy
{
    public class AuthenticationService
    {
        private readonly string _baseUrl = "http://127.0.0.1:3001/api/v1/users/login";

        public async Task<string?> AuthenticateUserAsync(string email, string password)
        {
            try
            {
                // Create HTTP client
                using (var client = new HttpClient())
                {
                    // Create request data
                    var requestData = new
                    {
                        email = email,
                        password = password
                    };
                    var jsonRequestData = JsonSerializer.Serialize(requestData);
                    var requestContent = new StringContent(jsonRequestData, Encoding.UTF8, "application/json");

                    // Send POST request to login endpoint
                    var response = await client.PostAsync(_baseUrl, requestContent);
                    // Read response content
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                     return (jsonResponse);                        
                    

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
