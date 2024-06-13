
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import IImagen from '../../../../types/IImagen';
import './carousel.css';

interface BootstrapCarouselProps {
    imagenes: IImagen[];
}

const BootstrapCarousel: React.FC<BootstrapCarouselProps> = ({ imagenes }) => {
    return (
        <Carousel>
            {imagenes.map((imagen, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block carousel-image"
                        src={imagen.url}
                        alt={imagen.descripcion}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default BootstrapCarousel;
