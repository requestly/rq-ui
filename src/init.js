import { addGoogleAnalytics } from "./config/integrations";
import PSMH from "./config/PageScriptMessageHandler";
import StorageServiceWrapper from "./utils/StorageServiceWrapper";

//Initialize StorageService
export const StorageService = (appMode) =>
  new StorageServiceWrapper({
    cacheRecords: false,
    appMode: appMode,
  });

//Initialize Integrations
addGoogleAnalytics();

//Initialize PageScriptMessageHandler
PSMH.init();
