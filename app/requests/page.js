// app/requests/page.js
"use client"
import { useEffect, useState } from 'react';

export default function Requests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/requests');
            const data = await response.json();
            setRequests(data);
        };
        fetchRequests();
    }, []);

    return (
        <div>
            <h1>Requests</h1>
            <ul>
                {requests.map((request) => (
                    <li key={request.requestId}>
                        {request.requestType} - {request.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}
