import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBledrjCIxoGPKYlzwxmD_2nlyPe3dBVT0",
    authDomain: "hackathon-4eaea.firebaseapp.com",
    projectId: "hackathon-4eaea",
    storageBucket: "hackathon-4eaea.appspot.com",
    messagingSenderId: "807020702559",
    appId: "1:807020702559:web:778e4c4350f81c037e64ea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);