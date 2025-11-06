// src/components/CarCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const CarCard = ({ car, onBook }) => {
    return (
        <div className="models-div__box">
            <div className="models-div__box__img">
                <img src={car.img} alt={car.name} />
                <div className="models-div__box__descr">
                    <div className="models-div__box__descr__name-price">
                        <div className="models-div__box__descr__name-price__name">
                            <p>{car.name}</p>
                            <span>
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                ))}
                            </span>
                        </div>
                        <div className="models-div__box__descr__name-price__price">
                            <h4>${car.price}</h4>
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
                            Book Ride
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
