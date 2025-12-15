using System;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.ViewModel;
using RentACar.Logging;
using TMS;

namespace RentACar.Controllers
{
    public abstract class TsmController : ControllerBase
    {
        ILoggerService loggerService;
        public const string CannotCreateAlreadyInUseMessage = "Cannot create {0}, its already in use.";
        public const string SomethingWrongHappenedMessage = "Cannot create {0}, Something went wrong.Please contact administrator.";
        //protected TsmController()
        //{
        //    //LocalizationSourceName = TMSConsts.LocalizationSourceName;
        //}
        protected const int SaltSize = 16; // 128 bit
        protected const int Iterations = 10000; // Number of PBKDF2 iterations
   
        public static (string Hash, string Salt) HashPassword(string password)
        {
            try
            {
                using (var rng = new RNGCryptoServiceProvider())
                {
                    byte[] salt = new byte[SaltSize];
                    rng.GetBytes(salt);
                    using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                    {
                        byte[] hash = pbkdf2.GetBytes(32); // 32 bytes is a good hash size
                        return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred in HashPassword: {ex.Message}");
                return (null, null);
            }
        }
        protected long GetCurrentUserId()
        {
            if (long.TryParse(HttpContext.Items["UserId"] as string, out long userId))
                return userId;
            else
                return -1;
        }
        protected string GetCurrentUserName()
        {
            if (HttpContext.Items["UserName"] is string userName && !string.IsNullOrWhiteSpace(userName))
            {
                return userName;
            }
            return null;
        }
       
        public static bool VerifyPassword(string password, string storedHash, string storedSalt, LoggerService loggerService)
        {
            try
            {
                byte[] salt = Convert.FromBase64String(storedSalt);
                byte[] storedHashBytes = Convert.FromBase64String(storedHash);
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                {
                    byte[] hash = pbkdf2.GetBytes(32); // 32 bytes is a good hash size
                    return storedHashBytes.SequenceEqual(hash);
                }
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in VerifyPassword");
                return false;
            }
        }
        protected long GetCurrentUserOrganizationId()
        {
            try
            {
                if (long.TryParse(HttpContext.Items["OrganizationId"] as string, out long orgId))
                    return orgId;
                else
                    return -1;
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in GetCurrentUserOrganizationId");
                return -1;
            }
        }
        protected UserType GetCurrentUserType()
        {
            try
            {
                if (HttpContext.User.Identity!.Name != null)
                {
                    UserType userType = UserType.Parse<UserType>(HttpContext.User.Identity.Name);
                    return userType;
                }
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in GetCurrentUserType");
            }
            return UserType.User;
            //var userType = HttpContext.User.Identity.Name;
            //string userType = HttpContext.Items["UserType"].ToString();
            //if (!string.IsNullOrEmpty(userType))
            //    return userType;
            //else
            //    return "";
        }
        protected long GetCurrentUserOrganizationType()
        {
            try
            {
                string orgtype = ((System.Security.Claims.ClaimsIdentity)HttpContext.User.Identity)?.Claims.FirstOrDefault(p => p.Type == "OrganizationTypeId")?.Value as string;
                if (long.TryParse(orgtype, out long orgId))
                    return orgId;
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in GetCurrentUserOrganizationType");
            }
            return 1;
        }
        protected string CurrentCulture
        {
            get
            {
                try
                {
                    return CultureInfo.CurrentUICulture.ToString().ToLower();
                }
                catch (Exception ex)
                {
                    loggerService.LogError(ex, "Error occurred in accessing CurrentCulture");
                    return "en-us";
                }
            }
        }
        protected void LogControllerInfo(string messageFormat, params object[] obj)
        {
            try
            {
                LoggingUtility.LogInformation(messageFormat, obj);
            }
            catch (Exception ex)
            {
                LogControllerErrors("LogControllerInfo has a problem", "LogControllerInfo has a problem." + Environment.NewLine + " Error: {@Error}", ex, "LogControllerInfo has a problem." + Environment.NewLine + " Error: {@Error}", ex);
            }
        }
        protected void LogControllerWarnings(string emailSubject, string emailBody, string messageFormat, params object[] obj)
        {
            try
            {
                LoggingUtility.LogWarning(emailSubject, emailBody, messageFormat, obj);
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in LogControllerWarnings");
            }
        }
        protected void LogControllerWarnings(string messageFormat, params object[] obj)
        {
            LoggingUtility.LogWarning(string.Empty, string.Empty, messageFormat, obj);
        }
        protected void LogControllerErrors(string emailSubject, string emailBody, Exception ex, string messageFormat, params object[] obj)
        {
            try
            {
                emailBody += emailBody + Environment.NewLine + Request.Headers["X-RequestId"];
                LoggingUtility.LogError(emailSubject, ex, messageFormat, obj);
            }
            catch (Exception exp)
            {
                LogErrorToEventViewer(exp);
            }
        }
        protected void LogControllerErrors(Exception ex, string messageFormat, params object[] obj)
        {
            try
            {
                LoggingUtility.LogError(null, ex, messageFormat, obj);
            }
            catch (Exception logException)
            {
                loggerService.LogError(logException, "Error occurred in LogControllerErrors");
            }
        }
        private void LogErrorToEventViewer(Exception exp)
        {
            try
            {
                string eventSource = "TMS";
                if (!EventLog.SourceExists(eventSource))
                {
                    EventLog.CreateEventSource(eventSource, "Application");
                }
                EventLog.WriteEntry(eventSource, exp.ToString(), EventLogEntryType.Error);
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error occurred in LogErrorToEventViewer");
            }
        }
    }
}
