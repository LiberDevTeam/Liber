import { rest } from 'msw';

export const handlers = [
  rest.get('/v1/marketplace/bots/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    );
  }),
  rest.get('/v1/marketplace/bots/new', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    );
  }),
  rest.get(
    'http://localhost:3001/v1/marketplace/bots/ranking',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
      );
    }
  ),
  rest.get('/v1/marketplace/stickers/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    );
  }),
  rest.get('/v1/marketplace/stickers/new', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    );
  }),
  rest.get('/v1/marketplace/stickers/ranking', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    );
  }),
];
