using Amazon.Rekognition.Model;
using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Menu;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class SegmentAttributeService : ISegmentAttributeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SegmentAttributeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CustomerSegmentDTO> GetCusSegmentAsync(CustomerFaceRognizeDTO imageValue)
        {

            var AttributeAgeID = await _unitOfWork.AttributeRepository.GetByCondition(x => x.AttributeName.ToLower().Equals(nameof(imageValue.Age)));
            var AttributeGenderID = await _unitOfWork.AttributeRepository.GetByCondition(x => x.AttributeName.ToLower().Equals(nameof(imageValue.Gender)));
            var AttributeSessionID = await _unitOfWork.AttributeRepository.GetByCondition(x => x.AttributeName.ToLower().Equals(nameof(imageValue.Session)));
            // Lấy các SegmentID cho độ tuổi phù hợp
            if (imageValue.Age == -1 || imageValue.Gender.IsNullOrEmpty() || imageValue.Session.IsNullOrEmpty())
            {
                throw new Exception("One or more attribute types not found.");
            }
            var result = await _unitOfWork.CustomerSegmentRepository.getCusByAttribute(ageId: AttributeAgeID.AttributeId, genderId: AttributeGenderID.AttributeId, sessionId: AttributeSessionID.AttributeId, ageValue: imageValue.Age, gender: imageValue.Gender!, session: imageValue.Session!);

            var mapdto = _mapper.Map<CustomerSegmentDTO?>(result);
            return mapdto!;
        }
    }
}
