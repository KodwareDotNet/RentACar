import api from "../../axiosConfig";

const addCarsService ={
// Same Call use to add and update
    addCars : async(formData) =>{
        try{
          const res = await api.post("user/addCar", formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          );
          return res;
        }
        catch(ex){
         console.log("error while adding car");
        }
    },
    getCars: async(params = {}) => {
        try {
          const { pageNumber = 1, pageSize = 10 } = params;

            const queryParams = new URLSearchParams({
                page: pageNumber.toString(),
                pageSize: pageSize.toString(),
            });
         const res = await api.get(`User/GetCars?${queryParams}`);
         return res;
        }
        catch(error){
            console.log("failed to get data ", error.response);
        }
    },
    deleteCars: async(id) =>{
      try{
        const res= await api.delete("User/DeleteCar", {
          params: {id},
        });
        return res.data;
      }
      catch(ex)
      {
          alert("failed to delete");
      }
    },
    bookCar: async(formData) => {
        try{
          const res = await api.post("user/bookcar", formData);
          return res;
        }
        catch(ex){
            alert("failed to book car",ex)
        }
    }
};
export default addCarsService;