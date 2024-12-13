'use client'; // Explicitly mark this as a Client Component
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function EmployeeCard({ employee }) {
    return (
        <Card 
            variant="outlined" 
            sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}
        >
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {employee.firstName} {employee.lastName}
                </Typography>
                <Box sx={{ marginBottom: 1 }}>
                    <Typography variant="body1">
                        <strong>Email:</strong> {employee.email}
                    </Typography>
                </Box>
                <Box sx={{ marginBottom: 1 }}>
                    <Typography variant="body1">
                        <strong>Department:</strong> {employee.department}
                    </Typography>
                </Box>
                <Typography variant="body1">
                    <strong>Team:</strong> {employee.team}
                </Typography>
            </CardContent>
        </Card>
    );
}
