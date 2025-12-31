import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import CarCard from "../components/CarCard";
import BookACarModal from "../components/BookACarModal";
import AddCarModal from "../components/AddCarModal";
import { useEffect, useState } from "react";
import addCarsService from "../api/services/AddCars/addCarsService";
import bookCarsService from "../api/services/BookCars/bookCarsService";
import { BASE_URL } from "../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from '@mui/material';

export function Models() {
  const [carsList, setCarsList] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    carsApi(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const location = useLocation();
  const navigate = useNavigate();

  // Sync modal state with URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldShowModal = params.get("modal") === "true";

    if (shouldShowModal && !showAddCarModal) {
      setSelectedCarDetail(null);
      setShowAddCarModal(true);
    } else if (!shouldShowModal && showAddCarModal) {
      setShowAddCarModal(false);
      setSelectedCarDetail(null);
    }
  }, [location.search]);

  const isCarAvailable = (carId, allBookings, currentDate) => {

    const carBookings = allBookings.filter(booking => booking.car.id === carId);

    if (carBookings.length === 0) {
      return true;
    }

    const current = new Date(currentDate);

    const isBooked = carBookings.some(booking => {
      const pickup = new Date(booking.pickupDate);
      const dropoff = new Date(booking.dropoffDate);

      return current >= pickup && current <= dropoff;
    });

    // If car is booked right now, it's NOT available
    return !isBooked;
  }

  const carsApi = async () => {
    try {
      const res = await addCarsService.getCars({
        pageNumber: currentPage,
        pageSize: pageSize
      });
      console.log("carsApi called");
      console.log("Cars API Response:", res);

      const paginationData = res.data.pagination;

      const bookingsRes = await bookCarsService.getBookedCars();
      const currentDate = new Date().toISOString().split('T')[0];
      const carsWithImages = (res.data.data || []).map((item) => {
        let imageUrl = null;

        if (item.imageUrl) {
          imageUrl = `${BASE_URL}${item.imageUrl}`;
        }

        return {
          ...item,
          image: imageUrl,
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });

      const availableCars = carsWithImages.filter(car => {
        return isCarAvailable(car.id, bookingsRes.data.data, currentDate);
      });

      setCarsList(availableCars);
      if (paginationData) {
        setCurrentPage(paginationData.currentPage);
        setTotalPages(paginationData.totalPages);
        setTotalRecords(paginationData.totalRecords);
        setPageSize(paginationData.pageSize);
      }
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

    const newModalState = !showAddCarModal;

    setShowAddCarModal(newModalState);

    if (newModalState) {
      // Opening modal - add URL parameter if not already there
      const params = new URLSearchParams(location.search);
      if (params.get("modal") !== "true") {
        navigate("?modal=true", { replace: true });
      }
    } else {
      // Closing modal - remove URL parameter
      setSelectedCarDetail(null);
      navigate(location.pathname, { replace: true });
    }
  };

  const handleCarAdded = () => {
    setSelectedCarDetail(null);
    setShowAddCarModal(false);
    navigate(location.pathname, { replace: true }); // Remove URL parameter
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
          carsApi={carsApi}
        />

        <AddCarModal
          modal={showAddCarModal}
          openModal={toggleAddCarModal}
          carToEdit={selectedCarDetail}
          onAddCar={handleCarAdded}
          refreshCarsList={carsApi}
        />
        {totalRecords > pageSize && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            gap: 1
          }}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "contained" : "outlined"}
                  onClick={() => handlePageChange(pageNum)}
                  sx={{
                    minWidth: 40,
                    fontWeight: currentPage === pageNum ? 600 : 400
                  }}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Next
            </Button>
          </Box>
        )}
        <Footer />
      </section>
    </>
  );
}

export default Models;