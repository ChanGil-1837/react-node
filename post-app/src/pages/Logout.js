import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const history = useNavigate();
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_SERVER_HOST+'/logout');
            setData(response.data.result);

            history("/")
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    },[history]); // []를 두번째 인자로 주어서 한번만 호출되도록 함
    return (
        <div>

        </div>
    );
};

export default Logout;