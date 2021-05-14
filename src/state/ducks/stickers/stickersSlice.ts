import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

export interface Sticker {
  id: string;
  uid: string;
  name: string;
  description: string;
  avatar: string;
  price: number;
  images: string[];
  created: number;
  purchased?: number;
}

export interface StickersState {
  purchased: Sticker[];
  listingOn: Sticker[];
}

export const tmpPurchased = [
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
  },
];

export const tmpListingOn = [
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description:
      'モデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませんんんんんモデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '10C095752-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C95754-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C95755-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C95756-A668-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C95753-A669-4BCB-A61C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A62C-7083585BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083584BDCD2',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD3',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD4',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD5',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'aaaaa',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD7',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD6',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description:
      'モデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませモデルやってます。性別はありませんんんんんんんんんモデルやってます。性別はありませんモデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD21',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD23',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD24',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
  {
    id: '9C095752-A668-4BCB-A61C-7083585BDCD27',
    uid: '94801C77-68E9-4193-B253-C91983477A0D',
    name: 'バク',
    description: 'モデルやってます。性別はありません',
    avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
    price: 20,
    images: [
      'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
      'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT',
      'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
    ],
    created: 1619251130,
    purchased: 1619271130,
  },
];

const initialState: StickersState = {
  purchased: tmpPurchased,
  listingOn: tmpListingOn,
};

export const stickersSlice = createSlice({
  name: 'stickers',
  initialState,
  reducers: {
    listStickerOnMarketplace: (state, action: PayloadAction<Sticker>) => {
      state.listingOn = [...state.listingOn, action.payload];
    },
    purchasedSticker: (state, action: PayloadAction<Sticker>) => {
      state.purchased = [...state.purchased, action.payload];
    },
  },
});

export const {
  listStickerOnMarketplace,
  purchasedSticker,
} = stickersSlice.actions;

export const selectPurchasedStickers = (
  state: RootState
): typeof state.stickers.purchased => state.stickers.purchased;

export const selectStickersListingOn = (
  state: RootState
): typeof state.stickers.listingOn => state.stickers.listingOn;

export default stickersSlice.reducer;
