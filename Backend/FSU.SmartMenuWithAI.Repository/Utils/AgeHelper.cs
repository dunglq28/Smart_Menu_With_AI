using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Utils
{
    public class AgeHelper
    {
        public static int CalAverageAge(int AgeFrom, int AgeTo)
        {
            
            double average = (AgeFrom + AgeTo) / 2.0; 
            int roundedAverage = (int)Math.Round(average, MidpointRounding.AwayFromZero);

            return roundedAverage;
        }
        public static bool IsAgeInRange(int age, string ageRange)
        {
            var parts = ageRange.Split('-');
            if (parts.Length == 2 && int.TryParse(parts[0], out int minAge) && int.TryParse(parts[1], out int maxAge))
            {
                return age >= minAge && age <= maxAge;
            }
            return false;
        }

    }
}
