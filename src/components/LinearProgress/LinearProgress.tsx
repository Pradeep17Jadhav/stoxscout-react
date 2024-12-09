import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import {useAlert} from '../../hooks/useAlert';
import {useCallback, useEffect, useMemo, useState} from 'react';

const MagnyFireLinearProgress = () => {
    const {isFetching, isProcessSuccess} = useAlert();
    const [showLinearProgress, setShowLinearProgress] = useState(isFetching);
    const [opacity, setOpacity] = useState(1);

    const errorStyle = useMemo(
        () => ({
            opacity: opacity,
            backgroundColor: 'red',
            '& .MuiLinearProgress-bar1Indeterminate': {
                backgroundColor: 'red'
            },
            '& .MuiLinearProgress-bar2Indeterminate': {
                backgroundColor: 'red'
            }
        }),
        [opacity]
    );

    const successStyle = useMemo(
        () => ({
            opacity: opacity,
            backgroundColor: 'green',
            '& .MuiLinearProgress-bar1Indeterminate': {
                backgroundColor: 'green'
            },
            '& .MuiLinearProgress-bar2Indeterminate': {
                backgroundColor: 'green'
            }
        }),
        [opacity]
    );

    const toggleLinearProgress = useCallback(() => {
        if (isFetching && !showLinearProgress) {
            setOpacity(1);
            setShowLinearProgress(true);
        } else if (!isFetching && showLinearProgress) {
            setTimeout(() => setOpacity(0), 3000);
            setTimeout(() => setShowLinearProgress(false), 5000);
        }
    }, [isFetching, showLinearProgress]);

    const styles = useMemo(() => {
        if (isFetching) {
            return;
        }
        if (isProcessSuccess) {
            return successStyle;
        }
        return errorStyle;
    }, [errorStyle, isFetching, isProcessSuccess, successStyle]);

    useEffect(() => {
        toggleLinearProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching]);

    console.log(isFetching);
    return <div className="linear-process-container">{showLinearProgress && <LinearProgress sx={styles} />}</div>;
};

export default MagnyFireLinearProgress;
