import { Link } from "react-router-dom";
import BgShape from "../images/hero/hero-bg.png";
import HeroCar from "../images/hero/main-car.png";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack
} from "@mui/material";

function Hero() {
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: (0, 0), behavior: "smooth" });
  };

  const bookBtn = () => {
    document
      .querySelector("#booking-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.pageYOffset > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };

    window.addEventListener("scroll", onPageScroll);
    return () => window.removeEventListener("scroll", onPageScroll);
  }, []);

  return (
    <Box component="section" id="home" sx={{ position: "relative" }}>
      <Box sx={{ paddingTop: { xs: "6rem", sm: "0" } }}>
        <Container>
          {/* bg shape */}
          <Box
            component="img"
            src={BgShape}
            alt="bg-shape"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50vw",      
              height: "85vh",    
              objectFit: "cover", 
              zIndex: -1,
              pointerEvents: "none"
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" }
            }}
          >
            {/* text */}
            <Box sx={{ maxWidth: 500 }}>
              <Typography variant="h6" gutterBottom>
                Plan your trip now
              </Typography>

              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Save{" "}
                <Box component="span" sx={{ color: "#ff4d30" }}>
                  big
                </Box>{" "}
                with our car rental
              </Typography>

              <Typography color="text.secondary" gutterBottom>
                Rent the car of your dreams. Unbeatable prices, unlimited miles,
                flexible pick-up options and much more.
              </Typography>

              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  component={Link}
                  to="/models"
                  onClick={bookBtn}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff4d30",
                    "&:hover": { backgroundColor: "#e63e24" }
                  }}
                >
                  Book Car &nbsp;
                  <i className="fa-solid fa-circle-check"></i>
                </Button>

                <Button
                  component={Link}
                  to="/home"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#333" }
                  }}
                >
                  Learn More &nbsp;
                  <i className="fa-solid fa-angle-right"></i>
                </Button>
              </Stack>
            </Box>

            {/* car image */}
            <Box
              component="img"
              src={HeroCar}
              alt="car-img"
              sx={{
                width: { xs: "100%", md: "55%" },
                mt: { xs: 4, md: 0 }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* scroll up */}
      <Box
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 45,
          height: 45,
          borderRadius: "50%",
          backgroundColor: "#ff4d30",
          color: "white",
          display: goUp ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        <i className="fa-solid fa-angle-up"></i>
      </Box>
    </Box>
  );
}

export default Hero;
