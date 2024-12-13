// app/api/requests/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const requests = await prisma.requests.findMany();
    return new Response(JSON.stringify(requests), { status: 200 });
}

export async function POST(request) {
    const data = await request.json();
    const newRequest = await prisma.requests.create({
        data: data,
    });
    return new Response(JSON.stringify(newRequest), { status: 201 });
}
