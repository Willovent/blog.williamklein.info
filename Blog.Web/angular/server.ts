
import * as appServer from './dist-server/main';
import { createServerRenderer } from 'aspnet-prerendering';
import { createTransferScript } from '@nguniversal/aspnetcore-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { ngAspnetCoreEngine } from '@nguniversal/aspnetcore-engine';
import 'zone.js';


export default createServerRenderer(params => {

  const setupOptions = {
    appSelector: '<app-root></app-root>',
    ngModule: appServer.AppModuleNgFactory,
    request: params,
    providers: [
      provideModuleMap(appServer.LAZY_MODULE_MAP)
    ]
  };

  return ngAspnetCoreEngine(setupOptions).then(response => {

    response.globals.transferData = createTransferScript({
      fromDotnet: params.data.thisCameFromDotNET
    });

    return ({
      html: response.html,
      globals: response.globals
    });
  });
});
