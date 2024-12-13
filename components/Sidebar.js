'use client'; // Explicitly mark this as a Client Component
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

export default function Sidebar() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Toggle Drawer state
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer(true)}
                aria-label="menu"
                sx={{ position: 'absolute', top: 16, left: 16 }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
               <nav style={{ width: "250px", backgroundColor: "#f4f4f4", padding: "1rem" }}>
                    <List>
                        <ListItem onClick={toggleDrawer(false)}>
                            <Link href="/" passHref>
                                <ListItemText primary="Home" style={{ cursor: 'pointer' }} />
                            </Link>
                        </ListItem>
                        <ListItem onClick={toggleDrawer(false)}>
                            <Link href="/employees" passHref>
                                <ListItemText primary="Employees" style={{ cursor: 'pointer' }} />
                            </Link>
                        </ListItem>
                        <ListItem onClick={toggleDrawer(false)}>
                            <Link href="/hrColleagues" passHref>
                                <ListItemText primary="HR Colleagues" style={{ cursor: 'pointer' }} />
                            </Link>
                        </ListItem>
                        <ListItem onClick={toggleDrawer(false)}>
                            <Link href="/requests" passHref>
                                <ListItemText primary="Requests" style={{ cursor: 'pointer' }} />
                            </Link>
                        </ListItem>
                    </List>
                </nav>
            </Drawer>
        </>
    );
}
