using Application.DTOs.Requests;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MiembroController : ControllerBase
    {
        private readonly IMiembroService _service;

        public MiembroController(IMiembroService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(MiembroRequest request)
        {
            await _service.Add(request);
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAll();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetById(id);

            return Ok(response);
        }
    }
}
