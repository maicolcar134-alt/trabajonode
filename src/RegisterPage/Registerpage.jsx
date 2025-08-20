import { Link } from "react-router-dom";

function Register(){
    return (
        <div>       
            <h1> REGISTRO </h1>
            <Link to="/">
            <button>Volver al Login</button>
            </Link>
        </div>
    );
}
export default Register;
