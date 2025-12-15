using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;
//using Serilog.Sinks.Debug;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Serilog.Sinks.Async;
using Serilog.Sinks.File;
using ILogger = Serilog.ILogger;

namespace RentACar.Logging
{
    public interface ILoggerService
    {
        void LogDebug(string message, params object[] propertyValues);
        void LogInformation(string message, params object[] propertyValues);
        void LogWarning(string message, params object[] propertyValues);
        void LogError(Exception ex, string message, params object[] propertyValues);
    }
    public class LoggerService : ILoggerService
    {
        private readonly ILogger _errorlogger;
        private readonly ILogger _infoLogger;
        private readonly ILogger _warningLogger;
        private readonly ILogger _debugLogger;
        public LoggerService(IConfiguration config)
        {
            string folderPath = config.GetSection("ApplicationLogging:LogFilePath").Value!;
            // error logger for all log levels except Information
            _errorlogger = new LoggerConfiguration()
                .WriteTo.Async(a => a.File(GetLogFilePath(folderPath, "Errorlog"), rollingInterval: RollingInterval.Hour, outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"))
                .MinimumLevel.Verbose()
                .Filter.ByExcluding(evt => evt.Level == LogEventLevel.Information) // Exclude Information level logs
                .CreateLogger();
            // Separate logger for information logs
            _infoLogger = new LoggerConfiguration()
                .WriteTo.Async(a => a.File(GetLogFilePath(folderPath, "info"), rollingInterval: RollingInterval.Hour, outputTemplate: "[{Timestamp:HH:mm:ss}] {Message:lj}{NewLine}{Exception}"))
                .MinimumLevel.Information()
                .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Information)
                .CreateLogger();
            _warningLogger = new LoggerConfiguration()
             .WriteTo.Async(a => a.File(GetLogFilePath(folderPath, "warning"), rollingInterval: RollingInterval.Hour, outputTemplate: "[{Timestamp:HH:mm:ss}] {Message:lj}{NewLine}{Exception}"))
             .MinimumLevel.Warning()
             .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Warning)
             .CreateLogger();
            _debugLogger = new LoggerConfiguration()
             .WriteTo.Async(a => a.File(GetLogFilePath(folderPath, "debug"), rollingInterval: RollingInterval.Hour, outputTemplate: "[{Timestamp:HH:mm:ss}] {Message:lj}{NewLine}{Exception}"))
             .MinimumLevel.Information()
             .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Information)
             .CreateLogger();
        }
        private string GetLogFilePath(string folderPath, string logType)
        {
            var fileName = $"{logType}_log_{DateTime.Now:yyyyMMdd_HH}.txt"; // Example: info_log_20220101_15.txt
            return System.IO.Path.Combine(folderPath, fileName);
        }
        public void LogWarning(string message, params object[] propertyValues)
        {
            _warningLogger.Warning(message, propertyValues);
        }
        public void LogDebug(string message, params object[] propertyValues)
        {
            _debugLogger.Debug(message, propertyValues);
        }
        public void LogInformation(string message, params object[] propertyValues)
        {
            _infoLogger.Information(message, propertyValues); // Log only to the separate info logger
        }
        public void LogError(Exception ex, string message, params object[] propertyValues)
        {
            _errorlogger.Error(ex, message, propertyValues);
        }
    }
}