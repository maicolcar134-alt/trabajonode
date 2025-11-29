import { useEffect } from 'react';
import Swal from 'sweetalert2';

function Spinner() {
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: '#000000', // 🔹 Fondo del modal negro
            color: '#ffffff',      // 🔹 Texto blanco
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // 🔹 Fondo de toda la pantalla (overlay) negro
                const swalOverlay = document.querySelector('.swal2-container');
                if (swalOverlay) {
                    swalOverlay.style.backgroundColor = 'rgba(0,0,0,1)'; // negro sólido
                }
            }
        });

        return () => {
            Swal.close();
        };
    }, []);

    return null;
}

export default Spinner;