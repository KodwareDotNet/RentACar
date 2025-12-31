using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.ViewModel;

namespace RentACar.Interfaces.RepoInterfaces
{
    public interface IAttachmentRepository
    {
        public long CreateAttachment(string? filePath, string? name, AttachmentType? attachmentType);
        public long CreateNewsAttachment(long newsId, long attachmentId);
        public long DeleteNewsAttachment(long newsId, int id);
    }

}
