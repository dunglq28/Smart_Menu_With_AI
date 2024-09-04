using FSU.SmartMenuWithAI.Service.Utils.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Utils
{
    public class SessionHelper
    {
        public static string GetSession()
        {
            var session = string.Empty;
            var thisTime = DateTime.Now.Hour;
            switch (thisTime)
            {
                case int n when (n >= 6 && n <= 12):
                    session = SessionInDay.Morning.ToString();
                    break;
                case int n when (n >= 13 && n <= 18):
                    session = SessionInDay.Afternoon.ToString();
                    break;
                case int n when (n >= 19 && n <= 23):
                    session = SessionInDay.Evening.ToString();
                    break;
                case int n when (n >= 23 && n <= 5):
                    session = SessionInDay.Evening.ToString();
                    break;
                default:
                    session = SessionInDay.Morning.ToString();
                    break;
            }
            return session;
        }
    }
}
