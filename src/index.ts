/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

// import { PrismaClient } from "@prisma/client";
// import { PrismaD1 } from "@prisma/adapter-d1";

// export interface Env {
// 	DB: D1Database;
// }

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		const adapter = new PrismaD1(env.DB);
// 		const prisma = new PrismaClient({ adapter });

// 		const users = await prisma.user.findMany();
// 		const result = JSON.stringify(users);
// 		return new Response(result);
// 	},
// } satisfies ExportedHandler<Env>;

import { Hono } from "hono";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export interface Env {
	DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/api/users", async (c) => {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	const users = await prisma.user.findMany();
	const result = JSON.stringify(users);
	return new Response(result);
})

app.get("/api/get/:slug/comments", async (c) => {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	const { slug } = c.req.param();
	const comments = await prisma.comments.findMany({
		where: {
			post_slug: slug
		}
	})
	return c.json(comments);
});

app.post("/api/posts/:slug/comments", async (c) => {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	const { slug } = c.req.param();
	const { author, body } = await c.req.json();

	try {

		if (!author) throw new Error("Missing author value for new comment");
		if (!body) throw new Error("Missing body value for new comment");

		const success = await prisma.comments.create({
			data: {
				author,
				body,
				post_slug: slug
			},
		});

		return c.json(success)
	}

	catch (error) {
		c.status(500)
		return c.text(error + "")
	}
});

export default app;