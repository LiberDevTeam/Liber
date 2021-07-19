import { rest } from 'msw';

const botIds = [...Array(10)].map(
  (_, i) => `9C095752-A668-4BCB-A61C-7083585BDCD${i}`
);

const stickerIds = [
  '9C095752-A668-4BCB-A61C-7083585BDCD2',
  '10C095752-A668-4BCB-A61C-7083585BDCD2',
  '9C95754-A668-4BCB-A61C-7083585BDCD2',
  '9C95755-A668-4BCB-A61C-7083585BDCD2',
  '9C95756-A668-4BCB-A61C-7083585BDCD2',
  '9C95753-A669-4BCB-A61C-7083585BDCD2',
  '9C095752-A668-4BCB-A62C-7083585BDCD2',
  '9C095752-A668-4BCB-A61C-7083584BDCD2',
  '9C095752-A668-4BCB-A61C-7083585BDCD3',
  '9C095752-A668-4BCB-A61C-7083585BDCD4',
];

export const handlers = [
  rest.get('/v1/marketplace/bots/search', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ botIds }));
  }),
  rest.get('/v1/marketplace/bots/new', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ botIds }));
  }),
  rest.get('/v1/marketplace/bots/ranking', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ botIds }));
  }),
  rest.get('/v1/marketplace/stickers/search', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ stickerIds }));
  }),
  rest.get('/v1/marketplace/stickers/new', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ stickerIds }));
  }),
  rest.get('/v1/marketplace/stickers/ranking', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ stickerIds }));
  }),
];
