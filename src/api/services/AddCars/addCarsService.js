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
          alert("failed to add car", ex);
        }
    },
    getCars: async() => {
        try {
         const res = await api.get("User/GetCars");
         return res;
        }
        catch(ex){
            alert("failed to ge data ", ex);
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
      debugger
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