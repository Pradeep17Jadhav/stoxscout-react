import {isMobile} from 'react-device-detect';
import {useUser} from './useUser';
import {useMemo} from 'react';
import {
    updateMobilePreferences,
    updateComputerPreferences,
    updateMobileDashboardPreferences,
    updateComputerDashboardPreferencesThunk,
    updatePreferencesOnlineThunk,
    updateComputerDashboardVisibleColumnPreferences
} from '../redux/actions/userActions';

const usePreferences = () => {
    const {preferences: userPreferences} = useUser();

    const preferences = useMemo(
        () => (isMobile ? userPreferences.mobile : userPreferences.computer),
        [userPreferences.computer, userPreferences.mobile]
    );

    const updateDevicePreferences = useMemo(() => (isMobile ? updateMobilePreferences : updateComputerPreferences), []);
    const updateDashboardPreferences = useMemo(
        () => (isMobile ? updateMobileDashboardPreferences : updateComputerDashboardPreferencesThunk),
        []
    );
    const updateDashboardVisibleColumnsPreferences = useMemo(
        () =>
            isMobile
                ? updateComputerDashboardVisibleColumnPreferences
                : updateComputerDashboardVisibleColumnPreferences, // handle this for mobile
        []
    );

    return {
        dashboardPreferences: preferences?.dashboard,
        dashboardVisibleColumns: preferences?.dashboard?.visibleColumns,
        updatePreferencesOnline: updatePreferencesOnlineThunk,
        updateDevicePreferences,
        updateDashboardPreferences,
        updateDashboardVisibleColumnsPreferences
    };
};

export default usePreferences;
