import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CardMedia } from "@mui/material";

const ImageSlider = ({ images, name }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Auto-slide enabled
    autoplaySpeed: 3000, // Slide every 3 seconds
    pauseOnHover: true,
    customPaging: (i) => (
      <div
        style={{
          width: "9px",
          height: "9px",
          background: "#888",
          borderRadius: "50%",
          display: "inline-block",
          marginTop: "5px",
          cursor: "pointer",
        }}
      />
    ),
    appendDots: (dots) => (
      <div
        style={{
          width: "100%",
          position: "absolute",
          bottom: "1px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        //   background: "rgba(255, 255, 255, 0.5)", // Adds contrast
          paddingTop: "5px",
          borderRadius: "2px",
        }}
      >
        <ul style={{ padding: "0px", margin: "0px", display: "flex" }}>{dots}</ul>
      </div>
    ),
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "40%" },
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "281px",
        // border: "2px solid red",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {Array.isArray(images) && images.length > 1 ? (
        <Slider {...settings} style={{ width: "100%", height: "100%" }}>
          {images.map((img, index) => (
            <CardMedia
              key={index}
              component="img"
              image={img}
              alt={name}
              sx={{
                width: "100%",
                height: "258px",
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          ))}
        </Slider>
      ) : (
        <CardMedia
          component="img"
          image={images[0] || "https://via.placeholder.com/300"}
          alt={name}
          sx={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
      )}
    </Box>
  );
};

export default ImageSlider;
