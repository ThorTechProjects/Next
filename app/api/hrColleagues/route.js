// app/api/hrColleagues/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const hrColleagues = await prisma.hrColleagues.findMany();
    return new Response(JSON.stringify(hrColleagues), { status: 200 });
}

export async function POST(request) {
    const data = await request.json();
    const newHrColleague = await prisma.hrColleagues.create({
        data: data,
    });
    return new Response(JSON.stringify(newHrColleague), { status: 201 });
}
