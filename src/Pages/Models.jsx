import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarImg1 from "../images/cars-big/audi-box.png";
import CarImg2 from "../images/cars-big/golf6-box.png";
import CarImg3 from "../images/cars-big/toyota-box.png";
import CarImg4 from "../images/cars-big/bmw-box.png";
import CarImg5 from "../images/cars-big/benz-box.png";
import CarImg6 from "../images/cars-big/passat-box.png";
import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";
import BookACarModal from "../components/BookACarModal";
import { useState } from "react";


function Models() {



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
    {
      id: 3,
      name: "Toyota",
      brand: "Camry",
      img: CarImg3,
      price: 30,
      transmission: "Manual",
      fuel: "Diesel",

    },
    {
      id: 4,
      name: "BMW 320",
      brand: "ModernLine",
      img: CarImg4,
      price: 35,
      transmission: "Manual",
      fuel: "Diesel",

    },
    {
      id: 5,
      name: "Mercedes",
      brand: "Benz GLK",
      img: CarImg5,
      price: 50,
      transmission: "Manual",
      fuel: "Diesel",

    },
    {
      id: 6,
      name: "VW Passat",
      brand: "CC",
      img: CarImg6,
      price: 25,
      transmission: "Manual",
      fuel: "Diesel",

    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const toggleModal = (cardetail) => {
    setSelectedCarDetail(cardetail);
    setShowModal((prev) => !prev);
  };

  const handleConfirm = () => {
    console.log("Booking confirmed for car ID:", selectedCarDetail);
    setShowModal(false);
  };


  return (
    <>
      <section className="models-section">
        <HeroPages name="Vehicle Models" />
        <div className="container">
          <div className="models-div">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} onBook={() => toggleModal(car)} />
            ))}
          </div>
         
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>(123) 456-7869</h3>
              </span>
            </div>
          </div>
        </div>
        <BookACarModal
          modal={showModal}
          openModal={toggleModal}
          cardetail={selectedCarDetail}
          confirmBooking={handleConfirm}
        />
        <Footer />
      </section>
    </>
  );
}

export default Models;
