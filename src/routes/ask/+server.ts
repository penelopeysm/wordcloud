import { getData } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const data = await getData("programming");
    console.log(data);
    return json(data);
};
