using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Utils
{
    public class CodeHelper
    {
        private static Random random = new Random();

        public static string GenerateCode()
        {
            // Lấy thời gian hiện tại
            var dateTimePart = DateTime.Now.ToString("yyyyddMMHHmmss").Substring(5,9);

            // Tạo phần ngẫu nhiên
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var randomPart = new string(Enumerable.Repeat(chars, 4)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            // Kết hợp GUID để tăng độ phức tạp
            var guidPart = Guid.NewGuid().ToString().ToUpper().Replace("-", "").Substring(0, 4);

            // Kết hợp tất cả
            var productCode = randomPart + dateTimePart +  guidPart;

            return productCode;
        }
    }
}
