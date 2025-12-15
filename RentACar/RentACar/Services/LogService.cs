using Serilog;
using Serilog.Formatting.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using Serilog.Sinks.File;
using System.Threading.Tasks;
using ILogger = Serilog.ILogger;
namespace ApplicationLogging
{
    public interface ILogService_delete
    {
        void LogInformation(string message, params object[] obj);
        void LogWarning(string message, params object[] obj);
        void LogError(Exception ex, string message, params object[] obj);
    }
    public class LogService_delete : ILogService_delete
    {
        private readonly ILogger _logger;
        public LogService_delete(IConfiguration config)
        {
            string path = config.GetValue<string>("LogFilePath:Path");
            _logger = new LoggerConfiguration()
                .WriteTo.File(
                    formatter: new JsonFormatter(),
                    path: path,                          // MUST be named
                    rollingInterval: RollingInterval.Hour
                )
                .CreateLogger();
        }
        public void LogInformation(string message, params object[] obj)
        {
            _logger.Information(message, obj);
        }
        public void LogWarning(string message, params object[] obj)
        {
            _logger.Warning(message, obj);
        }
        public void LogError(Exception ex, string message, params object[] obj)
        {
            _logger.Error(ex, message, obj);
        }
    }
}