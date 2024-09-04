using System;
using System.Text.Json;
namespace FSU.SmartMenuWithAI.API.Payloads.Responses
{
    public class KebabCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return ToKebabCase(name);
        }

        private static string ToKebabCase(string str)
        {
            if (string.IsNullOrEmpty(str))
                return str;

            // Convert PascalCase or camelCase to kebab-case
            var kebabCase = System.Text.RegularExpressions.Regex.Replace(
                str,
                "(?<!^)([A-Z])",
                "-$1",
                System.Text.RegularExpressions.RegexOptions.Compiled
            ).ToLower();

            return kebabCase;
        }
    }
}
