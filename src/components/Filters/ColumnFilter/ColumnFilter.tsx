import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import Box from '@mui/material/Box/Box';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Typography from '@mui/material/Typography/Typography';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import {DEFAULT_COLUMNS} from '../../../types/userPreferences';
import {COLUMNS} from '../../../types/transaction';
import usePreferences from '../../../hooks/usePreferences';
import {AppDispatch} from '../../../redux/store/store';

const ColumnFilter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const defaultColumnsKeys = Object.keys(DEFAULT_COLUMNS).filter((key) => isNaN(Number(key)));
    const defaultColumnsNumericValues = Object.values(DEFAULT_COLUMNS).filter(
        (value) => typeof value === 'number'
    ) as DEFAULT_COLUMNS[];
    const {dashboardVisibleColumns = [], updateDashboardVisibleColumnsPreferences} = usePreferences();
    const visibleColumns = dashboardVisibleColumns.length === 0 ? defaultColumnsNumericValues : dashboardVisibleColumns;

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

    const selectAll = useCallback(() => {
        dispatch(updateDashboardVisibleColumnsPreferences(defaultColumnsNumericValues));
    }, [defaultColumnsNumericValues, dispatch, updateDashboardVisibleColumnsPreferences]);

    const deselectAll = useCallback(() => {
        dispatch(updateDashboardVisibleColumnsPreferences([defaultColumnsNumericValues[0]]));
    }, [defaultColumnsNumericValues, dispatch, updateDashboardVisibleColumnsPreferences]);

    return (
        <Box p={2} overflow="auto">
            <Box mb={2}>
                <MenuItem onClick={selectAll}>
                    <Typography>Select All</Typography>
                </MenuItem>
                <MenuItem onClick={deselectAll}>
                    <Typography>Deselect All</Typography>
                </MenuItem>
            </Box>

            {defaultColumnsKeys.map((key) => {
                const value = DEFAULT_COLUMNS[key as keyof typeof DEFAULT_COLUMNS];
                return (
                    <FormControlLabel
                        key={key}
                        sx={{minWidth: '200px'}}
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
                );
            })}
        </Box>
    );
};

export default ColumnFilter;
