import { Link } from "react-router-dom";

function Forgot(){
    return (
        <div>       
            <h1> OLVIDE CONTRASEÑA</h1>
            <Link to="/">
            <button>Volver al Login</button>
            </Link>
        </div>
    );
}
export default Forgot;