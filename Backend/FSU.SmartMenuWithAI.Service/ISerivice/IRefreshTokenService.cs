using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.IdentityModel.Tokens;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IRefreshTokenService
    {
        Task<RefreshTokenDTO?> GetRefreshTokenAsync(string refreshTokenValue);
        Task<RefreshTokenDTO?> CheckRefreshTokenByUserIdAsync(int userId);

        Task<bool> RemoveRefreshTokenAsync(RefreshTokenDTO refreshToken);
        TokenValidationParameters GetTokenValidationParameters();
    }
}
