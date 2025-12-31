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
        Task<long> CreateCarAttachment(string? filePath, string? name, AttachmentType? attachmentType);

        // Link attachment to car
        Task<bool> CreateCarAttachment(long carId, long attachmentId);

        // Get attachments for a car
        Task<IEnumerable<string>> GetCarAttachments(long carId, long attachmentId);

        // Delete attachment
        Task<bool> DeleteCarAttachment(long carId, int attachmentId);

    }
}