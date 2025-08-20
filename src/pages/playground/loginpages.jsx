import { useState } from 'react';
import './loginpages.css'
import Swal from 'sweetalert2';

function LoginPages(){

    const [username,setUsername] = useState("");

    function handleLoginClick() {
        if(username.trim()===''){
            Swal.fire("por favor ingrese un nombre valido");
        }
        else{Swal.fire(username)}
    }
    return (
        <div className='login-container'>
            <h2>ejercicio de prueba </h2>
            <input type="text" 
            placeholder='escriba nombre de usuario'
            value={username}
            onChange={e => setUsername(e.target.value)} 
            />
            <button onClick={handleLoginClick}>iniciar seccion</button>
        </div>
    );
}

export default LoginPages;