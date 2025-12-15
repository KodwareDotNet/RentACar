using ApplicationLogging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace TMS
{
    public class LoggingUtility
    {
        public static RentACar.Logging.ILoggerService? _logService;
        public static void LogInformation(string message, params object[] obj)
        {
            _logService?.LogInformation(message, obj);
        }
        public static void LogWarning(string emailSubject, string emailBody, string messageFormat, params object[] obj)
        {
            _logService?.LogWarning(emailSubject, emailBody, messageFormat, obj);
        }
        public static void LogError(string message, Exception ex, string messageFormat, params object[] obj)
        {
            _logService?.LogError(ex, message, obj);
        }
    }
}