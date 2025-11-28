import { useEffect } from 'react';
import Swal from 'sweetalert2';

function Spinner() {
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: '#000000',
            color: '#ffffff',
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                const swalOverlay = document.querySelector('.swal2-container');
                if (swalOverlay) {
                    swalOverlay.style.backgroundColor = 'rgba(0,0,0,1)';
                }
            }
        });

        //  Cierra el spinner 
        const timer = setTimeout(() => {
            Swal.close();
        }, 0);

        return () => {
            clearTimeout(timer);
            Swal.close();
        };
    }, []);

    return null;
}

export default Spinner;
