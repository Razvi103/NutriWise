import React from 'react';
import { Box, Typography } from '@mui/material';
import { themeColors } from '../../theme';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface LogoProps {
  variant?: 'default' | 'compact';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  color = themeColors.primary,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: variant === 'compact' ? '40px' : '48px',
          height: variant === 'compact' ? '40px' : '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '8px',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RestaurantIcon
            sx={{
              color: color,
              fontSize: variant === 'compact' ? '24px' : '28px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <TrendingUpIcon
            sx={{
              color: themeColors.accent,
              fontSize: variant === 'compact' ? '16px' : '20px',
              position: 'absolute',
              bottom: '0',
              right: '0',
              transform: 'translate(25%, 25%)',
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '2px',
            }}
          />
        </Box>
      </Box>
      {variant === 'default' && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span style={{ color: color }}>Nutri</span>
          <span style={{ color: themeColors.accent }}>Wise</span>
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
