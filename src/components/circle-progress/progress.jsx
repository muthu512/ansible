import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const GradientCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: 'transparent',
    '& .MuiCircularProgress-circle': {
        strokeLinecap: 'round',
        stroke: 'url(#gradient)',
    },
}));

const GradientSVG = ({ progress,propClass}) => {
    const [displayedProgress, setDisplayedProgress] = React.useState(0);

    React.useEffect(() => {
        let animationFrameId;
        const animate = () => {
            if (displayedProgress < progress) {
                setDisplayedProgress(prev => Math.min(prev + 0.1, progress));
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [progress, displayedProgress]);

    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <linearGradient className={propClass} id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" >
                        <stop offset="5%" style={{ stopColor: 'blue' }} />
                        {progress <= 90 ? <stop offset="100%" style={{ stopColor: 'lightblue' }} /> : null}
                    </linearGradient>
                </defs>
            </svg>
            <GradientCircularProgress
                variant="determinate"
                value={displayedProgress}
                sx={{ transition: 'all 10s ' }}
            />
        </>
    );
};

GradientSVG.propTypes = {
    progress: PropTypes.any,
    propClass: PropTypes.any
};

function CircularProgressWithLabel({ value, propClass }) {
    return (
        <Box  sx={{ position: 'relative', display: 'inline-flex' }}>
            <GradientSVG progress={value} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0, 
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" className={propClass} color="text.secondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.any,
    propClass: PropTypes.any
};

export default function CircularWithValueLabel({ progress,propClass }) {

    return <CircularProgressWithLabel className={propClass} value={progress} />;
}
CircularWithValueLabel.propTypes = {
    progress: PropTypes.any,
    propClass: PropTypes.any,
};

