// app/employees/page.js
"use client"
import { useEffect, useState } from 'react';
import EmployeeCard from '@/components/EmployeeCard';

export default function Employees() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch('/api/employees');
            const data = await response.json();
            setEmployees(data);
        };
        fetchEmployees();
    }, []);

    return (
        <div>
            {employees.map((employee) => (
                <EmployeeCard key={employee.employeeId} employee={employee} />
            ))}
        </div>
    );
}
