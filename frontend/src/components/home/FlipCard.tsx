import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { themeColors } from '../../theme';

interface FlipCardProps {
  image: string;
  title: string;
  description: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ image, title, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box
      sx={{
        perspective: '1000px',
        width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' },
        height: '300px',
        cursor: 'pointer',
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: themeColors.paperBackground,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: '100%',
              height: '70%',
              objectFit: 'cover',
              borderRadius: '4px',
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: '500', color: themeColors.textPrimary }}
          >
            {title}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: themeColors.paperBackground,
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: 'center' }}
          >
            {description}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default FlipCard;
