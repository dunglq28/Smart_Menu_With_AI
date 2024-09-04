
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Utils;
using FSU.SmartMenuWithAI.Repository.Common.Enums;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class AccountRepository  : IAccountRepository
    {
        private readonly SmartMenuContext _context;
        private readonly IConfiguration _configuration;

        public AccountRepository(SmartMenuContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AppUser?> CheckLoginAsync(string userName, string password)
        {
            password = PasswordHelper.ConvertToEncrypt(password);
            var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.UserName.Equals(userName)&& u.Password == password && u.Status == (int)Status.Exist);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<AppUser?> CheckLoginMobileAsync(string userName, string password)
        {
            password = PasswordHelper.ConvertToEncrypt(password);
            var user = await _context.AppUsers
                .FirstOrDefaultAsync(u => u.UserName.Equals( userName )
                && u.Password.Equals( password )
                && u.RoleId == (int)UserRole.Store
                && u.Status == (int)Status.Exist);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<Token> GenerateAccessTokenAsync(int id)
        {
            var user = await _context.AppUsers.FindAsync(id);
            if (user == null)
            {
                return null!;
            }
            var Token = await JwtHelper.GenerateAccessTokenAsync(user, _context, _configuration);
            return Token;
        }

    }
}
