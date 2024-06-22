/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */



import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono();
// 定义一个中间件来检查请求方法
import { Context } from 'hono';

const checkGetMethodMiddlewareForUUID = async (c: Context, next: Function) => {
	if (c.req.method !== 'GET') {
	  return c.text('Method Not Allowed', 405);
	}
	await next();
};
// 使用中间件
app.use('/uuid', checkGetMethodMiddlewareForUUID);
app.get('/uuid', (c) => {
	const uuid = uuidv4();
	return c.json({ uuid });
});
export default app;