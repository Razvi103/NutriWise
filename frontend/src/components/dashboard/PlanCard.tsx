import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import { Plan } from '../../data/planData';

interface PlanCardProps {
    plan: Plan;
    onView: (plan: Plan) => void;
}

const getPlanIcon = (icon: Plan['icon']) => {
    switch (icon) {
        case 'fitness':
            return <FitnessCenterIcon color="primary" fontSize="large" />;
        case 'restaurant':
            return <RestaurantMenuIcon color="primary" fontSize="large" />;
        case 'description':
            return <DescriptionIcon color="primary" fontSize="large" />;
        case 'security':
            return <SecurityIcon color="primary" fontSize="large" />;
        default:
            return null;
    }
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, onView }) => (
    <Card sx={{ minWidth: 250, maxWidth: 350, m: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>{getPlanIcon(plan.icon)}</Box>
        <CardContent>
            <Typography variant="h6" gutterBottom>{plan.title}</Typography>
            <Typography variant="body2" color="textSecondary">{plan.description}</Typography>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={() => onView(plan)}>View Details</Button>
        </CardActions>
    </Card>
);

export default PlanCard;