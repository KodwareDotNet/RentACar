using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.ViewModel;

namespace RentACar.Repository
{
    public class AttachmentRepository : BaseRepository, IAttachmentRepository
    {
        public AttachmentRepository(IDbConnection connection) : base(connection) { }

        public long CreateAttachment(string? filePath, string? name, AttachmentType? attachmentType)
        {
            var parameters = new
            {
                pFileName = name,
                pFilePath = filePath,
                pAttachmentType = attachmentType
            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            var response = ExecuteAsync("uspCreateAttachment", para, CommandType.StoredProcedure).Result;
            var id = para.Get<long>("@pReturnId");
            return id;
        }


        public long CreateNewsAttachment(long newsId, long attachmentId)
        {
            var parameters = new
            {
                pNewsId = newsId,
                pAttachmentId = attachmentId,
            };
            DynamicParameters para = new DynamicParameters(parameters);
            var response = ExecuteAsync("uspCreateNewsAttachment", para, CommandType.StoredProcedure).Result;
            return 1;
        }

        public long DeleteNewsAttachment(long newsId, int attachmentId)
        {
            var parameters = new
            {
                pNewsId = newsId,
                pAttachmentId = attachmentId,

            };
            DynamicParameters para = new DynamicParameters(parameters);
            var response = ExecuteAsync("uspDeleteNewsAttachment", para, CommandType.StoredProcedure).Result;
            return 1;
        }
    }
}
