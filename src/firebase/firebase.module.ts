import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./firebase-admin-sdk.json')

@Module({
  providers: [
    {
      provide: 'FirebaseAdmin',
      useFactory: () => {
        const credential = admin.credential.cert(serviceAccount); // Provide the path to the JSON file
        admin.initializeApp({
          credential
        });
      },
    },
    FirebaseService,
  ],
  exports: [FirebaseService, 'FirebaseAdmin'],
})
export class FirebaseModule {}
