import { Navigate, useNavigate } from 'react-router-dom';

export default function Home() {

    if (localStorage.getItem("acces_token")) {
        console.log(localStorage.getItem("access_token"));


        return (
            <>Home Page</>
        );

    }
    return (
        <Navigate to="/" replace />

    )
}