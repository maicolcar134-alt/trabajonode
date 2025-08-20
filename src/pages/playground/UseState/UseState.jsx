import { useState } from "react";
import { Link } from "react-router-dom";

function UseState(){
    const [contador, setContador] = useState(0);
    function aumentar() {
        setContador(contador + 1);

    }
    function disminuir() {
        setContador(contador - 1);
    }

        
    return(
        <div>
      <h2>Valor del contador = {contador}</h2>

        <button onClick={aumentar}>Aumentar</button>
        <button onClick={disminuir}>Disminuir</button>

        <Link to="/hooks">
        <button>IR A HOOKS GENERAL</button>
        </Link>
        <Link to="/register">
        <button>Volver al Login</button>
        </Link>
        </div>

    );
}
export default UseState
