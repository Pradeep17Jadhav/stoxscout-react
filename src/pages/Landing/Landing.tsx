import {useEffect} from 'react';
import {isMobile} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

export const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobile) {
            navigate('./holdings');
        } else {
            navigate('./portfolio');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};
