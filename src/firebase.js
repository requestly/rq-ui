import { initializeApp } from "firebase/app";

import { CONFIG as GLOBAL_CONFIG } from "git@github.com:requestly/requestly.git";

const firebaseApp = initializeApp(GLOBAL_CONFIG.firebaseConfig);

export default firebaseApp;
