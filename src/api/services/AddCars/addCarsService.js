import api from "../../axiosConfig";

const addCarsService ={

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
         const res = await api.get("user/getcars");
         return res;
        }
        catch(ex){
            alert("failed to ge data ", ex);
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