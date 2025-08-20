import { Link } from "react-router-dom";

function Home(){
    return (
        <div>       
            <h1> Home </h1>
            <Link to="/register">
            <button>IR A REGISTRO</button>
            </Link>
            <Link to="/forgot">
            <button>OLVIDE MI  CONTRASEÑA</button>
            </Link>
            <Link to="/UseState">
            <button>IR CONTADOR</button>
            </Link>
        </div>
    );
}
export default Home;