// app/api/employees/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const employees = await prisma.employees.findMany();
    return new Response(JSON.stringify(employees), { status: 200 });
}

export async function POST(request) {
    const data = await request.json();
    const newEmployee = await prisma.employees.create({
        data: data,
    });
    return new Response(JSON.stringify(newEmployee), { status: 201 });
}
