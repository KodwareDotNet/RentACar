// src/components/CarCard.jsx
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL } from "../api/axiosConfig";

const CarCard = ({ car, onBook, onUpdate, onDelete }) => {
    return (
        <div className="models-div__box">
            <div className="models-div__box__img">
                <img src={`${BASE_URL}${car.imageUrl}`} alt={car.name} />
                <div className="models-div__box__descr">
                    <div className="models-div__box__descr__name-price">
                        <div className="models-div__box__descr__name-price__name">
                            <p>{car.carName}</p>
                            <span>
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                ))}
                            </span>
                        </div>
                        <div className="models-div__box__descr__name-price__price">
                            <h4>${car.pricePerDay}</h4>
                            <p>per day</p>
                        </div>
                    </div>

                    <div className="models-div__box__descr__name-price__details">
                        <span>
                            <i className="fa-solid fa-car-side"></i> &nbsp; {car.brand}
                        </span>
                        <span style={{ textAlign: "right" }}>
                            4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        </span>
                        <span>
                            <i className="fa-solid fa-car-side"></i> &nbsp; {car.transmission}
                        </span>
                        <span style={{ textAlign: "right" }}>
                            {car.fuel} &nbsp; <i className="fa-solid fa-car-side"></i>
                        </span>
                    </div>

                    <div className="models-div__box__descr__name-price__btn"
                        onClick={onBook}
                    >
                        <div >
                            Book Car
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "10px" }}>
                        <button onClick={onUpdate} className="btn-edit" title="Update">
                            <EditIcon fontSize="small" />
                        </button>
                        <button onClick={onDelete} className="btn-delete" title="Delete">
                            <DeleteIcon fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
