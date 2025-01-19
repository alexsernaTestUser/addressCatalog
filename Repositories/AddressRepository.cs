using CatalogoDireccionesApp.Data;
using CatalogoDireccionesApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CatalogoDireccionesApp.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly AppDbContext _context;

        public AddressRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Address>> GetAll()
        {
            return await _context.Address.ToListAsync();
        }

        public async Task<Address> GetById(int AddressID)
        {
            return await _context.Address.FindAsync(AddressID);
        }

        // Obtener lista de Ciudades
        public async Task<IEnumerable<String>> GetCities()
        {
            return await _context.Address
                .Select(a => a.City)
                .Distinct()
                .ToListAsync();
        }

        // Obtener lista de Estados
        public async Task<IEnumerable<String>> GetStates()
        {
            return await _context.Address
                .Select(a => a.StateProvince)
                .Distinct()
                .ToListAsync();
        }

        public async Task Update(Address address)
        {
            address.ModifiedDate = DateTime.UtcNow;
            _context.Address.Update(address);
            await _context.SaveChangesAsync();
        }

    }
}
