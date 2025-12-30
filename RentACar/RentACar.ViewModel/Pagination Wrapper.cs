using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class PagedResponse<T>
    {
        public List<T> Data { get; set; }
        public PaginationDto Pagination { get; set; }
    }

    public class PaginationDto
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
}
}
