import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarCard from "../components/CarCard";
import BookACarModal from "../components/BookACarModal";
import AddCarModal from "../components/AddCarModal";
import { useEffect, useState } from "react";
import addCarsService from "../api/services/AddCars/addCarsService";
import { BASE_URL } from "../api/axiosConfig";
import { useLocation } from "react-router-dom";

export function Models() {
  const [carsList, setCarsList] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "true") {
      setSelectedCarDetail(null); // ensure add mode
      setShowAddCarModal(true);
    }
  }, [location.search]);

  const carsApi = async () => {
    try {
      const res = await addCarsService.getCars();
      console.log("carsApi called");
      console.log("Cars API Response:", res);

      const carsWithImages = (res.data || []).map((item) => {
        let imageUrl = null;

        if (item.imageUrl) {

          imageUrl = `${BASE_URL}${item.imageUrl}`; // construct full URL
        }

        return {
          ...item,
          image: imageUrl,
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });


      setCarsList(carsWithImages);
    } catch (ex) {

      alert("failed", ex);
    }
  };


  const handleUpdate = (car) => {
    setSelectedCarDetail(car);
    setShowAddCarModal(true);
    carsApi();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await addCarsService.deleteCars(id);
      alert("Car deleted successfully!");
      carsApi();
    } catch (err) {
      alert("Failed to delete car");
    }
  };

  const toggleBookModal = (cardetail) => {
    setSelectedCarDetail(cardetail);
    setShowBookModal((prev) => !prev);
  };

  const toggleAddCarModal = () => {
    setShowAddCarModal((prev) => !prev);
    if (showAddCarModal) {
      setSelectedCarDetail(null);
    }

  };

  const handleCarAdded = () => {
    setSelectedCarDetail(null);
    setShowAddCarModal(false);
    // carsApi();
  };

  useEffect(() => {
    carsApi();
  }, []);

  return (
    <>
      <section className="models-section">
        <HeroPages name="Vehicles" />
        <div className="container">
          <div className="models-div">
            {carsList.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onBook={() => toggleBookModal(car)}
                onUpdate={() => handleUpdate(car)}
                onDelete={() => handleDelete(car.id)}
              />
            ))}
          </div>
        </div>

        <BookACarModal
          modal={showBookModal}
          openModal={toggleBookModal}
          cardetail={selectedCarDetail}
        />

        <AddCarModal
          modal={showAddCarModal}
          openModal={toggleAddCarModal}
          carToEdit={selectedCarDetail}
          onAddCar={handleCarAdded}
          refreshCarsList={carsApi}  // IMPORTANT
        />

        <Footer />
      </section>
    </>
  );
}

export default Models;
