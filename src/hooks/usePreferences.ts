import {isMobile} from 'react-device-detect';
import {useUser} from './useUser';
import {useMemo} from 'react';
import {
    updateMobilePreferences,
    updateComputerPreferences,
    updateMobileDashboardPreferences,
    updateComputerDashboardPreferences
} from '../redux/actions/userActions';

const usePreferences = () => {
    const {preferences: userPreferences} = useUser();

    const preferences = useMemo(
        () => (isMobile ? userPreferences.mobile : userPreferences.computer),
        [userPreferences.computer, userPreferences.mobile]
    );

    const getPreferences = () => preferences;
    const getDashboardPreferences = () => preferences?.dashboard;
    const updateDevicePreferences = useMemo(() => (isMobile ? updateMobilePreferences : updateComputerPreferences), []);
    const updateDashboardPreferences = useMemo(
        () => (isMobile ? updateMobileDashboardPreferences : updateComputerDashboardPreferences),
        []
    );

    return {
        getPreferences,
        dashboardPreferences: getDashboardPreferences(),
        updateDevicePreferences,
        updateDashboardPreferences
    };
};

export default usePreferences;
