import {isMobile} from 'react-device-detect';
import {useUser} from './useUser';
import {useMemo} from 'react';
import {
    updateMobilePreferences,
    updateComputerPreferences,
    updateMobileDashboardPreferencesThunk,
    updateComputerDashboardPreferencesThunk,
    updatePreferencesOnlineThunk,
    updateComputerDashboardVisibleColumnPreferences,
    updateMobileDashboardVisibleColumnPreferences
} from '../redux/actions/userActions';

const usePreferences = () => {
    const {preferences: userPreferences} = useUser();

    const preferences = useMemo(
        () => (isMobile ? userPreferences.mobile : userPreferences.computer),
        [userPreferences.computer, userPreferences.mobile]
    );

    const updateDevicePreferences = useMemo(() => (isMobile ? updateMobilePreferences : updateComputerPreferences), []);
    const updateDashboardPreferences = useMemo(
        () => (isMobile ? updateMobileDashboardPreferencesThunk : updateComputerDashboardPreferencesThunk),
        []
    );
    const updateDashboardVisibleColumnsPreferences = useMemo(
        () =>
            isMobile ? updateMobileDashboardVisibleColumnPreferences : updateComputerDashboardVisibleColumnPreferences,
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
