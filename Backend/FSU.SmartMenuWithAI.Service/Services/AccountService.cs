using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Token;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public AccountService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AppUserDTO> BanAccount(int id)
        {
            var checkExist = await _unitOfWork.AppUserRepository.GetByID(id);
            if (checkExist == null)
            {
                return null!;
            }
            checkExist.IsActive = false;
            _unitOfWork.AppUserRepository.Update(checkExist);
            var result = _mapper.Map<AppUserDTO>(checkExist);
            return result;
        }
        public async Task<bool> checkCorrectPassword(int id, string password)
        {
            Expression<Func<AppUser, bool>> filter = x => x.Password.Equals(PasswordHelper.ConvertToEncrypt(password)) && x.UserId == id;
            var rightPass = await _unitOfWork.AppUserRepository.GetByCondition(filter);
            if (rightPass == null)
            {
                return false;
            }
            return true;
        }

        public async Task<AppUserDTO?> CheckLoginAsync(string userName, string password)
        {
            var user = await _unitOfWork.AccountRepository
                .CheckLoginAsync(userName, password);

            var userDTO = _mapper.Map<AppUserDTO>(user);
            return userDTO;
        }

        public async Task<AppUserDTO?> CheckLoginMobileAsync(string userName, string password)
        {
            var user = await _unitOfWork.AccountRepository
                 .CheckLoginMobileAsync(userName, password);

            var userDTO = _mapper.Map<AppUserDTO>(user);
            return userDTO;
        }

        public async Task<TokenDto> GenerateAccessTokenAsync(int id)
        {
            var token = await _unitOfWork.AccountRepository.GenerateAccessTokenAsync(id);
            var tokentDTO = _mapper.Map<TokenDto>(token);
            return tokentDTO;
        }
    }
}
