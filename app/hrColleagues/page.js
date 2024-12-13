// app/hrColleagues/page.js
"use client"
import { useEffect, useState } from 'react';

export default function HrColleagues() {
    const [hrColleagues, setHrColleagues] = useState([]);

    useEffect(() => {
        const fetchHrColleagues = async () => {
            const response = await fetch('/api/hrColleagues');
            const data = await response.json();
            setHrColleagues(data);
        };
        fetchHrColleagues();
    }, []);

    return (
        <div>
            <h1>HR Colleagues</h1>
            <ul>
                {hrColleagues.map((hrColleague) => (
                    <li key={hrColleague.hrColleagueId}>
                        {hrColleague.firstName} {hrColleague.lastName} - {hrColleague.responsibility}
                    </li>
                ))}
            </ul>
        </div>
    );
}
