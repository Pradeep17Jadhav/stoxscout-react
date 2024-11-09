import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Checkbox, FormControlLabel, Box} from '@mui/material';
import {DEFAULT_COLUMNS} from '../../types/userPreferences';
import {COLUMNS} from '../../types/transaction';
import usePreferences from '../../hooks/usePreferences';
import {AppDispatch} from '../../redux/store/store';

const ColumnFilter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const defaultColumnsKeys = Object.keys(DEFAULT_COLUMNS).filter((key) => isNaN(Number(key)));
    const numericValues = Object.values(DEFAULT_COLUMNS).filter((value) => typeof value === 'number');
    const {dashboardVisibleColumns = [], updateDashboardVisibleColumnsPreferences} = usePreferences();
    const visibleColumns = dashboardVisibleColumns.length === 0 ? numericValues : dashboardVisibleColumns;

    const handleCheckboxChange = useCallback(
        (columnId: number) => () => {
            const newDashboardVisibleColumns = ([] as DEFAULT_COLUMNS[]).concat(visibleColumns as DEFAULT_COLUMNS[]);
            const index = newDashboardVisibleColumns.indexOf(columnId);
            if (index !== -1) {
                newDashboardVisibleColumns.splice(index, 1);
            } else {
                newDashboardVisibleColumns.push(columnId);
            }
            newDashboardVisibleColumns.sort((a, b) => a - b);
            dispatch(updateDashboardVisibleColumnsPreferences(newDashboardVisibleColumns));
        },
        [visibleColumns, dispatch, updateDashboardVisibleColumnsPreferences]
    );

    const isVisibleColumn = useCallback(
        (columnId: number) => {
            if (!visibleColumns.length) {
                return true;
            }
            return visibleColumns.includes(columnId);
        },
        [visibleColumns]
    );

    return (
        <>
            <Box p={2} overflow="auto">
                {defaultColumnsKeys.map((key) => {
                    const value = DEFAULT_COLUMNS[key as keyof typeof DEFAULT_COLUMNS];
                    return (
                        <>
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                        disabled={value === 1}
                                        checked={isVisibleColumn(value)}
                                        onChange={handleCheckboxChange(value)}
                                        color="primary"
                                    />
                                }
                                label={COLUMNS[value]}
                            />
                            <br />
                        </>
                    );
                })}
            </Box>
        </>
    );
};

export default ColumnFilter;
