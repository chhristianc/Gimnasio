using Application.DTOs.Requests;
using Application.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IMiembroService
    {
        Task Add(MiembroRequest request);
        Task<List<MiembroResponse>> GetAll();
        Task<MiembroResponse> GetById(int id);
    }
}
