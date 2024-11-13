import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';
import {HoldingsSummary} from '../../components/HoldingsSummary/HoldingsSummary';
import {useApp} from '../../hooks/useApp';

export const Holdings = () => {
    const navigate = useNavigate();
    const {isLoading} = useApp();

    useEffect(() => {
        if (!isMobile) {
            navigate('/porfolio');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoading ? <></> : <HoldingsSummary />;
};
