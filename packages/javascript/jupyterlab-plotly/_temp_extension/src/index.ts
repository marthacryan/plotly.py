import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-plotly extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-plotly:plugin',
  description: 'The plotly Jupyter extension',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-plotly is activated!');
  }
};

export default plugin;
