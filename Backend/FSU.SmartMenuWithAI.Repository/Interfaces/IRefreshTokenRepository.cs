using FSU.SmartMenuWithAI.Repository.Entities;
using Microsoft.IdentityModel.Tokens;

namespace FSU.SmartMenuWithAI.Repository.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetRefreshTokenAsync(string refreshTokenValue);
        Task<RefreshToken?> CheckRefreshTokenByUserIdAsync(int userId);

        Task<bool> RemoveRefreshTokenAsync(RefreshToken refreshToken);
        TokenValidationParameters GetTokenValidationParameters();
    }
}
