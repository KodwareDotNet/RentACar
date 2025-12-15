using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
namespace RentACar.Common
{
    public static class ListExtensions
    {
        public static DataTable ToDataTable<T>(this List<T> list)
        {
            DataTable dataTable = new DataTable();
            // Get the properties of the object type
            PropertyInfo[] properties = typeof(T).GetProperties();
            // Create columns in the DataTable based on the object properties
            foreach (PropertyInfo property in properties)
            {
                dataTable.Columns.Add(property.Name,
                    Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
            }
            // Add rows to the DataTable with object property values
            foreach (T item in list)
            {
                DataRow row = dataTable.NewRow();
                foreach (PropertyInfo property in properties)
                {
                    row[property.Name] = property.GetValue(item) ?? DBNull.Value;
                }
                dataTable.Rows.Add(row);
            }
            return dataTable;
        }
    }
}