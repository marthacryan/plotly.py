import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";

import { Application, IPlugin } from "@lumino/application";

import { Widget } from "@lumino/widgets";

import { MODULE_NAME, MODULE_VERSION } from "./version";

import { FigureModel, FigureView } from "./Figure";

/**
 * Activate the widget extension.
 */
function activateWidgetExtension(
  app: Application<Widget>,
  registry: IJupyterWidgetRegistry
): void {
  console.log('activateWidgetExtension here');
  registry.registerWidget({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    exports: {
        FigureModel,
        FigureView,
    } as any
  });
}

/**
 * The widget plugin.
 */
const widgetPlugin: IPlugin<Application<Widget>, void> = ({
  id: "jupyterlab-plotly",
  requires: [IJupyterWidgetRegistry],
  activate: activateWidgetExtension,
  autoStart: true,
} as unknown) as IPlugin<Application<Widget>, void>;

export default [widgetPlugin];
