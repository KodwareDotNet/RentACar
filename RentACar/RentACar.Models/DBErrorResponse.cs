using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace RentACar.Models
{
    public class DBErrorResponse
    {
        public long Id { get; set; }
        public string? ConflictingTermName { get; set; }
        public DBErrorResponseMessage RequestStatus { get; set; }
        public long AvailableQuestions { get; set; }
        public object Message { get; set; }
        public List<long>? Ids { get; set; } = new();
    }
    public enum DBErrorResponseMessage
    {
        Error = -1,
        None = 0,
        Success = 1,
        AlreadyInUse = 2,
        Duplicate = 3,
        ErrorInPrivateSession = 4,
        CoursePaidLog = 5,
        ErrorInGeneratClassSession = 6,
        SessionDate = 7,
        AnyQestionNotApproved = 8,
        GeneralError = 9,
        DateTimeConflict = 10,
        NotAvailable = 11,
        NoTaskLevel = 13,
        AlreadyUsedTheCode = 12,
        CodeNotExist = 14,
        CannotUsedThereOnCode = 16,
        RecordalreadyExist = 17,
        Conflictdaytime = 18
    }
}