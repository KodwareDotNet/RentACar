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

        public async Task<bool> CreateCarAttachment(long carId, int attachmentId)
        {
            var parameters = new
            {
                pCarId = carId,
                pAttachmentId = attachmentId
            };
            DynamicParameters para = new DynamicParameters(parameters);

            var rows = await _connection.ExecuteAsync(
                "uspCreateCarAttachment",
                para,
                commandType: CommandType.StoredProcedure
            );

            return rows > 0;
        }


        // Delete attachment (image) for a car
        public async Task<bool> DeleteCarAttachment(long carId, int attachmentId)
        {
            // 1️⃣ Get image path to delete file
            var image = await _connection.QueryFirstOrDefaultAsync<string>(
                "SELECT ImageUrl FROM CarAttachments WHERE Id = @Id AND CarId = @CarId",
                new { Id = attachmentId, CarId = carId }
            );

            if (!string.IsNullOrEmpty(image))
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.TrimStart('/'));
                if (File.Exists(fullPath))
                    File.Delete(fullPath);
            }

            // 2️⃣ Call SP to delete attachment
            var parameters = new
            {
                pCarId = carId,
                pAttachmentId = attachmentId
            };

            DynamicParameters para = new DynamicParameters(parameters);

            // ✅ ExecuteAsync returns number of rows affected, convert to bool
            var rows = await _connection.ExecuteAsync(
                "uspDeleteCarAttachment",
                para,
                commandType: CommandType.StoredProcedure
            );

            return rows > 0;
        }


        // Get attachments for a car
        public async Task<IEnumerable<string>> GetCarAttachments(long carId, int attachmentId)
        {
            return await _connection.QueryAsync<string>(
                "SELECT ImageUrl FROM CarAttachments WHERE CarId = @CarId AND Id = @AttachmentId",
                new { CarId = carId, AttachmentId = attachmentId }
            );
        }
    }
}

//        bool IAttachmentRepository.CreateCarAttachment(long Id, int id)
//        {
//            throw new NotImplementedException();
//        }

//        bool IAttachmentRepository.DeleteCarAttachment(long Id, int id)
//        {
//            throw new NotImplementedException();
//        }

//        bool IAttachmentRepository.GetCarAttachments(long Id, int id)
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
