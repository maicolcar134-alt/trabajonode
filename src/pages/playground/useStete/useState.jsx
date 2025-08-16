import { useState } from "react";

function UseStatecontador(){
    const [contador, setContador] = useState(0);
    function aumentar() {
        setContador(contador + 1);

    }
    function disminuir() {
        setContador(contador - 1);
    }

        
    return(
        <div>
        <h2>valor del contador = {contador}</h2>
        <button onClick={aumentar}>aumentar</button>
        <button onClick={disminuir}>disminuir</button>

        </div>
    );
}
export default UseStatecontador;