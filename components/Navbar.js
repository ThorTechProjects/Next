// app/components/Navbar.js
'use client'; // Explicitly mark this as a Client Component
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Container maxWidth="lg">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My App
                    </Typography>
                    <Button color="inherit" component={Link} href="/employees">
                        Employees
                    </Button>
                    <Button color="inherit" component={Link} href="/hrColleagues">
                        HR Colleagues
                    </Button>
                    <Button color="inherit" component={Link} href="/requests">
                        Requests
                    </Button>
                </Container>
            </Toolbar>
        </AppBar>
    );
}
