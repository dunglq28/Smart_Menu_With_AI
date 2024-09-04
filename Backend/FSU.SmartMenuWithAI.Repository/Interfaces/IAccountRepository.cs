

using FSU.SmartMenuWithAI.Repository.Entities;

namespace FSU.SmartMenuWithAI.Repository.Interfaces
{
    public interface IAccountRepository
    {
        Task<AppUser?> CheckLoginAsync(String userName, String password);
        Task<Token?> GenerateAccessTokenAsync(int id);
        Task<AppUser?> CheckLoginMobileAsync(String userName, String password);

    }
}
