using CatalogoDireccionesApp.Models;
using Microsoft.AspNetCore.Mvc;

public interface IAddressRepository
{
    Task<IEnumerable<Address>> GetAll();
    Task<Address> GetById(int id);
    Task<IEnumerable<String>> GetCities();
    Task<IEnumerable<String>> GetStates();
    Task Update(Address address);
}
