import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarImg1 from "../images/cars-big/audi-box.png";
import CarImg2 from "../images/cars-big/golf6-box.png";
import CarImg3 from "../images/cars-big/toyota-box.png";
import CarImg4 from "../images/cars-big/bmw-box.png";
import CarImg5 from "../images/cars-big/benz-box.png";
import CarImg6 from "../images/cars-big/passat-box.png";
import CarCard from "../components/CarCard";
import BookACarModal from "../components/BookACarModal";
import AddCarModal from "../components/AddCarModal";
import { useEffect, useState } from "react";
import addCarsService from "../api/services/AddCars/addCarsService";

function Models() {
  const [carsList, setCarsList] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState(null);

  const carsApi = async () => {
    try {
      const res = await addCarsService.getCars();
      setCarsList(res.data || []);
    } catch (ex) {
      alert("failed", ex);
    }
  };

  const handleUpdate = (car) => {
    setSelectedCarDetail(car); // send full car object to modal
    setShowAddCarModal(true); // open AddCarModal for editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await addCarsService.deleteCars(id);
      alert("Car deleted successfully!");
      // Refresh list after delete
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
      // Reset selected car when closing
      setSelectedCarDetail(null);
    }
  };

  const handleCarAdded = () => {
    carsApi(); // Refresh the car list
    setSelectedCarDetail(null);
  };

  const cars = [
    {
      id: 1,
      name: "Audi A1",
      brand: "Audi",
      img: CarImg1,
      price: 45,
      transmission: "Manual",
      fuel: "Diesel",
    },
    {
      id: 2,
      name: "Golf 6",
      brand: "VW",
      img: CarImg2,
      price: 37,
      transmission: "Manual",
      fuel: "Diesel",
    },
  ];

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

        {/* Book Car Modal */}
        <BookACarModal
          modal={showBookModal}
          openModal={toggleBookModal}
          cardetail={selectedCarDetail}
        />

        {/* Add/Edit Car Modal */}
        <AddCarModal
          modal={showAddCarModal}
          openModal={toggleAddCarModal}
          carToEdit={selectedCarDetail}
          onAddCar={handleCarAdded}
        />

        <Footer />
      </section>
    </>
  );
}

export default Models;