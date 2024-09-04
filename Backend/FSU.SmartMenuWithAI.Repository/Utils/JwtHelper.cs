
using FSU.SmartMenuWithAI.Repository.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FSU.SmartMenuWithAI.Repository.Utils
{
    public class JwtHelper
    {

        public static async Task<Token> GenerateAccessTokenAsync(AppUser user, SmartMenuContext _context, IConfiguration _configuration)
        {
            var authClaims = new List<Claim>
            {
                new Claim("UserCode", user.UserCode.ToString()),
                //new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var userWithRole = await _context.AppUsers
                                     .Include(u => u.Role)
                                     .FirstOrDefaultAsync(u => u.UserId == user.UserId);

            if (userWithRole == null || userWithRole.Role == null)
            {
                throw new Exception("User or role not found.");
            }

            authClaims.Add(new Claim(ClaimTypes.Role, userWithRole.Role.RoleName.ToString()));


            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddMinutes(30),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
            );

            var accesstoken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                RefreshTokenCode = Guid.NewGuid().ToString(),
                UserId = user.UserId,
                RefreshTokenValue = refreshToken,
                JwtId = token.Id,
                IsUsed = false,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
            };
            await _context.AddAsync(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new Token
            {
                AccessToken = accesstoken,
                RefreshToken = refreshToken
            };
        }

        private static string GenerateRefreshToken()
        {
            var random = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(random);
                return Convert.ToBase64String(random);
            }
        }


    }
}
