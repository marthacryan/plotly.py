// packages/javascript/jupyterlab-plotly/src/Figure.ts
import _ from "https://esm.sh/lodash-es";
import Plotly from "https://esm.sh/plotly.js@2.33.0/dist/plotly";
window.PlotlyConfig = { MathJaxConfig: "local" };
var FigureModel = class {
  constructor(model, serializers2) {
    this.model = model;
    this.serializers = serializers2;
  }
  get(key) {
    const serializer = this.serializers[key];
    const update = this.model.get(key);
    if (serializer?.deserialize) {
      return serializer.deserialize(update);
    }
    return update;
  }
  set(key, value) {
    let serializer = this.serializers[key];
    if (serializer?.serialize) {
      value = serializer.serialize(value);
    }
    this.model.set(key, value);
  }
  on(event, cb) {
    this.model.on(event, cb);
  }
  save_changes() {
    this.model.save_changes();
  }
  defaults() {
    return {
      // Data and Layout
      // ---------------
      // The _data and _layout properties are synchronized with the
      // Python side on initialization only.  After initialization, these
      // properties are kept in sync through the use of the _py2js_*
      // messages
      _data: [],
      _layout: {},
      _config: {},
      // Python -> JS messages
      // ---------------------
      // Messages are implemented using trait properties. This is done so
      // that we can take advantage of ipywidget's binary serialization
      // protocol.
      //
      // Messages are sent by the Python side by assigning the message
      // contents to the appropriate _py2js_* property, and then immediately
      // setting it to None.  Messages are received by the JavaScript
      // side by registering property change callbacks in the initialize
      // methods for FigureModel and FigureView. e.g. (where this is a
      // FigureModel):
      //
      //      this.on('change:_py2js_addTraces', this.do_addTraces, this);
      //
      // Message handling methods, do_addTraces, are responsible for
      // performing the appropriate action if the message contents are
      // not null
      /**
       * @typedef {null|Object} Py2JsAddTracesMsg
       * @property {Array.<Object>} trace_data
       *  Array of traces to append to the end of the figure's current traces
       * @property {Number} trace_edit_id
       *  Edit ID to use when returning trace deltas using
       *  the _js2py_traceDeltas message.
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message.
       */
      _py2js_addTraces: null,
      /**
       * @typedef {null|Object} Py2JsDeleteTracesMsg
       * @property {Array.<Number>} delete_inds
       *  Array of indexes of traces to be deleted, in ascending order
       * @property {Number} trace_edit_id
       *  Edit ID to use when returning trace deltas using
       *  the _js2py_traceDeltas message.
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message.
       */
      _py2js_deleteTraces: null,
      /**
       * @typedef {null|Object} Py2JsMoveTracesMsg
       * @property {Array.<Number>} current_trace_inds
       *  Array of the current indexes of traces to be moved
       * @property {Array.<Number>} new_trace_inds
       *  Array of the new indexes that traces should be moved to.
       */
      _py2js_moveTraces: null,
      /**
       * @typedef {null|Object} Py2JsRestyleMsg
       * @property {Object} restyle_data
       *  Restyle data as accepted by Plotly.restyle
       * @property {null|Array.<Number>} restyle_traces
       *  Array of indexes of the traces that the resytle operation applies
       *  to, or null to apply the operation to all traces
       * @property {Number} trace_edit_id
       *  Edit ID to use when returning trace deltas using
       *  the _js2py_traceDeltas message
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message
       * @property {null|String} source_view_id
       *  view_id of the FigureView that triggered the original restyle
       *  event (e.g. by clicking the legend), or null if the restyle was
       *  triggered from Python
       */
      _py2js_restyle: null,
      /**
       * @typedef {null|Object} Py2JsRelayoutMsg
       * @property {Object} relayout_data
       *  Relayout data as accepted by Plotly.relayout
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message
       * @property {null|String} source_view_id
       *  view_id of the FigureView that triggered the original relayout
       *  event (e.g. by clicking the zoom button), or null if the
       *  relayout was triggered from Python
       */
      _py2js_relayout: null,
      /**
       * @typedef {null|Object} Py2JsUpdateMsg
       * @property {Object} style_data
       *  Style data as accepted by Plotly.update
       * @property {Object} layout_data
       *  Layout data as accepted by Plotly.update
       * @property {Array.<Number>} style_traces
       *  Array of indexes of the traces that the update operation applies
       *  to, or null to apply the operation to all traces
       * @property {Number} trace_edit_id
       *  Edit ID to use when returning trace deltas using
       *  the _js2py_traceDeltas message
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message
       * @property {null|String} source_view_id
       *  view_id of the FigureView that triggered the original update
       *  event (e.g. by clicking a button), or null if the update was
       *  triggered from Python
       */
      _py2js_update: null,
      /**
       * @typedef {null|Object} Py2JsAnimateMsg
       * @property {Object} style_data
       *  Style data as accepted by Plotly.animate
       * @property {Object} layout_data
       *  Layout data as accepted by Plotly.animate
       * @property {Array.<Number>} style_traces
       *  Array of indexes of the traces that the animate operation applies
       *  to, or null to apply the operation to all traces
       * @property {Object} animation_opts
       *  Animation options as accepted by Plotly.animate
       * @property {Number} trace_edit_id
       *  Edit ID to use when returning trace deltas using
       *  the _js2py_traceDeltas message
       * @property {Number} layout_edit_id
       *  Edit ID to use when returning layout deltas using
       *  the _js2py_layoutDelta message
       * @property {null|String} source_view_id
       *  view_id of the FigureView that triggered the original animate
       *  event (e.g. by clicking a button), or null if the update was
       *  triggered from Python
       */
      _py2js_animate: null,
      /**
       * @typedef {null|Object} Py2JsRemoveLayoutPropsMsg
       * @property {Array.<Array.<String|Number>>} remove_props
       *  Array of property paths to remove. Each propery path is an
       *  array of property names or array indexes that locate a property
       *  inside the _layout object
       */
      _py2js_removeLayoutProps: null,
      /**
       * @typedef {null|Object} Py2JsRemoveTracePropsMsg
       * @property {Number} remove_trace
       *  The index of the trace from which to remove properties
       * @property {Array.<Array.<String|Number>>} remove_props
       *  Array of property paths to remove. Each propery path is an
       *  array of property names or array indexes that locate a property
       *  inside the _data[remove_trace] object
       */
      _py2js_removeTraceProps: null,
      // JS -> Python messages
      // ---------------------
      // Messages are sent by the JavaScript side by assigning the
      // message contents to the appropriate _js2py_* property and then
      // calling the `touch` method on the view that triggered the
      // change. e.g. (where this is a FigureView):
      //
      //      this.model.set('_js2py_restyle', data);
      //      this.touch();
      //
      // The Python side is responsible for setting the property to None
      // after receiving the message.
      //
      // Message trigger logic is described in the corresponding
      // handle_plotly_* methods of FigureView
      /**
       * @typedef {null|Object} Js2PyRestyleMsg
       * @property {Object} style_data
       *  Style data that was passed to Plotly.restyle
       * @property {Array.<Number>} style_traces
       *  Array of indexes of the traces that the restyle operation
       *  was applied to, or null if applied to all traces
       * @property {String} source_view_id
       *  view_id of the FigureView that triggered the original restyle
       *  event (e.g. by clicking the legend)
       */
      _js2py_restyle: null,
      /**
       * @typedef {null|Object} Js2PyRelayoutMsg
       * @property {Object} relayout_data
       *  Relayout data that was passed to Plotly.relayout
       * @property {String} source_view_id
       *  view_id of the FigureView that triggered the original relayout
       *  event (e.g. by clicking the zoom button)
       */
      _js2py_relayout: null,
      /**
       * @typedef {null|Object} Js2PyUpdateMsg
       * @property {Object} style_data
       *  Style data that was passed to Plotly.update
       * @property {Object} layout_data
       *  Layout data that was passed to Plotly.update
       * @property {Array.<Number>} style_traces
       *  Array of indexes of the traces that the update operation applied
       *  to, or null if applied to all traces
       * @property {String} source_view_id
       *  view_id of the FigureView that triggered the original relayout
       *  event (e.g. by clicking the zoom button)
       */
      _js2py_update: null,
      /**
       * @typedef {null|Object} Js2PyLayoutDeltaMsg
       * @property {Object} layout_delta
       *  The layout delta object that contains all of the properties of
       *  _fullLayout that are not identical to those in the
       *  FigureModel's _layout property
       * @property {Number} layout_edit_id
       *  Edit ID of message that triggered the creation of layout delta
       */
      _js2py_layoutDelta: null,
      /**
       * @typedef {null|Object} Js2PyTraceDeltasMsg
       * @property {Array.<Object>} trace_deltas
       *  Array of trace delta objects. Each trace delta contains the
       *  trace's uid along with all of the properties of _fullData that
       *  are not identical to those in the FigureModel's _data property
       * @property {Number} trace_edit_id
       *  Edit ID of message that triggered the creation of trace deltas
       */
      _js2py_traceDeltas: null,
      /**
       * Object representing a collection of points for use in click, hover,
       * and selection events
       * @typedef {Object} Points
       * @property {Array.<Number>} trace_indexes
       *  Array of the trace index for each point
       * @property {Array.<Number>} point_indexes
       *  Array of the index of each point in its own trace
       * @property {null|Array.<Number>} xs
       *  Array of the x coordinate of each point (for cartesian trace types)
       *  or null (for non-cartesian trace types)
       * @property {null|Array.<Number>} ys
       *  Array of the y coordinate of each point (for cartesian trace types)
       *  or null (for non-cartesian trace types
       * @property {null|Array.<Number>} zs
       *  Array of the z coordinate of each point (for 3D cartesian
       *  trace types)
       *  or null (for non-3D-cartesian trace types)
       */
      /**
       * Object representing the state of the input devices during a
       * plotly event
       * @typedef {Object} InputDeviceState
       * @property {boolean} alt - true if alt key pressed,
       * false otherwise
       * @property {boolean} ctrl - true if ctrl key pressed,
       * false otherwise
       * @property {boolean} meta - true if meta key pressed,
       * false otherwise
       * @property {boolean} shift - true if shift key pressed,
       * false otherwise
       *
       * @property {boolean} button
       *  Indicates which button was pressed on the mouse to trigger the
       *  event.
       *    0: Main button pressed, usually the left button or the
       *       un-initialized state
       *    1: Auxiliary button pressed, usually the wheel button or
       *       the middle button (if present)
       *    2: Secondary button pressed, usually the right button
       *    3: Fourth button, typically the Browser Back button
       *    4: Fifth button, typically the Browser Forward button
       *
       * @property {boolean} buttons
       *  Indicates which buttons were pressed on the mouse when the event
       *  is triggered.
       *    0  : No button or un-initialized
       *    1  : Primary button (usually left)
       *    2  : Secondary button (usually right)
       *    4  : Auxilary button (usually middle or mouse wheel button)
       *    8  : 4th button (typically the "Browser Back" button)
       *    16 : 5th button (typically the "Browser Forward" button)
       *
       *  Combinations of buttons are represented by the sum of the codes
       *  above. e.g. a value of 7 indicates buttons 1 (primary),
       *  2 (secondary), and 4 (auxilary) were pressed during the event
       */
      /**
       * @typedef {Object} BoxSelectorState
       * @property {Array.<Number>} xrange
       *  Two element array containing the x-range of the box selection
       * @property {Array.<Number>} yrange
       *  Two element array containing the y-range of the box selection
       */
      /**
       * @typedef {Object} LassoSelectorState
       * @property {Array.<Number>} xs
       *  Array of the x-coordinates of the lasso selection region
       * @property {Array.<Number>} ys
       *  Array of the y-coordinates of the lasso selection region
       */
      /**
       * Object representing the state of the selection tool during a
       * plotly_select event
       * @typedef {Object} Selector
       * @property {String} type
       *  Selection type. One of: 'box', or 'lasso'
       * @property {BoxSelectorState|LassoSelectorState} selector_state
       */
      /**
       * @typedef {null|Object} Js2PyPointsCallbackMsg
       * @property {string} event_type
       *  Name of the triggering event. One of 'plotly_click',
       *  'plotly_hover', 'plotly_unhover', or 'plotly_selected'
       * @property {null|Points} points
       *  Points object for event
       * @property {null|InputDeviceState} device_state
       *  InputDeviceState object for event
       * @property {null|Selector} selector
       *  State of the selection tool for 'plotly_selected' events, null
       *  for other event types
       */
      _js2py_pointsCallback: null,
      // Message tracking
      // ----------------
      /**
       * @type {Number}
       * layout_edit_id of the last layout modification operation
       * requested by the Python side
       */
      _last_layout_edit_id: 0,
      /**
       * @type {Number}
       * trace_edit_id of the last trace modification operation
       * requested by the Python side
       */
      _last_trace_edit_id: 0
    };
  }
  /**
   * Initialize FigureModel. Called when the Python FigureWidget is first
   * constructed
   */
  initialize() {
    this.model.on("change:_data", () => this.do_data());
    this.model.on("change:_layout", () => this.do_layout());
    this.model.on("change:_py2js_addTraces", () => this.do_addTraces());
    this.model.on("change:_py2js_deleteTraces", () => this.do_deleteTraces());
    this.model.on("change:_py2js_moveTraces", () => this.do_moveTraces());
    this.model.on("change:_py2js_restyle", () => this.do_restyle());
    this.model.on("change:_py2js_relayout", () => this.do_relayout());
    this.model.on("change:_py2js_update", () => this.do_update());
    this.model.on("change:_py2js_animate", () => this.do_animate());
    this.model.on("change:_py2js_removeLayoutProps", () => this.do_removeLayoutProps());
    this.model.on("change:_py2js_removeTraceProps", () => this.do_removeTraceProps());
  }
  /**
   * Input a trace index specification and return an Array of trace
   * indexes where:
   *
   *  - null|undefined -> Array of all traces
   *  - Trace index as Number -> Single element array of input index
   *  - Array of trace indexes -> Input array unchanged
   *
   * @param {undefined|null|Number|Array.<Number>} trace_indexes
   * @returns {Array.<Number>}
   *  Array of trace indexes
   * @private
   */
  _normalize_trace_indexes(trace_indexes) {
    if (trace_indexes === null || trace_indexes === void 0) {
      var numTraces = this.model.get("_data").length;
      trace_indexes = _.range(numTraces);
    }
<<<<<<< Updated upstream
    if (!Array.isArray(trace_indexes)) {
      trace_indexes = [trace_indexes];
    }
    return trace_indexes;
=======
    if (trace_indexes !== void 0 && trace_indexes !== null && !Array.isArray(trace_indexes)) {
      trace_indexes = [trace_indexes];
    }
    return trace_indexes ?? [];
>>>>>>> Stashed changes
  }
  /**
   * Log changes to the _data trait
   *
   * This should only happed on FigureModel initialization
   */
  do_data() {
  }
  /**
   * Log changes to the _layout trait
   *
   * This should only happed on FigureModel initialization
   */
  do_layout() {
  }
  /**
   * Handle addTraces message
   */
  do_addTraces() {
    var msgData = this.model.get("_py2js_addTraces");
    if (msgData !== null) {
      var currentTraces = this.model.get("_data");
      var newTraces = msgData.trace_data;
      _.forEach(newTraces, function(newTrace) {
        currentTraces.push(newTrace);
      });
    }
  }
  /**
   * Handle deleteTraces message
   */
  do_deleteTraces() {
    var msgData = this.model.get("_py2js_deleteTraces");
    if (msgData !== null) {
      var delete_inds = msgData.delete_inds;
      var tracesData = this.model.get("_data");
      delete_inds.slice().reverse().forEach(function(del_ind) {
        tracesData.splice(del_ind, 1);
      });
    }
  }
  /**
   * Handle moveTraces message
   */
  do_moveTraces() {
    var msgData = this.model.get("_py2js_moveTraces");
    if (msgData !== null) {
      var tracesData = this.model.get("_data");
      var currentInds = msgData.current_trace_inds;
      var newInds = msgData.new_trace_inds;
      performMoveTracesLike(tracesData, currentInds, newInds);
    }
  }
  /**
   * Handle restyle message
   */
  do_restyle() {
    var msgData = this.model.get("_py2js_restyle");
    if (msgData !== null) {
      var restyleData = msgData.restyle_data;
      var restyleTraces = this._normalize_trace_indexes(msgData.restyle_traces);
      performRestyleLike(this.model.get("_data"), restyleData, restyleTraces);
    }
  }
  /**
   * Handle relayout message
   */
  do_relayout() {
    var msgData = this.model.get("_py2js_relayout");
    if (msgData !== null) {
      performRelayoutLike(this.model.get("_layout"), msgData.relayout_data);
    }
  }
  /**
   * Handle update message
   */
  do_update() {
    var msgData = this.model.get("_py2js_update");
    if (msgData !== null) {
      var style = msgData.style_data;
      var layout = msgData.layout_data;
      var styleTraces = this._normalize_trace_indexes(msgData.style_traces);
      performRestyleLike(this.model.get("_data"), style, styleTraces);
      performRelayoutLike(this.model.get("_layout"), layout);
    }
  }
  /**
   * Handle animate message
   */
  do_animate() {
    var msgData = this.model.get("_py2js_animate");
    if (msgData !== null) {
      var styles = msgData.style_data;
      var layout = msgData.layout_data;
      var trace_indexes = this._normalize_trace_indexes(msgData.style_traces);
      for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        var trace_index = trace_indexes[i];
        var trace = this.model.get("_data")[trace_index];
        performRelayoutLike(trace, style);
      }
      performRelayoutLike(this.model.get("_layout"), layout);
    }
  }
  /**
   * Handle removeLayoutProps message
   */
  do_removeLayoutProps() {
    var msgData = this.model.get(
      "_py2js_removeLayoutProps"
    );
    if (msgData !== null) {
      var keyPaths = msgData.remove_props;
      var layout = this.model.get("_layout");
      performRemoveProps(layout, keyPaths);
    }
  }
  /**
   * Handle removeTraceProps message
   */
  do_removeTraceProps() {
    var msgData = this.model.get("_py2js_removeTraceProps");
    if (msgData !== null) {
      var keyPaths = msgData.remove_props;
      var traceIndex = msgData.remove_trace;
      var trace = this.model.get("_data")[traceIndex];
      performRemoveProps(trace, keyPaths);
    }
  }
};
var serializers = {
  _data: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _layout: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_addTraces: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_deleteTraces: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_moveTraces: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_restyle: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_relayout: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_update: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_animate: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_removeLayoutProps: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _py2js_removeTraceProps: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_restyle: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_relayout: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_update: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_layoutDelta: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_traceDeltas: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  },
  _js2py_pointsCallback: {
    deserialize: py2js_deserializer,
    serialize: js2py_serializer
  }
};
var FigureView = class {
  constructor(model, el) {
<<<<<<< Updated upstream
=======
    this.viewID = "";
    this.resizeEventListener = () => {
    };
>>>>>>> Stashed changes
    this.model = model;
    this.el = el;
  }
  /**
   * The perform_render method is called by processLuminoMessage
   * after the widget's DOM element has been attached to the notebook
   * output cell. This happens after the initialize of the
   * FigureModel, and it won't happen at all if the Python FigureWidget
   * is never displayed in a notebook output cell
   */
  perform_render() {
    var that = this;
    this.model.on("change:_py2js_addTraces", () => this.do_addTraces());
    this.model.on("change:_py2js_deleteTraces", () => this.do_deleteTraces());
    this.model.on("change:_py2js_moveTraces", () => this.do_moveTraces());
    this.model.on("change:_py2js_restyle", () => this.do_restyle());
    this.model.on("change:_py2js_relayout", () => this.do_relayout());
    this.model.on("change:_py2js_update", () => this.do_update());
    this.model.on("change:_py2js_animate", () => this.do_animate());
    window?.MathJax?.Hub?.Config?.({ SVG: { font: "STIX-Web" } });
    var layout_edit_id = this.model.get("_last_layout_edit_id");
    var trace_edit_id = this.model.get("_last_trace_edit_id");
    this.viewID = randstr();
    var initialTraces = _.cloneDeep(this.model.get("_data"));
    var initialLayout = _.cloneDeep(this.model.get("_layout"));
    if (!initialLayout.height) {
      initialLayout.height = 360;
    }
    var config = this.model.get("_config");
    config.editSelection = false;
    Plotly.newPlot(that.el, initialTraces, initialLayout, config).then(
      function() {
        that._sendTraceDeltas(trace_edit_id);
        that._sendLayoutDelta(layout_edit_id);
        that.el.on("plotly_restyle", function(update) {
          that.handle_plotly_restyle(update);
        });
        that.el.on("plotly_relayout", function(update) {
          that.handle_plotly_relayout(update);
        });
<<<<<<< Updated upstream
        that.el.on("plotly_update", function(update) {
          that.handle_plotly_update(update);
        });
=======
>>>>>>> Stashed changes
        that.el.on("plotly_click", function(update) {
          that.handle_plotly_click(update);
        });
        that.el.on("plotly_hover", function(update) {
          that.handle_plotly_hover(update);
        });
        that.el.on("plotly_unhover", function(update) {
          that.handle_plotly_unhover(update);
        });
        that.el.on("plotly_selected", function(update) {
          that.handle_plotly_selected(update);
        });
<<<<<<< Updated upstream
        that.el.on("plotly_deselect", function(update) {
          that.handle_plotly_deselect(update);
        });
        that.el.on("plotly_doubleclick", function(update) {
          that.handle_plotly_doubleclick(update);
        });
=======
>>>>>>> Stashed changes
        var event = new CustomEvent("plotlywidget-after-render", {
          detail: { element: that.el, viewID: that.viewID }
        });
        document.dispatchEvent(event);
      }
    );
  }
  /**
   * Respond to Lumino events
   */
  _processLuminoMessage(msg, _super) {
    _super.apply(this, arguments);
    var that = this;
    switch (msg.type) {
      case "before-attach":
        var axisHidden = {
          showgrid: false,
          showline: false,
          tickvals: []
        };
        Plotly.newPlot(that.el, [], {
          xaxis: axisHidden,
          yaxis: axisHidden
        });
        this.resizeEventListener = () => {
          this.autosizeFigure();
        };
        window.addEventListener("resize", this.resizeEventListener);
        break;
      case "after-attach":
        this.perform_render();
        break;
      case "after-show":
      case "resize":
        this.autosizeFigure();
        break;
    }
  }
  // processPhosphorMessage(msg: any) {
  //   this._processLuminoMessage(msg, super["processPhosphorMessage"]);
  // }
  // processLuminoMessage(msg: any) {
  //   this._processLuminoMessage(msg, super["processLuminoMessage"]);
  // }
  autosizeFigure() {
    var that = this;
    var layout = that.model.get("_layout");
    if (_.isNil(layout) || _.isNil(layout.width)) {
      Plotly.Plots.resize(that.el).then(function() {
        var layout_edit_id = that.model.get("_last_layout_edit_id");
        that._sendLayoutDelta(layout_edit_id);
      });
    }
  }
  /**
   * Purge Plotly.js data structures from the notebook output display
   * element when the view is destroyed
   */
  remove() {
    Plotly.purge(this.el);
    window.removeEventListener("resize", this.resizeEventListener);
  }
  /**
   * Return the figure's _fullData array merged with its data array
   *
   * The merge ensures that for any properties that el._fullData and
   * el.data have in common, we return the version from el.data
   *
   * Named colorscales are one example of why this is needed. The el.data
   * array will hold named colorscale strings (e.g. 'Viridis'), while the
   * el._fullData array will hold the actual colorscale array. e.g.
   *
   *      el.data[0].marker.colorscale == 'Viridis' but
   *      el._fullData[0].marker.colorscale = [[..., ...], ...]
   *
   * Performing the merge allows our FigureModel to retain the 'Viridis'
   * string, rather than having it overridded by the colorscale array.
   *
   */
  getFullData() {
<<<<<<< Updated upstream
    return _.mergeWith(
      {},
      this.el._fullData,
      this.el.data,
      fullMergeCustomizer
    );
=======
    return this.el.dataset;
>>>>>>> Stashed changes
  }
  /**
   * Return the figure's _fullLayout object merged with its layout object
   *
   * See getFullData documentation for discussion of why the merge is
   * necessary
   */
  getFullLayout() {
<<<<<<< Updated upstream
    return _.mergeWith(
      {},
      this.el._fullLayout,
      this.el.layout,
      fullMergeCustomizer
    );
=======
    return {};
>>>>>>> Stashed changes
  }
  /**
   * Build Points data structure from data supplied by the plotly_click,
   * plotly_hover, or plotly_select events
   * @param {Object} data
   * @returns {null|Points}
   */
  buildPointsObject(data) {
    var pointsObject;
    if (data.hasOwnProperty("points")) {
      var pointObjects = data["points"];
      var numPoints = pointObjects.length;
      var hasNestedPointObjects = true;
      for (let i = 0; i < numPoints; i++) {
        hasNestedPointObjects = hasNestedPointObjects && pointObjects[i].hasOwnProperty("pointNumbers");
        if (!hasNestedPointObjects) break;
      }
      var numPointNumbers = numPoints;
      if (hasNestedPointObjects) {
        numPointNumbers = 0;
        for (let i = 0; i < numPoints; i++) {
          numPointNumbers += pointObjects[i]["pointNumbers"].length;
        }
      }
      pointsObject = {
        trace_indexes: new Array(numPointNumbers),
        point_indexes: new Array(numPointNumbers),
        xs: new Array(numPointNumbers),
        ys: new Array(numPointNumbers)
      };
      if (hasNestedPointObjects) {
        var flatPointIndex = 0;
        for (var p = 0; p < numPoints; p++) {
          for (let i = 0; i < pointObjects[p]["pointNumbers"].length; i++, flatPointIndex++) {
            pointsObject["point_indexes"][flatPointIndex] = pointObjects[p]["pointNumbers"][i];
            pointsObject["xs"][flatPointIndex] = pointObjects[p]["x"];
            pointsObject["ys"][flatPointIndex] = pointObjects[p]["y"];
            pointsObject["trace_indexes"][flatPointIndex] = pointObjects[p]["curveNumber"];
          }
        }
        let single_trace = true;
        for (let i = 1; i < numPointNumbers; i++) {
          single_trace = single_trace && pointsObject["trace_indexes"][i - 1] === pointsObject["trace_indexes"][i];
          if (!single_trace) break;
        }
        if (single_trace) {
          pointsObject["point_indexes"].sort(function(a, b) {
            return a - b;
          });
        }
      } else {
        for (var p = 0; p < numPoints; p++) {
          pointsObject["trace_indexes"][p] = pointObjects[p]["curveNumber"];
          pointsObject["point_indexes"][p] = pointObjects[p]["pointNumber"];
          pointsObject["xs"][p] = pointObjects[p]["x"];
          pointsObject["ys"][p] = pointObjects[p]["y"];
        }
      }
      var hasZ = pointObjects[0] !== void 0 && pointObjects[0].hasOwnProperty("z");
      if (hasZ) {
        pointsObject["zs"] = new Array(numPoints);
        for (p = 0; p < numPoints; p++) {
          pointsObject["zs"][p] = pointObjects[p]["z"];
        }
      }
      return pointsObject;
    } else {
      return null;
    }
  }
  /**
   * Build InputDeviceState data structure from data supplied by the
   * plotly_click, plotly_hover, or plotly_select events
   * @param {Object} data
   * @returns {null|InputDeviceState}
   */
  buildInputDeviceStateObject(data) {
    var event = data["event"];
    if (event === void 0) {
      return null;
    } else {
      var inputDeviceState = {
        // Keyboard modifiers
        alt: event["altKey"],
        ctrl: event["ctrlKey"],
        meta: event["metaKey"],
        shift: event["shiftKey"],
        // Mouse buttons
        button: event["button"],
        buttons: event["buttons"]
      };
      return inputDeviceState;
    }
  }
  /**
   * Build Selector data structure from data supplied by the
   * plotly_select event
   * @param data
   * @returns {null|Selector}
   */
  buildSelectorObject(data) {
    var selectorObject;
    if (data.hasOwnProperty("range")) {
      selectorObject = {
        type: "box",
        selector_state: {
          xrange: data["range"]["x"],
          yrange: data["range"]["y"]
        }
      };
    } else if (data.hasOwnProperty("lassoPoints")) {
      selectorObject = {
        type: "lasso",
        selector_state: {
          xs: data["lassoPoints"]["x"],
          ys: data["lassoPoints"]["y"]
        }
      };
    } else {
      selectorObject = null;
    }
    return selectorObject;
  }
  /**
   * Handle ploty_restyle events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_restyle(data) {
    if (data === null || data === void 0) {
      return;
    }
    if (data[0] && data[0].hasOwnProperty("_doNotReportToPy")) {
      return;
    }
    var styleData = data[0];
    var styleTraces = data[1];
    var restyleMsg = {
      style_data: styleData,
      style_traces: styleTraces,
      source_view_id: this.viewID
    };
    this.model.set("_js2py_restyle", restyleMsg);
    this.touch();
  }
  touch() {
    this.model.save_changes();
  }
  /**
   * Handle plotly_relayout events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_relayout(data) {
    if (data === null || data === void 0) {
      return;
    }
    if (data.hasOwnProperty("_doNotReportToPy")) {
      return;
    }
    var relayoutMsg = {
      relayout_data: data,
      source_view_id: this.viewID
    };
    this.model.set("_js2py_relayout", relayoutMsg);
    this.touch();
  }
  /**
   * Handle plotly_update events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_update(data) {
    if (data === null || data === void 0) {
      return;
    }
    if (data["data"] && data["data"][0].hasOwnProperty("_doNotReportToPy")) {
      return;
    }
    var updateMsg = {
      style_data: data["data"][0],
      style_traces: data["data"][1],
      layout_data: data["layout"],
      source_view_id: this.viewID
    };
    this.model.set("_js2py_update", updateMsg);
    this.touch();
  }
  /**
   * Handle plotly_click events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_click(data) {
    this._send_points_callback_message(data, "plotly_click");
  }
  /**
   * Handle plotly_hover events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_hover(data) {
    this._send_points_callback_message(data, "plotly_hover");
  }
  /**
   * Handle plotly_unhover events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_unhover(data) {
    this._send_points_callback_message(data, "plotly_unhover");
  }
  /**
   * Handle plotly_selected events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_selected(data) {
    this._send_points_callback_message(data, "plotly_selected");
  }
  /**
   * Handle plotly_deselect events emitted by the Plotly.js library
   * @param data
   */
  handle_plotly_deselect(data) {
    data = {
      points: []
    };
    this._send_points_callback_message(data, "plotly_deselect");
  }
  /**
   * Build and send a points callback message to the Python side
   *
   * @param {Object} data
   *  data object as provided by the plotly_click, plotly_hover,
   *  plotly_unhover, or plotly_selected events
   * @param {String} event_type
   *  Name of the triggering event. One of 'plotly_click',
   *  'plotly_hover', 'plotly_unhover', or 'plotly_selected'
   * @private
   */
  _send_points_callback_message(data, event_type) {
    if (data === null || data === void 0) {
      return;
    }
    var pointsMsg = {
      event_type,
      points: this.buildPointsObject(data),
      device_state: this.buildInputDeviceStateObject(data),
      selector: this.buildSelectorObject(data)
    };
    if (pointsMsg["points"] !== null && pointsMsg["points"] !== void 0) {
      this.model.set("_js2py_pointsCallback", pointsMsg);
      this.touch();
    }
  }
  /**
   * Stub for future handling of plotly_doubleclick
   * @param data
   */
  handle_plotly_doubleclick(data) {
  }
  /**
   * Handle Plotly.addTraces request
   */
  do_addTraces() {
    var msgData = this.model.get("_py2js_addTraces");
    if (msgData !== null) {
      var that = this;
      Plotly.addTraces(this.el, msgData.trace_data).then(function() {
        that._sendTraceDeltas(msgData.trace_edit_id);
        var layout_edit_id = msgData.layout_edit_id;
        that._sendLayoutDelta(layout_edit_id);
      });
    }
  }
  /**
   * Handle Plotly.deleteTraces request
   */
  do_deleteTraces() {
    var msgData = this.model.get("_py2js_deleteTraces");
    if (msgData !== null) {
      var delete_inds = msgData.delete_inds;
      var that = this;
      Plotly.deleteTraces(this.el, delete_inds).then(function() {
        var trace_edit_id = msgData.trace_edit_id;
        that._sendTraceDeltas(trace_edit_id);
        var layout_edit_id = msgData.layout_edit_id;
        that._sendLayoutDelta(layout_edit_id);
      });
    }
  }
  /**
   * Handle Plotly.moveTraces request
   */
  do_moveTraces() {
    var msgData = this.model.get("_py2js_moveTraces");
    if (msgData !== null) {
      var currentInds = msgData.current_trace_inds;
      var newInds = msgData.new_trace_inds;
      var inds_equal = _.isEqual(currentInds, newInds);
      if (!inds_equal) {
        Plotly.moveTraces(this.el, currentInds, newInds);
      }
    }
  }
  /**
   * Handle Plotly.restyle request
   */
  do_restyle() {
    var msgData = this.model.get("_py2js_restyle");
    if (msgData !== null) {
      var restyleData = msgData.restyle_data;
      var traceIndexes = this.model._normalize_trace_indexes(
        msgData.restyle_traces
      );
      restyleData["_doNotReportToPy"] = true;
      Plotly.restyle(this.el, restyleData, traceIndexes);
      this._sendTraceDeltas(msgData.trace_edit_id);
      var layout_edit_id = msgData.layout_edit_id;
      this._sendLayoutDelta(layout_edit_id);
    }
  }
  /**
   * Handle Plotly.relayout request
   */
  do_relayout() {
    var msgData = this.model.get("_py2js_relayout");
    if (msgData !== null) {
      if (msgData.source_view_id !== this.viewID) {
        var relayoutData = msgData.relayout_data;
        relayoutData["_doNotReportToPy"] = true;
        Plotly.relayout(this.el, msgData.relayout_data);
      }
      var layout_edit_id = msgData.layout_edit_id;
      this._sendLayoutDelta(layout_edit_id);
    }
  }
  /**
   * Handle Plotly.update request
   */
  do_update() {
    var msgData = this.model.get("_py2js_update");
    if (msgData !== null) {
      var style = msgData.style_data || {};
      var layout = msgData.layout_data || {};
      var traceIndexes = this.model._normalize_trace_indexes(
        msgData.style_traces
      );
      style["_doNotReportToPy"] = true;
      Plotly.update(this.el, style, layout, traceIndexes);
      this._sendTraceDeltas(msgData.trace_edit_id);
      var layout_edit_id = msgData.layout_edit_id;
      this._sendLayoutDelta(layout_edit_id);
    }
  }
  /**
   * Handle Plotly.animate request
   */
  do_animate() {
    var msgData = this.model.get("_py2js_animate");
    if (msgData !== null) {
      var animationOpts = msgData.animation_opts;
      var styles = msgData.style_data;
      var layout = msgData.layout_data;
      var traceIndexes = this.model._normalize_trace_indexes(
        msgData.style_traces
      );
      var animationData = {
        data: styles,
        layout,
        traces: traceIndexes
      };
      animationData["_doNotReportToPy"] = true;
      var that = this;
      Plotly.animate(this.el, animationData, animationOpts).then(function() {
        that._sendTraceDeltas(msgData.trace_edit_id);
        var layout_edit_id = msgData.layout_edit_id;
        that._sendLayoutDelta(layout_edit_id);
      });
    }
  }
  /**
   * Construct layout delta object and send layoutDelta message to the
   * Python side
   *
   * @param layout_edit_id
   *  Edit ID of message that triggered the creation of the layout delta
   * @private
   */
  _sendLayoutDelta(layout_edit_id) {
    var layout_delta = createDeltaObject(
      this.getFullLayout(),
      this.model.get("_layout")
    );
    var layoutDeltaMsg = {
      layout_delta,
      layout_edit_id
    };
    this.model.set("_js2py_layoutDelta", layoutDeltaMsg);
    this.touch();
  }
  /**
   * Construct trace deltas array for the requested trace indexes and
   * send traceDeltas message to the Python side
   *  Array of indexes of traces for which to compute deltas
   * @param trace_edit_id
   *  Edit ID of message that triggered the creation of trace deltas
   * @private
   */
  _sendTraceDeltas(trace_edit_id) {
    var trace_data = this.model.get("_data");
    var traceIndexes = _.range(trace_data.length);
    var trace_deltas = new Array(traceIndexes.length);
    var fullData = this.getFullData();
    for (var i = 0; i < traceIndexes.length; i++) {
      var traceInd = traceIndexes[i];
      trace_deltas[i] = createDeltaObject(
        fullData[traceInd],
        trace_data[traceInd]
      );
    }
    var traceDeltasMsg = {
      trace_deltas,
      trace_edit_id
    };
    this.model.set("_js2py_traceDeltas", traceDeltasMsg);
    this.touch();
  }
};
var numpy_dtype_to_typedarray_type = {
  int8: Int8Array,
  int16: Int16Array,
  int32: Int32Array,
  uint8: Uint8Array,
  uint16: Uint16Array,
  uint32: Uint32Array,
  float32: Float32Array,
  float64: Float64Array
};
function serializeTypedArray(v) {
  var numpyType;
  if (v instanceof Int8Array) {
    numpyType = "int8";
  } else if (v instanceof Int16Array) {
    numpyType = "int16";
  } else if (v instanceof Int32Array) {
    numpyType = "int32";
  } else if (v instanceof Uint8Array) {
    numpyType = "uint8";
  } else if (v instanceof Uint16Array) {
    numpyType = "uint16";
  } else if (v instanceof Uint32Array) {
    numpyType = "uint32";
  } else if (v instanceof Float32Array) {
    numpyType = "float32";
  } else if (v instanceof Float64Array) {
    numpyType = "float64";
  } else {
    return v;
  }
  var res = {
    dtype: numpyType,
    shape: [v.length],
    value: v.buffer
  };
  return res;
}
function js2py_serializer(v, widgetManager) {
  var res;
  if (_.isTypedArray(v)) {
    res = serializeTypedArray(v);
  } else if (Array.isArray(v)) {
    res = new Array(v.length);
    for (var i = 0; i < v.length; i++) {
      res[i] = js2py_serializer(v[i]);
    }
  } else if (_.isPlainObject(v)) {
    res = {};
    for (var p in v) {
      if (v.hasOwnProperty(p)) {
        res[p] = js2py_serializer(v[p]);
      }
    }
  } else if (v === void 0) {
    res = "_undefined_";
  } else {
    res = v;
  }
  return res;
}
function py2js_deserializer(v, widgetManager) {
  var res;
  if (Array.isArray(v)) {
    res = new Array(v.length);
    for (var i = 0; i < v.length; i++) {
      res[i] = py2js_deserializer(v[i]);
    }
  } else if (_.isPlainObject(v)) {
    if ((_.has(v, "value") || _.has(v, "buffer")) && _.has(v, "dtype") && _.has(v, "shape")) {
      var typedarray_type = numpy_dtype_to_typedarray_type[v.dtype];
      var buffer = _.has(v, "value") ? v.value.buffer : v.buffer.buffer;
      res = new typedarray_type(buffer);
    } else {
      res = {};
      for (var p in v) {
        if (v.hasOwnProperty(p)) {
          res[p] = py2js_deserializer(v[p]);
        }
      }
    }
  } else if (v === "_undefined_") {
    res = void 0;
  } else {
    res = v;
  }
  return res;
}
<<<<<<< Updated upstream
function isTypedArray(potentialTypedArray) {
  return ArrayBuffer.isView(potentialTypedArray) && !(potentialTypedArray instanceof DataView);
}
function fullMergeCustomizer(objValue, srcValue, key) {
  if (key[0] === "_") {
    return null;
  } else if (isTypedArray(srcValue)) {
    return srcValue;
  }
}
=======
>>>>>>> Stashed changes
function performRelayoutLike(parentObj, relayoutData) {
  for (var rawKey in relayoutData) {
    if (!relayoutData.hasOwnProperty(rawKey)) {
      continue;
    }
    var relayoutVal = relayoutData[rawKey];
    if (relayoutVal === null) {
      _.unset(parentObj, rawKey);
    } else {
      _.set(parentObj, rawKey, relayoutVal);
    }
  }
}
function performRestyleLike(parentArray, restyleData, restyleTraces) {
  for (var rawKey in restyleData) {
    if (!restyleData.hasOwnProperty(rawKey)) {
      continue;
    }
    var valArray = restyleData[rawKey];
    if (!Array.isArray(valArray)) {
      valArray = [valArray];
    }
    for (var i = 0; i < restyleTraces.length; i++) {
      var traceInd = restyleTraces[i];
      var trace = parentArray[traceInd];
      var singleVal = valArray[i % valArray.length];
      if (singleVal === null) {
        _.unset(trace, rawKey);
      } else if (singleVal !== void 0) {
        _.set(trace, rawKey, singleVal);
      }
    }
  }
}
function performMoveTracesLike(parentArray, currentInds, newInds) {
  var movingTracesData = [];
  for (var ci = currentInds.length - 1; ci >= 0; ci--) {
    movingTracesData.splice(0, 0, parentArray[currentInds[ci]]);
    parentArray.splice(currentInds[ci], 1);
  }
  var newIndexSortedArrays = _(newInds).zip(movingTracesData).sortBy(0).unzip().value();
  newInds = newIndexSortedArrays[0];
  movingTracesData = newIndexSortedArrays[1];
  for (var ni = 0; ni < newInds.length; ni++) {
    parentArray.splice(newInds[ni], 0, movingTracesData[ni]);
  }
}
function performRemoveProps(parentObj, keyPaths) {
  for (var i = 0; i < keyPaths.length; i++) {
    var keyPath = keyPaths[i];
    _.unset(parentObj, keyPath);
  }
}
function createDeltaObject(fullObj, removeObj) {
  var res;
  if (Array.isArray(fullObj)) {
    res = new Array(fullObj.length);
  } else {
    res = {};
  }
  if (removeObj === null || removeObj === void 0) {
    removeObj = {};
  }
  for (var p in fullObj) {
    if (p[0] !== "_" && // Don't consider private properties
    fullObj.hasOwnProperty(p) && // Exclude parent properties
    fullObj[p] !== null) {
      var props_equal;
      props_equal = _.isEqual(fullObj[p], removeObj[p]);
      if (!props_equal || p === "uid") {
        var fullVal = fullObj[p];
        if (removeObj.hasOwnProperty(p) && typeof fullVal === "object") {
          if (Array.isArray(fullVal)) {
            if (fullVal.length > 0 && typeof fullVal[0] === "object") {
              res[p] = new Array(fullVal.length);
              for (var i = 0; i < fullVal.length; i++) {
                if (!Array.isArray(removeObj[p]) || removeObj[p].length <= i) {
                  res[p][i] = fullVal[i];
                } else {
                  res[p][i] = createDeltaObject(fullVal[i], removeObj[p][i]);
                }
              }
            } else {
              res[p] = fullVal;
            }
          } else {
            var full_obj = createDeltaObject(fullVal, removeObj[p]);
            if (Object.keys(full_obj).length > 0) {
              res[p] = full_obj;
            }
          }
        } else if (typeof fullVal === "object" && !Array.isArray(fullVal)) {
          res[p] = createDeltaObject(fullVal, {});
        } else if (fullVal !== void 0 && typeof fullVal !== "function") {
          res[p] = fullVal;
        }
      }
    }
  }
  return res;
}
function randstr(existing, bits, base, _recursion) {
  if (!base) base = 16;
  if (bits === void 0) bits = 24;
  if (bits <= 0) return "0";
  var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
  var res = "";
  var i, b, x;
  for (i = 2; digits === Infinity; i *= 2) {
    digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
  }
  var rem = digits - Math.floor(digits);
  for (i = 0; i < Math.floor(digits); i++) {
    x = Math.floor(Math.random() * base).toString(base);
    res = x + res;
  }
  if (rem) {
    b = Math.pow(base, rem);
    x = Math.floor(Math.random() * b).toString(base);
    res = x + res;
  }
  var parsed = parseInt(res, base);
  if (existing && existing[res] || parsed !== Infinity && parsed >= Math.pow(2, bits)) {
<<<<<<< Updated upstream
    if (_recursion > 10) {
=======
    if ((_recursion ?? 0) > 10) {
>>>>>>> Stashed changes
      console.warn("randstr failed uniqueness");
      return res;
    }
    return randstr(existing, bits, base, (_recursion || 0) + 1);
  } else return res;
}
var Figure_default = () => {
  let model;
  return {
    initialize(ctx) {
      model = new FigureModel(ctx.model, serializers);
      model.initialize();
    },
    render({ el }) {
      const view = new FigureView(model, el);
      view.perform_render();
      return () => view.remove();
    }
  };
};
export {
  FigureModel,
  FigureView,
  Figure_default as default
};
<<<<<<< Updated upstream
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvamF2YXNjcmlwdC9qdXB5dGVybGFiLXBsb3RseS9zcmMvRmlndXJlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IERPTVdpZGdldE1vZGVsIH0gZnJvbSBcIkBqdXB5dGVyLXdpZGdldHMvYmFzZVwiO1xuaW1wb3J0IF8gZnJvbSBcImh0dHBzOi8vZXNtLnNoL2xvZGFzaC1lc1wiO1xuaW1wb3J0IFBsb3RseSBmcm9tIFwiaHR0cHM6Ly9lc20uc2gvcGxvdGx5LmpzQDIuMzMuMC9kaXN0L3Bsb3RseVwiO1xuXG4vLyBAdHMtaWdub3JlXG53aW5kb3cuUGxvdGx5Q29uZmlnID0geyBNYXRoSmF4Q29uZmlnOiBcImxvY2FsXCIgfTtcblxudHlwZSBJbnB1dERldmljZVN0YXRlID0ge1xuICBhbHQ6IGFueTtcbiAgY3RybDogYW55O1xuICBtZXRhOiBhbnk7XG4gIHNoaWZ0OiBhbnk7XG4gIGJ1dHRvbjogYW55O1xuICBidXR0b25zOiBhbnk7XG59O1xuXG50eXBlIEpzMlB5TGF5b3V0RGVsdGFNc2cgPSB7XG4gIGxheW91dF9kZWx0YTogYW55O1xuICBsYXlvdXRfZWRpdF9pZDogYW55O1xufTtcblxudHlwZSBKczJQeU1zZyA9IHtcbiAgc291cmNlX3ZpZXdfaWQ6IHN0cmluZztcbn07XG5cbnR5cGUgSnMyUHlQb2ludHNDYWxsYmFja01zZyA9IHtcbiAgZXZlbnRfdHlwZTogc3RyaW5nO1xuICBwb2ludHM6IFBvaW50cztcbiAgZGV2aWNlX3N0YXRlOiBJbnB1dERldmljZVN0YXRlO1xuICBzZWxlY3RvcjogU2VsZWN0b3I7XG59O1xuXG50eXBlIEpzMlB5UmVsYXlvdXRNc2cgPSBKczJQeU1zZyAmIHtcbiAgcmVsYXlvdXRfZGF0YTogYW55O1xufTtcblxudHlwZSBKczJQeVJlc3R5bGVNc2cgPSBKczJQeU1zZyAmIHtcbiAgc3R5bGVfZGF0YTogYW55O1xuICBzdHlsZV90cmFjZXM/OiBudWxsIHwgbnVtYmVyIHwgbnVtYmVyW107XG59O1xuXG50eXBlIEpzMlB5VHJhY2VEZWx0YXNNc2cgPSB7XG4gIHRyYWNlX2RlbHRhczogYW55O1xuICB0cmFjZV9lZGl0X2lkOiBhbnk7XG59O1xuXG50eXBlIEpzMlB5VXBkYXRlTXNnID0gSnMyUHlNc2cgJiB7XG4gIHN0eWxlX2RhdGE6IGFueTtcbiAgbGF5b3V0X2RhdGE6IGFueTtcbiAgc3R5bGVfdHJhY2VzPzogbnVsbCB8IG51bWJlciB8IG51bWJlcltdO1xufTtcblxudHlwZSBQb2ludHMgPSB7XG4gIHRyYWNlX2luZGV4ZXM6IG51bWJlcltdO1xuICBwb2ludF9pbmRleGVzOiBudW1iZXJbXTtcbiAgeHM6IG51bWJlcltdO1xuICB5czogbnVtYmVyW107XG4gIHpzPzogbnVtYmVyW107XG59O1xuXG50eXBlIFB5MkpzTXNnID0ge1xuICB0cmFjZV9lZGl0X2lkPzogYW55O1xuICBsYXlvdXRfZWRpdF9pZD86IGFueTtcbiAgc291cmNlX3ZpZXdfaWQ/OiBhbnk7XG59O1xuXG50eXBlIFB5MkpzQWRkVHJhY2VzTXNnID0gUHkySnNNc2cgJiB7XG4gIHRyYWNlX2RhdGE6IGFueTtcbn07XG5cbnR5cGUgUHkySnNBbmltYXRlTXNnID0gUHkySnNNc2cgJiB7XG4gIHN0eWxlX2RhdGE6IGFueTtcbiAgbGF5b3V0X2RhdGE6IGFueTtcbiAgc3R5bGVfdHJhY2VzPzogbnVsbCB8IG51bWJlciB8IG51bWJlcltdO1xuICBhbmltYXRpb25fb3B0cz86IGFueTtcbn07XG5cbnR5cGUgUHkySnNEZWxldGVUcmFjZXNNc2cgPSBQeTJKc01zZyAmIHtcbiAgZGVsZXRlX2luZHM6IG51bWJlcltdO1xufTtcblxudHlwZSBQeTJKc01vdmVUcmFjZXNNc2cgPSB7XG4gIGN1cnJlbnRfdHJhY2VfaW5kczogbnVtYmVyW107XG4gIG5ld190cmFjZV9pbmRzOiBudW1iZXJbXTtcbn07XG5cbnR5cGUgUHkySnNSZXN0eWxlTXNnID0gUHkySnNNc2cgJiB7XG4gIHJlc3R5bGVfZGF0YTogYW55O1xuICByZXN0eWxlX3RyYWNlcz86IG51bGwgfCBudW1iZXIgfCBudW1iZXJbXTtcbn07XG5cbnR5cGUgUHkySnNSZWxheW91dE1zZyA9IFB5MkpzTXNnICYge1xuICByZWxheW91dF9kYXRhOiBhbnk7XG59O1xuXG50eXBlIFB5MkpzUmVtb3ZlTGF5b3V0UHJvcHNNc2cgPSB7XG4gIHJlbW92ZV9wcm9wczogYW55O1xufTtcblxudHlwZSBQeTJKc1JlbW92ZVRyYWNlUHJvcHNNc2cgPSB7XG4gIHJlbW92ZV9wcm9wczogYW55O1xuICByZW1vdmVfdHJhY2U6IGFueTtcbn07XG5cbnR5cGUgUHkySnNVcGRhdGVNc2cgPSBQeTJKc01zZyAmIHtcbiAgc3R5bGVfZGF0YTogYW55O1xuICBsYXlvdXRfZGF0YTogYW55O1xuICBzdHlsZV90cmFjZXM/OiBudWxsIHwgbnVtYmVyIHwgbnVtYmVyW107XG59O1xuXG50eXBlIFNlbGVjdG9yID0ge1xuICB0eXBlOiBcImJveFwiIHwgXCJsYXNzb1wiO1xuICBzZWxlY3Rvcl9zdGF0ZTpcbiAgICB8IHsgeHJhbmdlOiBudW1iZXJbXTsgeXJhbmdlOiBudW1iZXJbXSB9XG4gICAgfCB7IHhzOiBudW1iZXJbXTsgeXM6IG51bWJlcltdIH07XG59O1xuXG4vLyBNb2RlbFxuLy8gPT09PT1cbi8qKlxuICogQSBGaWd1cmVNb2RlbCBob2xkcyBhIG1pcnJvciBjb3B5IG9mIHRoZSBzdGF0ZSBvZiBhIEZpZ3VyZVdpZGdldCBvblxuICogdGhlIFB5dGhvbiBzaWRlLiAgVGhlcmUgaXMgYSBvbmUtdG8tb25lIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIEphdmFTY3JpcHRcbiAqIEZpZ3VyZU1vZGVscyBhbmQgUHl0aG9uIEZpZ3VyZVdpZGdldHMuIFRoZSBKYXZhU2NyaXB0IEZpZ3VyZU1vZGVsIGlzXG4gKiBpbml0aWFsaXplZCBhcyBzb29uIGFzIGEgUHl0aG9uIEZpZ3VyZVdpZGdldCBpbml0aWFsaXplZCwgdGhpcyBoYXBwZW5zXG4gKiBldmVuIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGZpcnN0IGRpc3BsYXllZCBpbiB0aGUgTm90ZWJvb2tcbiAqIEB0eXBlIHt3aWRnZXRzLkRPTVdpZGdldE1vZGVsfVxuICovXG5cbnR5cGUgU2VyaWFsaXplcjxJbj1hbnksIE91dD1hbnk+ID0ge1xuICBkZXNlcmlhbGl6ZSh2YWx1ZTogT3V0KTogSW47XG4gIHNlcmlhbGl6ZSh2YWx1ZTogSW4pOiBPdXQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGaWd1cmVNb2RlbCB7XG4gIG1vZGVsOiBET01XaWRnZXRNb2RlbDtcbiAgc2VyaWFsaXplcnM6IFJlY29yZDxzdHJpbmcsIFNlcmlhbGl6ZXI+XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IERPTVdpZGdldE1vZGVsLCBzZXJpYWxpemVyczogUmVjb3JkPHN0cmluZywgU2VyaWFsaXplcj4pIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5zZXJpYWxpemVycyA9IHNlcmlhbGl6ZXJzO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc2VyaWFsaXplciA9IHRoaXMuc2VyaWFsaXplcnNba2V5XTtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLm1vZGVsLmdldChrZXkpXG4gICAgaWYgKHNlcmlhbGl6ZXI/LmRlc2VyaWFsaXplKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplci5kZXNlcmlhbGl6ZSh1cGRhdGUpXG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gICAgbGV0IHNlcmlhbGl6ZXIgPSB0aGlzLnNlcmlhbGl6ZXJzW2tleV07XG4gICAgaWYgKHNlcmlhbGl6ZXI/LnNlcmlhbGl6ZSkge1xuICAgICAgdmFsdWUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZSh2YWx1ZSlcbiAgICB9XG4gICAgdGhpcy5tb2RlbC5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNiPzogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMubW9kZWwub24oZXZlbnQsIGNiKTtcbiAgfVxuXG4gIHNhdmVfY2hhbmdlcygpIHtcbiAgICB0aGlzLm1vZGVsLnNhdmVfY2hhbmdlcygpO1xuICB9XG5cbiAgZGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcblxuICAgICAgLy8gRGF0YSBhbmQgTGF5b3V0XG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFRoZSBfZGF0YSBhbmQgX2xheW91dCBwcm9wZXJ0aWVzIGFyZSBzeW5jaHJvbml6ZWQgd2l0aCB0aGVcbiAgICAgIC8vIFB5dGhvbiBzaWRlIG9uIGluaXRpYWxpemF0aW9uIG9ubHkuICBBZnRlciBpbml0aWFsaXphdGlvbiwgdGhlc2VcbiAgICAgIC8vIHByb3BlcnRpZXMgYXJlIGtlcHQgaW4gc3luYyB0aHJvdWdoIHRoZSB1c2Ugb2YgdGhlIF9weTJqc18qXG4gICAgICAvLyBtZXNzYWdlc1xuICAgICAgX2RhdGE6IFtdLFxuICAgICAgX2xheW91dDoge30sXG4gICAgICBfY29uZmlnOiB7fSxcblxuICAgICAgLy8gUHl0aG9uIC0+IEpTIG1lc3NhZ2VzXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIE1lc3NhZ2VzIGFyZSBpbXBsZW1lbnRlZCB1c2luZyB0cmFpdCBwcm9wZXJ0aWVzLiBUaGlzIGlzIGRvbmUgc29cbiAgICAgIC8vIHRoYXQgd2UgY2FuIHRha2UgYWR2YW50YWdlIG9mIGlweXdpZGdldCdzIGJpbmFyeSBzZXJpYWxpemF0aW9uXG4gICAgICAvLyBwcm90b2NvbC5cbiAgICAgIC8vXG4gICAgICAvLyBNZXNzYWdlcyBhcmUgc2VudCBieSB0aGUgUHl0aG9uIHNpZGUgYnkgYXNzaWduaW5nIHRoZSBtZXNzYWdlXG4gICAgICAvLyBjb250ZW50cyB0byB0aGUgYXBwcm9wcmlhdGUgX3B5MmpzXyogcHJvcGVydHksIGFuZCB0aGVuIGltbWVkaWF0ZWx5XG4gICAgICAvLyBzZXR0aW5nIGl0IHRvIE5vbmUuICBNZXNzYWdlcyBhcmUgcmVjZWl2ZWQgYnkgdGhlIEphdmFTY3JpcHRcbiAgICAgIC8vIHNpZGUgYnkgcmVnaXN0ZXJpbmcgcHJvcGVydHkgY2hhbmdlIGNhbGxiYWNrcyBpbiB0aGUgaW5pdGlhbGl6ZVxuICAgICAgLy8gbWV0aG9kcyBmb3IgRmlndXJlTW9kZWwgYW5kIEZpZ3VyZVZpZXcuIGUuZy4gKHdoZXJlIHRoaXMgaXMgYVxuICAgICAgLy8gRmlndXJlTW9kZWwpOlxuICAgICAgLy9cbiAgICAgIC8vICAgICAgdGhpcy5vbignY2hhbmdlOl9weTJqc19hZGRUcmFjZXMnLCB0aGlzLmRvX2FkZFRyYWNlcywgdGhpcyk7XG4gICAgICAvL1xuICAgICAgLy8gTWVzc2FnZSBoYW5kbGluZyBtZXRob2RzLCBkb19hZGRUcmFjZXMsIGFyZSByZXNwb25zaWJsZSBmb3JcbiAgICAgIC8vIHBlcmZvcm1pbmcgdGhlIGFwcHJvcHJpYXRlIGFjdGlvbiBpZiB0aGUgbWVzc2FnZSBjb250ZW50cyBhcmVcbiAgICAgIC8vIG5vdCBudWxsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc0FkZFRyYWNlc01zZ1xuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48T2JqZWN0Pn0gdHJhY2VfZGF0YVxuICAgICAgICogIEFycmF5IG9mIHRyYWNlcyB0byBhcHBlbmQgdG8gdGhlIGVuZCBvZiB0aGUgZmlndXJlJ3MgY3VycmVudCB0cmFjZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0cmFjZV9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgdHJhY2UgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV90cmFjZURlbHRhcyBtZXNzYWdlLlxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxheW91dF9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgbGF5b3V0IGRlbHRhcyB1c2luZ1xuICAgICAgICogIHRoZSBfanMycHlfbGF5b3V0RGVsdGEgbWVzc2FnZS5cbiAgICAgICAqL1xuICAgICAgX3B5MmpzX2FkZFRyYWNlczogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzRGVsZXRlVHJhY2VzTXNnXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBkZWxldGVfaW5kc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdHJhY2VzIHRvIGJlIGRlbGV0ZWQsIGluIGFzY2VuZGluZyBvcmRlclxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRyYWNlX2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyB0cmFjZSBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X3RyYWNlRGVsdGFzIG1lc3NhZ2UuXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlLlxuICAgICAgICovXG4gICAgICBfcHkyanNfZGVsZXRlVHJhY2VzOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gUHkySnNNb3ZlVHJhY2VzTXNnXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBjdXJyZW50X3RyYWNlX2luZHNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgY3VycmVudCBpbmRleGVzIG9mIHRyYWNlcyB0byBiZSBtb3ZlZFxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0gbmV3X3RyYWNlX2luZHNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgbmV3IGluZGV4ZXMgdGhhdCB0cmFjZXMgc2hvdWxkIGJlIG1vdmVkIHRvLlxuICAgICAgICovXG4gICAgICBfcHkyanNfbW92ZVRyYWNlczogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzUmVzdHlsZU1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IHJlc3R5bGVfZGF0YVxuICAgICAgICogIFJlc3R5bGUgZGF0YSBhcyBhY2NlcHRlZCBieSBQbG90bHkucmVzdHlsZVxuICAgICAgICogQHByb3BlcnR5IHtudWxsfEFycmF5LjxOdW1iZXI+fSByZXN0eWxlX3RyYWNlc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyB0aGF0IHRoZSByZXN5dGxlIG9wZXJhdGlvbiBhcHBsaWVzXG4gICAgICAgKiAgdG8sIG9yIG51bGwgdG8gYXBwbHkgdGhlIG9wZXJhdGlvbiB0byBhbGwgdHJhY2VzXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdHJhY2VfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgdG8gdXNlIHdoZW4gcmV0dXJuaW5nIHRyYWNlIGRlbHRhcyB1c2luZ1xuICAgICAgICogIHRoZSBfanMycHlfdHJhY2VEZWx0YXMgbWVzc2FnZVxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxheW91dF9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgbGF5b3V0IGRlbHRhcyB1c2luZ1xuICAgICAgICogIHRoZSBfanMycHlfbGF5b3V0RGVsdGEgbWVzc2FnZVxuICAgICAgICogQHByb3BlcnR5IHtudWxsfFN0cmluZ30gc291cmNlX3ZpZXdfaWRcbiAgICAgICAqICB2aWV3X2lkIG9mIHRoZSBGaWd1cmVWaWV3IHRoYXQgdHJpZ2dlcmVkIHRoZSBvcmlnaW5hbCByZXN0eWxlXG4gICAgICAgKiAgZXZlbnQgKGUuZy4gYnkgY2xpY2tpbmcgdGhlIGxlZ2VuZCksIG9yIG51bGwgaWYgdGhlIHJlc3R5bGUgd2FzXG4gICAgICAgKiAgdHJpZ2dlcmVkIGZyb20gUHl0aG9uXG4gICAgICAgKi9cbiAgICAgIF9weTJqc19yZXN0eWxlOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gUHkySnNSZWxheW91dE1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IHJlbGF5b3V0X2RhdGFcbiAgICAgICAqICBSZWxheW91dCBkYXRhIGFzIGFjY2VwdGVkIGJ5IFBsb3RseS5yZWxheW91dFxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxheW91dF9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgbGF5b3V0IGRlbHRhcyB1c2luZ1xuICAgICAgICogIHRoZSBfanMycHlfbGF5b3V0RGVsdGEgbWVzc2FnZVxuICAgICAgICogQHByb3BlcnR5IHtudWxsfFN0cmluZ30gc291cmNlX3ZpZXdfaWRcbiAgICAgICAqICB2aWV3X2lkIG9mIHRoZSBGaWd1cmVWaWV3IHRoYXQgdHJpZ2dlcmVkIHRoZSBvcmlnaW5hbCByZWxheW91dFxuICAgICAgICogIGV2ZW50IChlLmcuIGJ5IGNsaWNraW5nIHRoZSB6b29tIGJ1dHRvbiksIG9yIG51bGwgaWYgdGhlXG4gICAgICAgKiAgcmVsYXlvdXQgd2FzIHRyaWdnZXJlZCBmcm9tIFB5dGhvblxuICAgICAgICovXG4gICAgICBfcHkyanNfcmVsYXlvdXQ6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc1VwZGF0ZU1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IHN0eWxlX2RhdGFcbiAgICAgICAqICBTdHlsZSBkYXRhIGFzIGFjY2VwdGVkIGJ5IFBsb3RseS51cGRhdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsYXlvdXRfZGF0YVxuICAgICAgICogIExheW91dCBkYXRhIGFzIGFjY2VwdGVkIGJ5IFBsb3RseS51cGRhdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHN0eWxlX3RyYWNlc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyB0aGF0IHRoZSB1cGRhdGUgb3BlcmF0aW9uIGFwcGxpZXNcbiAgICAgICAqICB0bywgb3IgbnVsbCB0byBhcHBseSB0aGUgb3BlcmF0aW9uIHRvIGFsbCB0cmFjZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0cmFjZV9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgdHJhY2UgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV90cmFjZURlbHRhcyBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHVwZGF0ZVxuICAgICAgICogIGV2ZW50IChlLmcuIGJ5IGNsaWNraW5nIGEgYnV0dG9uKSwgb3IgbnVsbCBpZiB0aGUgdXBkYXRlIHdhc1xuICAgICAgICogIHRyaWdnZXJlZCBmcm9tIFB5dGhvblxuICAgICAgICovXG4gICAgICBfcHkyanNfdXBkYXRlOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gUHkySnNBbmltYXRlTXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gc3R5bGVfZGF0YVxuICAgICAgICogIFN0eWxlIGRhdGEgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LmFuaW1hdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsYXlvdXRfZGF0YVxuICAgICAgICogIExheW91dCBkYXRhIGFzIGFjY2VwdGVkIGJ5IFBsb3RseS5hbmltYXRlXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBzdHlsZV90cmFjZXNcbiAgICAgICAqICBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSB0cmFjZXMgdGhhdCB0aGUgYW5pbWF0ZSBvcGVyYXRpb24gYXBwbGllc1xuICAgICAgICogIHRvLCBvciBudWxsIHRvIGFwcGx5IHRoZSBvcGVyYXRpb24gdG8gYWxsIHRyYWNlc1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGFuaW1hdGlvbl9vcHRzXG4gICAgICAgKiAgQW5pbWF0aW9uIG9wdGlvbnMgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LmFuaW1hdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0cmFjZV9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgdHJhY2UgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV90cmFjZURlbHRhcyBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIGFuaW1hdGVcbiAgICAgICAqICBldmVudCAoZS5nLiBieSBjbGlja2luZyBhIGJ1dHRvbiksIG9yIG51bGwgaWYgdGhlIHVwZGF0ZSB3YXNcbiAgICAgICAqICB0cmlnZ2VyZWQgZnJvbSBQeXRob25cbiAgICAgICAqL1xuICAgICAgX3B5MmpzX2FuaW1hdGU6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc1JlbW92ZUxheW91dFByb3BzTXNnXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxBcnJheS48U3RyaW5nfE51bWJlcj4+fSByZW1vdmVfcHJvcHNcbiAgICAgICAqICBBcnJheSBvZiBwcm9wZXJ0eSBwYXRocyB0byByZW1vdmUuIEVhY2ggcHJvcGVyeSBwYXRoIGlzIGFuXG4gICAgICAgKiAgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgb3IgYXJyYXkgaW5kZXhlcyB0aGF0IGxvY2F0ZSBhIHByb3BlcnR5XG4gICAgICAgKiAgaW5zaWRlIHRoZSBfbGF5b3V0IG9iamVjdFxuICAgICAgICovXG4gICAgICBfcHkyanNfcmVtb3ZlTGF5b3V0UHJvcHM6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc1JlbW92ZVRyYWNlUHJvcHNNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByZW1vdmVfdHJhY2VcbiAgICAgICAqICBUaGUgaW5kZXggb2YgdGhlIHRyYWNlIGZyb20gd2hpY2ggdG8gcmVtb3ZlIHByb3BlcnRpZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPEFycmF5LjxTdHJpbmd8TnVtYmVyPj59IHJlbW92ZV9wcm9wc1xuICAgICAgICogIEFycmF5IG9mIHByb3BlcnR5IHBhdGhzIHRvIHJlbW92ZS4gRWFjaCBwcm9wZXJ5IHBhdGggaXMgYW5cbiAgICAgICAqICBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBvciBhcnJheSBpbmRleGVzIHRoYXQgbG9jYXRlIGEgcHJvcGVydHlcbiAgICAgICAqICBpbnNpZGUgdGhlIF9kYXRhW3JlbW92ZV90cmFjZV0gb2JqZWN0XG4gICAgICAgKi9cbiAgICAgIF9weTJqc19yZW1vdmVUcmFjZVByb3BzOiBudWxsLFxuXG4gICAgICAvLyBKUyAtPiBQeXRob24gbWVzc2FnZXNcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gTWVzc2FnZXMgYXJlIHNlbnQgYnkgdGhlIEphdmFTY3JpcHQgc2lkZSBieSBhc3NpZ25pbmcgdGhlXG4gICAgICAvLyBtZXNzYWdlIGNvbnRlbnRzIHRvIHRoZSBhcHByb3ByaWF0ZSBfanMycHlfKiBwcm9wZXJ0eSBhbmQgdGhlblxuICAgICAgLy8gY2FsbGluZyB0aGUgYHRvdWNoYCBtZXRob2Qgb24gdGhlIHZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlXG4gICAgICAvLyBjaGFuZ2UuIGUuZy4gKHdoZXJlIHRoaXMgaXMgYSBGaWd1cmVWaWV3KTpcbiAgICAgIC8vXG4gICAgICAvLyAgICAgIHRoaXMubW9kZWwuc2V0KCdfanMycHlfcmVzdHlsZScsIGRhdGEpO1xuICAgICAgLy8gICAgICB0aGlzLnRvdWNoKCk7XG4gICAgICAvL1xuICAgICAgLy8gVGhlIFB5dGhvbiBzaWRlIGlzIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHRoZSBwcm9wZXJ0eSB0byBOb25lXG4gICAgICAvLyBhZnRlciByZWNlaXZpbmcgdGhlIG1lc3NhZ2UuXG4gICAgICAvL1xuICAgICAgLy8gTWVzc2FnZSB0cmlnZ2VyIGxvZ2ljIGlzIGRlc2NyaWJlZCBpbiB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgLy8gaGFuZGxlX3Bsb3RseV8qIG1ldGhvZHMgb2YgRmlndXJlVmlld1xuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlSZXN0eWxlTXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gc3R5bGVfZGF0YVxuICAgICAgICogIFN0eWxlIGRhdGEgdGhhdCB3YXMgcGFzc2VkIHRvIFBsb3RseS5yZXN0eWxlXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBzdHlsZV90cmFjZXNcbiAgICAgICAqICBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSB0cmFjZXMgdGhhdCB0aGUgcmVzdHlsZSBvcGVyYXRpb25cbiAgICAgICAqICB3YXMgYXBwbGllZCB0bywgb3IgbnVsbCBpZiBhcHBsaWVkIHRvIGFsbCB0cmFjZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHJlc3R5bGVcbiAgICAgICAqICBldmVudCAoZS5nLiBieSBjbGlja2luZyB0aGUgbGVnZW5kKVxuICAgICAgICovXG4gICAgICBfanMycHlfcmVzdHlsZTogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IEpzMlB5UmVsYXlvdXRNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSByZWxheW91dF9kYXRhXG4gICAgICAgKiAgUmVsYXlvdXQgZGF0YSB0aGF0IHdhcyBwYXNzZWQgdG8gUGxvdGx5LnJlbGF5b3V0XG4gICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gc291cmNlX3ZpZXdfaWRcbiAgICAgICAqICB2aWV3X2lkIG9mIHRoZSBGaWd1cmVWaWV3IHRoYXQgdHJpZ2dlcmVkIHRoZSBvcmlnaW5hbCByZWxheW91dFxuICAgICAgICogIGV2ZW50IChlLmcuIGJ5IGNsaWNraW5nIHRoZSB6b29tIGJ1dHRvbilcbiAgICAgICAqL1xuICAgICAgX2pzMnB5X3JlbGF5b3V0OiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlVcGRhdGVNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzdHlsZV9kYXRhXG4gICAgICAgKiAgU3R5bGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgdG8gUGxvdGx5LnVwZGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxheW91dF9kYXRhXG4gICAgICAgKiAgTGF5b3V0IGRhdGEgdGhhdCB3YXMgcGFzc2VkIHRvIFBsb3RseS51cGRhdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHN0eWxlX3RyYWNlc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyB0aGF0IHRoZSB1cGRhdGUgb3BlcmF0aW9uIGFwcGxpZWRcbiAgICAgICAqICB0bywgb3IgbnVsbCBpZiBhcHBsaWVkIHRvIGFsbCB0cmFjZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHJlbGF5b3V0XG4gICAgICAgKiAgZXZlbnQgKGUuZy4gYnkgY2xpY2tpbmcgdGhlIHpvb20gYnV0dG9uKVxuICAgICAgICovXG4gICAgICBfanMycHlfdXBkYXRlOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlMYXlvdXREZWx0YU1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxheW91dF9kZWx0YVxuICAgICAgICogIFRoZSBsYXlvdXQgZGVsdGEgb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIG9mXG4gICAgICAgKiAgX2Z1bGxMYXlvdXQgdGhhdCBhcmUgbm90IGlkZW50aWNhbCB0byB0aG9zZSBpbiB0aGVcbiAgICAgICAqICBGaWd1cmVNb2RlbCdzIF9sYXlvdXQgcHJvcGVydHlcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXlvdXRfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgb2YgbWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY3JlYXRpb24gb2YgbGF5b3V0IGRlbHRhXG4gICAgICAgKi9cbiAgICAgIF9qczJweV9sYXlvdXREZWx0YTogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IEpzMlB5VHJhY2VEZWx0YXNNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE9iamVjdD59IHRyYWNlX2RlbHRhc1xuICAgICAgICogIEFycmF5IG9mIHRyYWNlIGRlbHRhIG9iamVjdHMuIEVhY2ggdHJhY2UgZGVsdGEgY29udGFpbnMgdGhlXG4gICAgICAgKiAgdHJhY2UncyB1aWQgYWxvbmcgd2l0aCBhbGwgb2YgdGhlIHByb3BlcnRpZXMgb2YgX2Z1bGxEYXRhIHRoYXRcbiAgICAgICAqICBhcmUgbm90IGlkZW50aWNhbCB0byB0aG9zZSBpbiB0aGUgRmlndXJlTW9kZWwncyBfZGF0YSBwcm9wZXJ0eVxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRyYWNlX2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIG9mIG1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNyZWF0aW9uIG9mIHRyYWNlIGRlbHRhc1xuICAgICAgICovXG4gICAgICBfanMycHlfdHJhY2VEZWx0YXM6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogT2JqZWN0IHJlcHJlc2VudGluZyBhIGNvbGxlY3Rpb24gb2YgcG9pbnRzIGZvciB1c2UgaW4gY2xpY2ssIGhvdmVyLFxuICAgICAgICogYW5kIHNlbGVjdGlvbiBldmVudHNcbiAgICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IFBvaW50c1xuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0gdHJhY2VfaW5kZXhlc1xuICAgICAgICogIEFycmF5IG9mIHRoZSB0cmFjZSBpbmRleCBmb3IgZWFjaCBwb2ludFxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0gcG9pbnRfaW5kZXhlc1xuICAgICAgICogIEFycmF5IG9mIHRoZSBpbmRleCBvZiBlYWNoIHBvaW50IGluIGl0cyBvd24gdHJhY2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxBcnJheS48TnVtYmVyPn0geHNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgeCBjb29yZGluYXRlIG9mIGVhY2ggcG9pbnQgKGZvciBjYXJ0ZXNpYW4gdHJhY2UgdHlwZXMpXG4gICAgICAgKiAgb3IgbnVsbCAoZm9yIG5vbi1jYXJ0ZXNpYW4gdHJhY2UgdHlwZXMpXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8QXJyYXkuPE51bWJlcj59IHlzXG4gICAgICAgKiAgQXJyYXkgb2YgdGhlIHkgY29vcmRpbmF0ZSBvZiBlYWNoIHBvaW50IChmb3IgY2FydGVzaWFuIHRyYWNlIHR5cGVzKVxuICAgICAgICogIG9yIG51bGwgKGZvciBub24tY2FydGVzaWFuIHRyYWNlIHR5cGVzXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8QXJyYXkuPE51bWJlcj59IHpzXG4gICAgICAgKiAgQXJyYXkgb2YgdGhlIHogY29vcmRpbmF0ZSBvZiBlYWNoIHBvaW50IChmb3IgM0QgY2FydGVzaWFuXG4gICAgICAgKiAgdHJhY2UgdHlwZXMpXG4gICAgICAgKiAgb3IgbnVsbCAoZm9yIG5vbi0zRC1jYXJ0ZXNpYW4gdHJhY2UgdHlwZXMpXG4gICAgICAgKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGF0ZSBvZiB0aGUgaW5wdXQgZGV2aWNlcyBkdXJpbmcgYVxuICAgICAgICogcGxvdGx5IGV2ZW50XG4gICAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBJbnB1dERldmljZVN0YXRlXG4gICAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGFsdCAtIHRydWUgaWYgYWx0IGtleSBwcmVzc2VkLFxuICAgICAgICogZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGN0cmwgLSB0cnVlIGlmIGN0cmwga2V5IHByZXNzZWQsXG4gICAgICAgKiBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbWV0YSAtIHRydWUgaWYgbWV0YSBrZXkgcHJlc3NlZCxcbiAgICAgICAqIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICogQHByb3BlcnR5IHtib29sZWFufSBzaGlmdCAtIHRydWUgaWYgc2hpZnQga2V5IHByZXNzZWQsXG4gICAgICAgKiBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAqXG4gICAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGJ1dHRvblxuICAgICAgICogIEluZGljYXRlcyB3aGljaCBidXR0b24gd2FzIHByZXNzZWQgb24gdGhlIG1vdXNlIHRvIHRyaWdnZXIgdGhlXG4gICAgICAgKiAgZXZlbnQuXG4gICAgICAgKiAgICAwOiBNYWluIGJ1dHRvbiBwcmVzc2VkLCB1c3VhbGx5IHRoZSBsZWZ0IGJ1dHRvbiBvciB0aGVcbiAgICAgICAqICAgICAgIHVuLWluaXRpYWxpemVkIHN0YXRlXG4gICAgICAgKiAgICAxOiBBdXhpbGlhcnkgYnV0dG9uIHByZXNzZWQsIHVzdWFsbHkgdGhlIHdoZWVsIGJ1dHRvbiBvclxuICAgICAgICogICAgICAgdGhlIG1pZGRsZSBidXR0b24gKGlmIHByZXNlbnQpXG4gICAgICAgKiAgICAyOiBTZWNvbmRhcnkgYnV0dG9uIHByZXNzZWQsIHVzdWFsbHkgdGhlIHJpZ2h0IGJ1dHRvblxuICAgICAgICogICAgMzogRm91cnRoIGJ1dHRvbiwgdHlwaWNhbGx5IHRoZSBCcm93c2VyIEJhY2sgYnV0dG9uXG4gICAgICAgKiAgICA0OiBGaWZ0aCBidXR0b24sIHR5cGljYWxseSB0aGUgQnJvd3NlciBGb3J3YXJkIGJ1dHRvblxuICAgICAgICpcbiAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYnV0dG9uc1xuICAgICAgICogIEluZGljYXRlcyB3aGljaCBidXR0b25zIHdlcmUgcHJlc3NlZCBvbiB0aGUgbW91c2Ugd2hlbiB0aGUgZXZlbnRcbiAgICAgICAqICBpcyB0cmlnZ2VyZWQuXG4gICAgICAgKiAgICAwICA6IE5vIGJ1dHRvbiBvciB1bi1pbml0aWFsaXplZFxuICAgICAgICogICAgMSAgOiBQcmltYXJ5IGJ1dHRvbiAodXN1YWxseSBsZWZ0KVxuICAgICAgICogICAgMiAgOiBTZWNvbmRhcnkgYnV0dG9uICh1c3VhbGx5IHJpZ2h0KVxuICAgICAgICogICAgNCAgOiBBdXhpbGFyeSBidXR0b24gKHVzdWFsbHkgbWlkZGxlIG9yIG1vdXNlIHdoZWVsIGJ1dHRvbilcbiAgICAgICAqICAgIDggIDogNHRoIGJ1dHRvbiAodHlwaWNhbGx5IHRoZSBcIkJyb3dzZXIgQmFja1wiIGJ1dHRvbilcbiAgICAgICAqICAgIDE2IDogNXRoIGJ1dHRvbiAodHlwaWNhbGx5IHRoZSBcIkJyb3dzZXIgRm9yd2FyZFwiIGJ1dHRvbilcbiAgICAgICAqXG4gICAgICAgKiAgQ29tYmluYXRpb25zIG9mIGJ1dHRvbnMgYXJlIHJlcHJlc2VudGVkIGJ5IHRoZSBzdW0gb2YgdGhlIGNvZGVzXG4gICAgICAgKiAgYWJvdmUuIGUuZy4gYSB2YWx1ZSBvZiA3IGluZGljYXRlcyBidXR0b25zIDEgKHByaW1hcnkpLFxuICAgICAgICogIDIgKHNlY29uZGFyeSksIGFuZCA0IChhdXhpbGFyeSkgd2VyZSBwcmVzc2VkIGR1cmluZyB0aGUgZXZlbnRcbiAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IEJveFNlbGVjdG9yU3RhdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHhyYW5nZVxuICAgICAgICogIFR3byBlbGVtZW50IGFycmF5IGNvbnRhaW5pbmcgdGhlIHgtcmFuZ2Ugb2YgdGhlIGJveCBzZWxlY3Rpb25cbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHlyYW5nZVxuICAgICAgICogIFR3byBlbGVtZW50IGFycmF5IGNvbnRhaW5pbmcgdGhlIHktcmFuZ2Ugb2YgdGhlIGJveCBzZWxlY3Rpb25cbiAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IExhc3NvU2VsZWN0b3JTdGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0geHNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgeC1jb29yZGluYXRlcyBvZiB0aGUgbGFzc28gc2VsZWN0aW9uIHJlZ2lvblxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0geXNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgeS1jb29yZGluYXRlcyBvZiB0aGUgbGFzc28gc2VsZWN0aW9uIHJlZ2lvblxuICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICogT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3RhdGUgb2YgdGhlIHNlbGVjdGlvbiB0b29sIGR1cmluZyBhXG4gICAgICAgKiBwbG90bHlfc2VsZWN0IGV2ZW50XG4gICAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBTZWxlY3RvclxuICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGVcbiAgICAgICAqICBTZWxlY3Rpb24gdHlwZS4gT25lIG9mOiAnYm94Jywgb3IgJ2xhc3NvJ1xuICAgICAgICogQHByb3BlcnR5IHtCb3hTZWxlY3RvclN0YXRlfExhc3NvU2VsZWN0b3JTdGF0ZX0gc2VsZWN0b3Jfc3RhdGVcbiAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlQb2ludHNDYWxsYmFja01zZ1xuICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGV2ZW50X3R5cGVcbiAgICAgICAqICBOYW1lIG9mIHRoZSB0cmlnZ2VyaW5nIGV2ZW50LiBPbmUgb2YgJ3Bsb3RseV9jbGljaycsXG4gICAgICAgKiAgJ3Bsb3RseV9ob3ZlcicsICdwbG90bHlfdW5ob3ZlcicsIG9yICdwbG90bHlfc2VsZWN0ZWQnXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8UG9pbnRzfSBwb2ludHNcbiAgICAgICAqICBQb2ludHMgb2JqZWN0IGZvciBldmVudFxuICAgICAgICogQHByb3BlcnR5IHtudWxsfElucHV0RGV2aWNlU3RhdGV9IGRldmljZV9zdGF0ZVxuICAgICAgICogIElucHV0RGV2aWNlU3RhdGUgb2JqZWN0IGZvciBldmVudFxuICAgICAgICogQHByb3BlcnR5IHtudWxsfFNlbGVjdG9yfSBzZWxlY3RvclxuICAgICAgICogIFN0YXRlIG9mIHRoZSBzZWxlY3Rpb24gdG9vbCBmb3IgJ3Bsb3RseV9zZWxlY3RlZCcgZXZlbnRzLCBudWxsXG4gICAgICAgKiAgZm9yIG90aGVyIGV2ZW50IHR5cGVzXG4gICAgICAgKi9cbiAgICAgIF9qczJweV9wb2ludHNDYWxsYmFjazogbnVsbCxcblxuICAgICAgLy8gTWVzc2FnZSB0cmFja2luZ1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICogbGF5b3V0X2VkaXRfaWQgb2YgdGhlIGxhc3QgbGF5b3V0IG1vZGlmaWNhdGlvbiBvcGVyYXRpb25cbiAgICAgICAqIHJlcXVlc3RlZCBieSB0aGUgUHl0aG9uIHNpZGVcbiAgICAgICAqL1xuICAgICAgX2xhc3RfbGF5b3V0X2VkaXRfaWQ6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAqIHRyYWNlX2VkaXRfaWQgb2YgdGhlIGxhc3QgdHJhY2UgbW9kaWZpY2F0aW9uIG9wZXJhdGlvblxuICAgICAgICogcmVxdWVzdGVkIGJ5IHRoZSBQeXRob24gc2lkZVxuICAgICAgICovXG4gICAgICBfbGFzdF90cmFjZV9lZGl0X2lkOiAwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBGaWd1cmVNb2RlbC4gQ2FsbGVkIHdoZW4gdGhlIFB5dGhvbiBGaWd1cmVXaWRnZXQgaXMgZmlyc3RcbiAgICogY29uc3RydWN0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfZGF0YVwiLCAoKSA9PiB0aGlzLmRvX2RhdGEoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfbGF5b3V0XCIsICgpID0+IHRoaXMuZG9fbGF5b3V0KCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX2FkZFRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX2FkZFRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19kZWxldGVUcmFjZXNcIiwgKCkgPT4gdGhpcy5kb19kZWxldGVUcmFjZXMoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfbW92ZVRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX21vdmVUcmFjZXMoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfcmVzdHlsZVwiLCAoKSA9PiB0aGlzLmRvX3Jlc3R5bGUoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfcmVsYXlvdXRcIiwgKCkgPT4gdGhpcy5kb19yZWxheW91dCgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc191cGRhdGVcIiwgKCkgPT4gdGhpcy5kb191cGRhdGUoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfYW5pbWF0ZVwiLCAoKSA9PiB0aGlzLmRvX2FuaW1hdGUoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfcmVtb3ZlTGF5b3V0UHJvcHNcIiwgKCkgPT4gdGhpcy5kb19yZW1vdmVMYXlvdXRQcm9wcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZW1vdmVUcmFjZVByb3BzXCIsICgpID0+IHRoaXMuZG9fcmVtb3ZlVHJhY2VQcm9wcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnB1dCBhIHRyYWNlIGluZGV4IHNwZWNpZmljYXRpb24gYW5kIHJldHVybiBhbiBBcnJheSBvZiB0cmFjZVxuICAgKiBpbmRleGVzIHdoZXJlOlxuICAgKlxuICAgKiAgLSBudWxsfHVuZGVmaW5lZCAtPiBBcnJheSBvZiBhbGwgdHJhY2VzXG4gICAqICAtIFRyYWNlIGluZGV4IGFzIE51bWJlciAtPiBTaW5nbGUgZWxlbWVudCBhcnJheSBvZiBpbnB1dCBpbmRleFxuICAgKiAgLSBBcnJheSBvZiB0cmFjZSBpbmRleGVzIC0+IElucHV0IGFycmF5IHVuY2hhbmdlZFxuICAgKlxuICAgKiBAcGFyYW0ge3VuZGVmaW5lZHxudWxsfE51bWJlcnxBcnJheS48TnVtYmVyPn0gdHJhY2VfaW5kZXhlc1xuICAgKiBAcmV0dXJucyB7QXJyYXkuPE51bWJlcj59XG4gICAqICBBcnJheSBvZiB0cmFjZSBpbmRleGVzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbm9ybWFsaXplX3RyYWNlX2luZGV4ZXModHJhY2VfaW5kZXhlcz86IG51bGwgfCBudW1iZXIgfCBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgICBpZiAodHJhY2VfaW5kZXhlcyA9PT0gbnVsbCB8fCB0cmFjZV9pbmRleGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBudW1UcmFjZXMgPSB0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpLmxlbmd0aDtcbiAgICAgIHRyYWNlX2luZGV4ZXMgPSBfLnJhbmdlKG51bVRyYWNlcyk7XG4gICAgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0cmFjZV9pbmRleGVzKSkge1xuICAgICAgLy8gTWFrZSBzdXJlIGlkeCBpcyBhbiBhcnJheVxuICAgICAgdHJhY2VfaW5kZXhlcyA9IFt0cmFjZV9pbmRleGVzXTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWNlX2luZGV4ZXM7XG4gIH1cblxuICAvKipcbiAgICogTG9nIGNoYW5nZXMgdG8gdGhlIF9kYXRhIHRyYWl0XG4gICAqXG4gICAqIFRoaXMgc2hvdWxkIG9ubHkgaGFwcGVkIG9uIEZpZ3VyZU1vZGVsIGluaXRpYWxpemF0aW9uXG4gICAqL1xuICBkb19kYXRhKCkge31cblxuICAvKipcbiAgICogTG9nIGNoYW5nZXMgdG8gdGhlIF9sYXlvdXQgdHJhaXRcbiAgICpcbiAgICogVGhpcyBzaG91bGQgb25seSBoYXBwZWQgb24gRmlndXJlTW9kZWwgaW5pdGlhbGl6YXRpb25cbiAgICovXG4gIGRvX2xheW91dCgpIHt9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhZGRUcmFjZXMgbWVzc2FnZVxuICAgKi9cbiAgZG9fYWRkVHJhY2VzKCkge1xuICAgIC8vIGFkZCB0cmFjZSB0byBwbG90XG4gICAgLyoqIEB0eXBlIHtQeTJKc0FkZFRyYWNlc01zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNBZGRUcmFjZXNNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19hZGRUcmFjZXNcIik7XG5cbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgdmFyIGN1cnJlbnRUcmFjZXMgPSB0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpO1xuICAgICAgdmFyIG5ld1RyYWNlcyA9IG1zZ0RhdGEudHJhY2VfZGF0YTtcbiAgICAgIF8uZm9yRWFjaChuZXdUcmFjZXMsIGZ1bmN0aW9uIChuZXdUcmFjZSkge1xuICAgICAgICBjdXJyZW50VHJhY2VzLnB1c2gobmV3VHJhY2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBkZWxldGVUcmFjZXMgbWVzc2FnZVxuICAgKi9cbiAgZG9fZGVsZXRlVHJhY2VzKCkge1xuICAgIC8vIHJlbW92ZSB0cmFjZXMgZnJvbSBwbG90XG5cbiAgICAvKiogQHR5cGUge1B5MkpzRGVsZXRlVHJhY2VzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc0RlbGV0ZVRyYWNlc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2RlbGV0ZVRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgZGVsZXRlX2luZHMgPSBtc2dEYXRhLmRlbGV0ZV9pbmRzO1xuICAgICAgdmFyIHRyYWNlc0RhdGEgPSB0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpO1xuXG4gICAgICAvLyBSZW1vdmUgZGVsIGluZHMgaW4gcmV2ZXJzZSBvcmRlciBzbyBpbmRleGVzIHJlbWFpbiB2YWxpZFxuICAgICAgLy8gdGhyb3VnaG91dCBsb29wXG4gICAgICBkZWxldGVfaW5kc1xuICAgICAgICAuc2xpY2UoKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChkZWxfaW5kKSB7XG4gICAgICAgICAgdHJhY2VzRGF0YS5zcGxpY2UoZGVsX2luZCwgMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW92ZVRyYWNlcyBtZXNzYWdlXG4gICAqL1xuICBkb19tb3ZlVHJhY2VzKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNNb3ZlVHJhY2VzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc01vdmVUcmFjZXNNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19tb3ZlVHJhY2VzXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciB0cmFjZXNEYXRhID0gdGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKTtcbiAgICAgIHZhciBjdXJyZW50SW5kcyA9IG1zZ0RhdGEuY3VycmVudF90cmFjZV9pbmRzO1xuICAgICAgdmFyIG5ld0luZHMgPSBtc2dEYXRhLm5ld190cmFjZV9pbmRzO1xuXG4gICAgICBwZXJmb3JtTW92ZVRyYWNlc0xpa2UodHJhY2VzRGF0YSwgY3VycmVudEluZHMsIG5ld0luZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcmVzdHlsZSBtZXNzYWdlXG4gICAqL1xuICBkb19yZXN0eWxlKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNSZXN0eWxlTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1Jlc3R5bGVNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19yZXN0eWxlXCIpO1xuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgcmVzdHlsZURhdGEgPSBtc2dEYXRhLnJlc3R5bGVfZGF0YTtcbiAgICAgIHZhciByZXN0eWxlVHJhY2VzID0gdGhpcy5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMobXNnRGF0YS5yZXN0eWxlX3RyYWNlcyk7XG4gICAgICBwZXJmb3JtUmVzdHlsZUxpa2UodGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKSwgcmVzdHlsZURhdGEsIHJlc3R5bGVUcmFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcmVsYXlvdXQgbWVzc2FnZVxuICAgKi9cbiAgZG9fcmVsYXlvdXQoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc1JlbGF5b3V0TXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1JlbGF5b3V0TXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfcmVsYXlvdXRcIik7XG5cbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgcGVyZm9ybVJlbGF5b3V0TGlrZSh0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIiksIG1zZ0RhdGEucmVsYXlvdXRfZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSB1cGRhdGUgbWVzc2FnZVxuICAgKi9cbiAgZG9fdXBkYXRlKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNVcGRhdGVNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzVXBkYXRlTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfdXBkYXRlXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBzdHlsZSA9IG1zZ0RhdGEuc3R5bGVfZGF0YTtcbiAgICAgIHZhciBsYXlvdXQgPSBtc2dEYXRhLmxheW91dF9kYXRhO1xuICAgICAgdmFyIHN0eWxlVHJhY2VzID0gdGhpcy5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMobXNnRGF0YS5zdHlsZV90cmFjZXMpO1xuICAgICAgcGVyZm9ybVJlc3R5bGVMaWtlKHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIiksIHN0eWxlLCBzdHlsZVRyYWNlcyk7XG4gICAgICBwZXJmb3JtUmVsYXlvdXRMaWtlKHRoaXMubW9kZWwuZ2V0KFwiX2xheW91dFwiKSwgbGF5b3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGFuaW1hdGUgbWVzc2FnZVxuICAgKi9cbiAgZG9fYW5pbWF0ZSgpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzQW5pbWF0ZU1zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNBbmltYXRlTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfYW5pbWF0ZVwiKTtcbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHN0eWxlcyA9IG1zZ0RhdGEuc3R5bGVfZGF0YTtcbiAgICAgIHZhciBsYXlvdXQgPSBtc2dEYXRhLmxheW91dF9kYXRhO1xuICAgICAgdmFyIHRyYWNlX2luZGV4ZXMgPSB0aGlzLl9ub3JtYWxpemVfdHJhY2VfaW5kZXhlcyhtc2dEYXRhLnN0eWxlX3RyYWNlcyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlc1tpXTtcbiAgICAgICAgdmFyIHRyYWNlX2luZGV4ID0gdHJhY2VfaW5kZXhlc1tpXTtcbiAgICAgICAgdmFyIHRyYWNlID0gdGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKVt0cmFjZV9pbmRleF07XG4gICAgICAgIHBlcmZvcm1SZWxheW91dExpa2UodHJhY2UsIHN0eWxlKTtcbiAgICAgIH1cblxuICAgICAgcGVyZm9ybVJlbGF5b3V0TGlrZSh0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIiksIGxheW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSByZW1vdmVMYXlvdXRQcm9wcyBtZXNzYWdlXG4gICAqL1xuICBkb19yZW1vdmVMYXlvdXRQcm9wcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzUmVtb3ZlTGF5b3V0UHJvcHNNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzUmVtb3ZlTGF5b3V0UHJvcHNNc2cgPSB0aGlzLm1vZGVsLmdldChcbiAgICAgIFwiX3B5MmpzX3JlbW92ZUxheW91dFByb3BzXCJcbiAgICApO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBrZXlQYXRocyA9IG1zZ0RhdGEucmVtb3ZlX3Byb3BzO1xuICAgICAgdmFyIGxheW91dCA9IHRoaXMubW9kZWwuZ2V0KFwiX2xheW91dFwiKTtcbiAgICAgIHBlcmZvcm1SZW1vdmVQcm9wcyhsYXlvdXQsIGtleVBhdGhzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHJlbW92ZVRyYWNlUHJvcHMgbWVzc2FnZVxuICAgKi9cbiAgZG9fcmVtb3ZlVHJhY2VQcm9wcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzUmVtb3ZlVHJhY2VQcm9wc01zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNSZW1vdmVUcmFjZVByb3BzTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfcmVtb3ZlVHJhY2VQcm9wc1wiKTtcbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgdmFyIGtleVBhdGhzID0gbXNnRGF0YS5yZW1vdmVfcHJvcHM7XG4gICAgICB2YXIgdHJhY2VJbmRleCA9IG1zZ0RhdGEucmVtb3ZlX3RyYWNlO1xuICAgICAgdmFyIHRyYWNlID0gdGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKVt0cmFjZUluZGV4XTtcblxuICAgICAgcGVyZm9ybVJlbW92ZVByb3BzKHRyYWNlLCBrZXlQYXRocyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNlcmlhbGl6ZXJzOiBSZWNvcmQ8c3RyaW5nLCBTZXJpYWxpemVyPiA9IHtcbiAgX2RhdGE6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX2xheW91dDoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfcHkyanNfYWRkVHJhY2VzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19kZWxldGVUcmFjZXM6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX21vdmVUcmFjZXM6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX3Jlc3R5bGU6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX3JlbGF5b3V0OiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc191cGRhdGU6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX2FuaW1hdGU6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX3JlbW92ZUxheW91dFByb3BzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19yZW1vdmVUcmFjZVByb3BzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9qczJweV9yZXN0eWxlOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9qczJweV9yZWxheW91dDoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfanMycHlfdXBkYXRlOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9qczJweV9sYXlvdXREZWx0YToge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfanMycHlfdHJhY2VEZWx0YXM6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX2pzMnB5X3BvaW50c0NhbGxiYWNrOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG59O1xuXG4vLyBWaWV3XG4vLyA9PT09XG4vKipcbiAqIEEgRmlndXJlVmlldyBtYW5hZ2VzIHRoZSB2aXN1YWwgcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIFBsb3RseS5qc1xuICogZmlndXJlIGZvciBhIHNpbmdsZSBub3RlYm9vayBvdXRwdXQgY2VsbC4gRWFjaCBGaWd1cmVWaWV3IGhhcyBhXG4gKiByZWZlcmVuY2UgdG8gRmlndXJlTW9kZWwuICBNdWx0aXBsZSB2aWV3cyBtYXkgc2hhcmUgYSBzaW5nbGUgbW9kZWxcbiAqIGluc3RhbmNlLCBhcyBpcyB0aGUgY2FzZSB3aGVuIGEgUHl0aG9uIEZpZ3VyZVdpZGdldCBpcyBkaXNwbGF5ZWQgaW5cbiAqIG11bHRpcGxlIG5vdGVib29rIG91dHB1dCBjZWxscy5cbiAqXG4gKiBAdHlwZSB7d2lkZ2V0cy5ET01XaWRnZXRWaWV3fVxuICovXG5leHBvcnQgY2xhc3MgRmlndXJlVmlldyB7XG4gIHZpZXdJRDogc3RyaW5nO1xuICByZXNpemVFdmVudExpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gIG1vZGVsOiBGaWd1cmVNb2RlbDtcbiAgZWw6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiBGaWd1cmVNb2RlbCwgZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGVyZm9ybV9yZW5kZXIgbWV0aG9kIGlzIGNhbGxlZCBieSBwcm9jZXNzTHVtaW5vTWVzc2FnZVxuICAgKiBhZnRlciB0aGUgd2lkZ2V0J3MgRE9NIGVsZW1lbnQgaGFzIGJlZW4gYXR0YWNoZWQgdG8gdGhlIG5vdGVib29rXG4gICAqIG91dHB1dCBjZWxsLiBUaGlzIGhhcHBlbnMgYWZ0ZXIgdGhlIGluaXRpYWxpemUgb2YgdGhlXG4gICAqIEZpZ3VyZU1vZGVsLCBhbmQgaXQgd29uJ3QgaGFwcGVuIGF0IGFsbCBpZiB0aGUgUHl0aG9uIEZpZ3VyZVdpZGdldFxuICAgKiBpcyBuZXZlciBkaXNwbGF5ZWQgaW4gYSBub3RlYm9vayBvdXRwdXQgY2VsbFxuICAgKi9cbiAgcGVyZm9ybV9yZW5kZXIoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgLy8gV2lyZSB1cCBtZXNzYWdlIHByb3BlcnR5IGNhbGxiYWNrc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQeXRob24gLT4gSlMgZXZlbnQgcHJvcGVydGllc1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX2FkZFRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX2FkZFRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19kZWxldGVUcmFjZXNcIiwgKCkgPT4gdGhpcy5kb19kZWxldGVUcmFjZXMoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfbW92ZVRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX21vdmVUcmFjZXMoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfcmVzdHlsZVwiLCAoKSA9PiB0aGlzLmRvX3Jlc3R5bGUoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfcmVsYXlvdXRcIiwgKCkgPT4gdGhpcy5kb19yZWxheW91dCgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc191cGRhdGVcIiwgKCkgPT4gdGhpcy5kb191cGRhdGUoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfYW5pbWF0ZVwiLCAoKSA9PiB0aGlzLmRvX2FuaW1hdGUoKSk7XG5cbiAgICAvLyBNYXRoSmF4IHYyIGNvbmZpZ3VyYXRpb25cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAod2luZG93IGFzIGFueSk/Lk1hdGhKYXg/Lkh1Yj8uQ29uZmlnPy4oeyBTVkc6IHsgZm9udDogXCJTVElYLVdlYlwiIH0gfSk7XG5cbiAgICAvLyBHZXQgbWVzc2FnZSBpZHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSB0aGlzLm1vZGVsLmdldChcIl9sYXN0X2xheW91dF9lZGl0X2lkXCIpO1xuICAgIHZhciB0cmFjZV9lZGl0X2lkID0gdGhpcy5tb2RlbC5nZXQoXCJfbGFzdF90cmFjZV9lZGl0X2lkXCIpO1xuXG4gICAgLy8gU2V0IHZpZXcgVUlEXG4gICAgLy8gLS0tLS0tLS0tLS0tXG4gICAgdGhpcy52aWV3SUQgPSByYW5kc3RyKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIFBsb3RseS5qcyBmaWd1cmVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBXZSBtdXN0IGNsb25lIHRoZSBtb2RlbCdzIGRhdGEgYW5kIGxheW91dCBwcm9wZXJ0aWVzIHNvIHRoYXRcbiAgICAvLyB0aGUgbW9kZWwgaXMgbm90IGRpcmVjdGx5IG11dGF0ZWQgYnkgdGhlIFBsb3RseS5qcyBsaWJyYXJ5LlxuICAgIHZhciBpbml0aWFsVHJhY2VzID0gXy5jbG9uZURlZXAodGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKSk7XG4gICAgdmFyIGluaXRpYWxMYXlvdXQgPSBfLmNsb25lRGVlcCh0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIikpO1xuICAgIGlmICghaW5pdGlhbExheW91dC5oZWlnaHQpIHtcbiAgICAgIGluaXRpYWxMYXlvdXQuaGVpZ2h0ID0gMzYwO1xuICAgIH1cbiAgICB2YXIgY29uZmlnID0gdGhpcy5tb2RlbC5nZXQoXCJfY29uZmlnXCIpO1xuICAgIGNvbmZpZy5lZGl0U2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgICBQbG90bHkubmV3UGxvdCh0aGF0LmVsLCBpbml0aWFsVHJhY2VzLCBpbml0aWFsTGF5b3V0LCBjb25maWcpLnRoZW4oXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICMjIyBTZW5kIHRyYWNlIGRlbHRhcyAjIyNcbiAgICAgICAgLy8gV2UgY3JlYXRlIGFuIGFycmF5IG9mIGRlbHRhcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBuZXdcbiAgICAgICAgLy8gdHJhY2VzLlxuICAgICAgICB0aGF0Ll9zZW5kVHJhY2VEZWx0YXModHJhY2VfZWRpdF9pZCk7XG5cbiAgICAgICAgLy8gIyMjIFNlbmQgbGF5b3V0IGRlbHRhICMjI1xuICAgICAgICB0aGF0Ll9zZW5kTGF5b3V0RGVsdGEobGF5b3V0X2VkaXRfaWQpO1xuXG4gICAgICAgIC8vIFdpcmUgdXAgcGxvdGx5IGV2ZW50IGNhbGxiYWNrc1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV9yZXN0eWxlXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV9yZXN0eWxlKHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV9yZWxheW91dFwiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfcmVsYXlvdXQodXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X3VwZGF0ZVwiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfdXBkYXRlKHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV9jbGlja1wiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfY2xpY2sodXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X2hvdmVyXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV9ob3Zlcih1cGRhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhhdC5lbCkub24oXCJwbG90bHlfdW5ob3ZlclwiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfdW5ob3Zlcih1cGRhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhhdC5lbCkub24oXCJwbG90bHlfc2VsZWN0ZWRcIiwgZnVuY3Rpb24gKHVwZGF0ZTogYW55KSB7XG4gICAgICAgICAgdGhhdC5oYW5kbGVfcGxvdGx5X3NlbGVjdGVkKHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV9kZXNlbGVjdFwiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfZGVzZWxlY3QodXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X2RvdWJsZWNsaWNrXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV9kb3VibGVjbGljayh1cGRhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBFbWl0IGV2ZW50IGluZGljYXRpbmcgdGhhdCB0aGUgd2lkZ2V0IGhhcyBmaW5pc2hlZFxuICAgICAgICAvLyByZW5kZXJpbmdcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwicGxvdGx5d2lkZ2V0LWFmdGVyLXJlbmRlclwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IGVsZW1lbnQ6IHRoYXQuZWwsIHZpZXdJRDogdGhhdC52aWV3SUQgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2gvVHJpZ2dlci9GaXJlIHRoZSBldmVudFxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3BvbmQgdG8gTHVtaW5vIGV2ZW50c1xuICAgKi9cbiAgX3Byb2Nlc3NMdW1pbm9NZXNzYWdlKG1zZzogYW55LCBfc3VwZXI6IGFueSkge1xuICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgICBjYXNlIFwiYmVmb3JlLWF0dGFjaFwiOlxuICAgICAgICAvLyBSZW5kZXIgYW4gaW5pdGlhbCBlbXB0eSBmaWd1cmUuIFRoaXMgZXN0YWJsaXNoZXMgd2l0aFxuICAgICAgICAvLyB0aGUgcGFnZSB0aGF0IHRoZSBlbGVtZW50IHdpbGwgbm90IGJlIGVtcHR5LCBhdm9pZGluZ1xuICAgICAgICAvLyBzb21lIG9jY2FzaW9ucyB3aGVyZSB0aGUgZHluYW1pYyBzaXppbmcgYmVoYXZpb3IgbGVhZHNcbiAgICAgICAgLy8gdG8gY29sbGFwc2VkIGZpZ3VyZSBkaW1lbnNpb25zLlxuICAgICAgICB2YXIgYXhpc0hpZGRlbiA9IHtcbiAgICAgICAgICBzaG93Z3JpZDogZmFsc2UsXG4gICAgICAgICAgc2hvd2xpbmU6IGZhbHNlLFxuICAgICAgICAgIHRpY2t2YWxzOiBbXSBhcyBhbnlbXSxcbiAgICAgICAgfTtcblxuICAgICAgICBQbG90bHkubmV3UGxvdCh0aGF0LmVsLCBbXSwge1xuICAgICAgICAgIHhheGlzOiBheGlzSGlkZGVuLFxuICAgICAgICAgIHlheGlzOiBheGlzSGlkZGVuLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNpemVFdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYXV0b3NpemVGaWd1cmUoKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnJlc2l6ZUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhZnRlci1hdHRhY2hcIjpcbiAgICAgICAgLy8gUmVuZGVyaW5nIGFjdHVhbCBmaWd1cmUgaW4gdGhlIGFmdGVyLWF0dGFjaCBldmVudCBhbGxvd3NcbiAgICAgICAgLy8gUGxvdGx5LmpzIHRvIHNpemUgdGhlIGZpZ3VyZSB0byBmaWxsIHRoZSBhdmFpbGFibGUgZWxlbWVudFxuICAgICAgICB0aGlzLnBlcmZvcm1fcmVuZGVyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFmdGVyLXNob3dcIjpcbiAgICAgIGNhc2UgXCJyZXNpemVcIjpcbiAgICAgICAgdGhpcy5hdXRvc2l6ZUZpZ3VyZSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBwcm9jZXNzUGhvc3Bob3JNZXNzYWdlKG1zZzogYW55KSB7XG4gIC8vICAgdGhpcy5fcHJvY2Vzc0x1bWlub01lc3NhZ2UobXNnLCBzdXBlcltcInByb2Nlc3NQaG9zcGhvck1lc3NhZ2VcIl0pO1xuICAvLyB9XG5cbiAgLy8gcHJvY2Vzc0x1bWlub01lc3NhZ2UobXNnOiBhbnkpIHtcbiAgLy8gICB0aGlzLl9wcm9jZXNzTHVtaW5vTWVzc2FnZShtc2csIHN1cGVyW1wicHJvY2Vzc0x1bWlub01lc3NhZ2VcIl0pO1xuICAvLyB9XG5cbiAgYXV0b3NpemVGaWd1cmUoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBsYXlvdXQgPSB0aGF0Lm1vZGVsLmdldChcIl9sYXlvdXRcIik7XG4gICAgaWYgKF8uaXNOaWwobGF5b3V0KSB8fCBfLmlzTmlsKGxheW91dC53aWR0aCkpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIFBsb3RseS5QbG90cy5yZXNpemUodGhhdC5lbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXlvdXRfZWRpdF9pZCA9IHRoYXQubW9kZWwuZ2V0KFwiX2xhc3RfbGF5b3V0X2VkaXRfaWRcIik7XG4gICAgICAgIHRoYXQuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVyZ2UgUGxvdGx5LmpzIGRhdGEgc3RydWN0dXJlcyBmcm9tIHRoZSBub3RlYm9vayBvdXRwdXQgZGlzcGxheVxuICAgKiBlbGVtZW50IHdoZW4gdGhlIHZpZXcgaXMgZGVzdHJveWVkXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgUGxvdGx5LnB1cmdlKHRoaXMuZWwpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMucmVzaXplRXZlbnRMaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBmaWd1cmUncyBfZnVsbERhdGEgYXJyYXkgbWVyZ2VkIHdpdGggaXRzIGRhdGEgYXJyYXlcbiAgICpcbiAgICogVGhlIG1lcmdlIGVuc3VyZXMgdGhhdCBmb3IgYW55IHByb3BlcnRpZXMgdGhhdCBlbC5fZnVsbERhdGEgYW5kXG4gICAqIGVsLmRhdGEgaGF2ZSBpbiBjb21tb24sIHdlIHJldHVybiB0aGUgdmVyc2lvbiBmcm9tIGVsLmRhdGFcbiAgICpcbiAgICogTmFtZWQgY29sb3JzY2FsZXMgYXJlIG9uZSBleGFtcGxlIG9mIHdoeSB0aGlzIGlzIG5lZWRlZC4gVGhlIGVsLmRhdGFcbiAgICogYXJyYXkgd2lsbCBob2xkIG5hbWVkIGNvbG9yc2NhbGUgc3RyaW5ncyAoZS5nLiAnVmlyaWRpcycpLCB3aGlsZSB0aGVcbiAgICogZWwuX2Z1bGxEYXRhIGFycmF5IHdpbGwgaG9sZCB0aGUgYWN0dWFsIGNvbG9yc2NhbGUgYXJyYXkuIGUuZy5cbiAgICpcbiAgICogICAgICBlbC5kYXRhWzBdLm1hcmtlci5jb2xvcnNjYWxlID09ICdWaXJpZGlzJyBidXRcbiAgICogICAgICBlbC5fZnVsbERhdGFbMF0ubWFya2VyLmNvbG9yc2NhbGUgPSBbWy4uLiwgLi4uXSwgLi4uXVxuICAgKlxuICAgKiBQZXJmb3JtaW5nIHRoZSBtZXJnZSBhbGxvd3Mgb3VyIEZpZ3VyZU1vZGVsIHRvIHJldGFpbiB0aGUgJ1ZpcmlkaXMnXG4gICAqIHN0cmluZywgcmF0aGVyIHRoYW4gaGF2aW5nIGl0IG92ZXJyaWRkZWQgYnkgdGhlIGNvbG9yc2NhbGUgYXJyYXkuXG4gICAqXG4gICAqL1xuICBnZXRGdWxsRGF0YSgpIHtcbiAgICByZXR1cm4gXy5tZXJnZVdpdGgoXG4gICAgICB7fSxcbiAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoaXMuZWwpLl9mdWxsRGF0YSxcbiAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoaXMuZWwpLmRhdGEsXG4gICAgICBmdWxsTWVyZ2VDdXN0b21pemVyXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZpZ3VyZSdzIF9mdWxsTGF5b3V0IG9iamVjdCBtZXJnZWQgd2l0aCBpdHMgbGF5b3V0IG9iamVjdFxuICAgKlxuICAgKiBTZWUgZ2V0RnVsbERhdGEgZG9jdW1lbnRhdGlvbiBmb3IgZGlzY3Vzc2lvbiBvZiB3aHkgdGhlIG1lcmdlIGlzXG4gICAqIG5lY2Vzc2FyeVxuICAgKi9cbiAgZ2V0RnVsbExheW91dCgpIHtcbiAgICByZXR1cm4gXy5tZXJnZVdpdGgoXG4gICAgICB7fSxcbiAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoaXMuZWwpLl9mdWxsTGF5b3V0LFxuICAgICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhpcy5lbCkubGF5b3V0LFxuICAgICAgZnVsbE1lcmdlQ3VzdG9taXplclxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgUG9pbnRzIGRhdGEgc3RydWN0dXJlIGZyb20gZGF0YSBzdXBwbGllZCBieSB0aGUgcGxvdGx5X2NsaWNrLFxuICAgKiBwbG90bHlfaG92ZXIsIG9yIHBsb3RseV9zZWxlY3QgZXZlbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm5zIHtudWxsfFBvaW50c31cbiAgICovXG4gIGJ1aWxkUG9pbnRzT2JqZWN0KGRhdGE6IGFueSk6IG51bGwgfCBQb2ludHMge1xuICAgIHZhciBwb2ludHNPYmplY3Q6IFBvaW50cztcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInBvaW50c1wiKSkge1xuICAgICAgLy8gTW9zdCBjYXJ0ZXNpYW4gcGxvdHNcbiAgICAgIHZhciBwb2ludE9iamVjdHMgPSBkYXRhW1wicG9pbnRzXCJdO1xuICAgICAgdmFyIG51bVBvaW50cyA9IHBvaW50T2JqZWN0cy5sZW5ndGg7XG5cbiAgICAgIHZhciBoYXNOZXN0ZWRQb2ludE9iamVjdHMgPSB0cnVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuICAgICAgICBoYXNOZXN0ZWRQb2ludE9iamVjdHMgPVxuICAgICAgICAgIGhhc05lc3RlZFBvaW50T2JqZWN0cyAmJlxuICAgICAgICAgIHBvaW50T2JqZWN0c1tpXS5oYXNPd25Qcm9wZXJ0eShcInBvaW50TnVtYmVyc1wiKTtcbiAgICAgICAgaWYgKCFoYXNOZXN0ZWRQb2ludE9iamVjdHMpIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIG51bVBvaW50TnVtYmVycyA9IG51bVBvaW50cztcbiAgICAgIGlmIChoYXNOZXN0ZWRQb2ludE9iamVjdHMpIHtcbiAgICAgICAgbnVtUG9pbnROdW1iZXJzID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuICAgICAgICAgIG51bVBvaW50TnVtYmVycyArPSBwb2ludE9iamVjdHNbaV1bXCJwb2ludE51bWJlcnNcIl0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludHNPYmplY3QgPSB7XG4gICAgICAgIHRyYWNlX2luZGV4ZXM6IG5ldyBBcnJheShudW1Qb2ludE51bWJlcnMpLFxuICAgICAgICBwb2ludF9pbmRleGVzOiBuZXcgQXJyYXkobnVtUG9pbnROdW1iZXJzKSxcbiAgICAgICAgeHM6IG5ldyBBcnJheShudW1Qb2ludE51bWJlcnMpLFxuICAgICAgICB5czogbmV3IEFycmF5KG51bVBvaW50TnVtYmVycyksXG4gICAgICB9O1xuXG4gICAgICBpZiAoaGFzTmVzdGVkUG9pbnRPYmplY3RzKSB7XG4gICAgICAgIHZhciBmbGF0UG9pbnRJbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtUG9pbnRzOyBwKyspIHtcbiAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgaSA8IHBvaW50T2JqZWN0c1twXVtcInBvaW50TnVtYmVyc1wiXS5sZW5ndGg7XG4gICAgICAgICAgICBpKyssIGZsYXRQb2ludEluZGV4KytcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBvaW50c09iamVjdFtcInBvaW50X2luZGV4ZXNcIl1bZmxhdFBvaW50SW5kZXhdID1cbiAgICAgICAgICAgICAgcG9pbnRPYmplY3RzW3BdW1wicG9pbnROdW1iZXJzXCJdW2ldO1xuICAgICAgICAgICAgLy8gYWxzbyBhZGQgeHMsIHlzIGFuZCB0cmFjZXMgc28gdGhhdCB0aGUgYXJyYXkgZG9lc24ndCBnZXQgdHJ1bmNhdGVkIGxhdGVyXG4gICAgICAgICAgICBwb2ludHNPYmplY3RbXCJ4c1wiXVtmbGF0UG9pbnRJbmRleF0gPSBwb2ludE9iamVjdHNbcF1bXCJ4XCJdO1xuICAgICAgICAgICAgcG9pbnRzT2JqZWN0W1wieXNcIl1bZmxhdFBvaW50SW5kZXhdID0gcG9pbnRPYmplY3RzW3BdW1wieVwiXTtcbiAgICAgICAgICAgIHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1bZmxhdFBvaW50SW5kZXhdID1cbiAgICAgICAgICAgICAgcG9pbnRPYmplY3RzW3BdW1wiY3VydmVOdW1iZXJcIl07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNpbmdsZV90cmFjZSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnVtUG9pbnROdW1iZXJzOyBpKyspIHtcbiAgICAgICAgICBzaW5nbGVfdHJhY2UgPSBzaW5nbGVfdHJhY2UgJiYgKHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1baSAtIDFdID09PSBwb2ludHNPYmplY3RbXCJ0cmFjZV9pbmRleGVzXCJdW2ldKVxuICAgICAgICAgIGlmICghc2luZ2xlX3RyYWNlKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2luZ2xlX3RyYWNlKSB7XG4gICAgICAgICAgcG9pbnRzT2JqZWN0W1wicG9pbnRfaW5kZXhlc1wiXS5zb3J0KChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBudW1Qb2ludHM7IHArKykge1xuICAgICAgICAgIHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1bcF0gPSBwb2ludE9iamVjdHNbcF1bXCJjdXJ2ZU51bWJlclwiXTtcbiAgICAgICAgICBwb2ludHNPYmplY3RbXCJwb2ludF9pbmRleGVzXCJdW3BdID0gcG9pbnRPYmplY3RzW3BdW1wicG9pbnROdW1iZXJcIl07XG4gICAgICAgICAgcG9pbnRzT2JqZWN0W1wieHNcIl1bcF0gPSBwb2ludE9iamVjdHNbcF1bXCJ4XCJdO1xuICAgICAgICAgIHBvaW50c09iamVjdFtcInlzXCJdW3BdID0gcG9pbnRPYmplY3RzW3BdW1wieVwiXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZGQgeiBpZiBwcmVzZW50XG4gICAgICB2YXIgaGFzWiA9XG4gICAgICAgIHBvaW50T2JqZWN0c1swXSAhPT0gdW5kZWZpbmVkICYmIHBvaW50T2JqZWN0c1swXS5oYXNPd25Qcm9wZXJ0eShcInpcIik7XG4gICAgICBpZiAoaGFzWikge1xuICAgICAgICBwb2ludHNPYmplY3RbXCJ6c1wiXSA9IG5ldyBBcnJheShudW1Qb2ludHMpO1xuICAgICAgICBmb3IgKHAgPSAwOyBwIDwgbnVtUG9pbnRzOyBwKyspIHtcbiAgICAgICAgICBwb2ludHNPYmplY3RbXCJ6c1wiXVtwXSA9IHBvaW50T2JqZWN0c1twXVtcInpcIl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvaW50c09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIElucHV0RGV2aWNlU3RhdGUgZGF0YSBzdHJ1Y3R1cmUgZnJvbSBkYXRhIHN1cHBsaWVkIGJ5IHRoZVxuICAgKiBwbG90bHlfY2xpY2ssIHBsb3RseV9ob3Zlciwgb3IgcGxvdGx5X3NlbGVjdCBldmVudHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybnMge251bGx8SW5wdXREZXZpY2VTdGF0ZX1cbiAgICovXG4gIGJ1aWxkSW5wdXREZXZpY2VTdGF0ZU9iamVjdChkYXRhOiBhbnkpOiBudWxsIHwgSW5wdXREZXZpY2VTdGF0ZSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVtcImV2ZW50XCJdO1xuICAgIGlmIChldmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLyoqIEB0eXBlIHtJbnB1dERldmljZVN0YXRlfSAqL1xuICAgICAgdmFyIGlucHV0RGV2aWNlU3RhdGU6IElucHV0RGV2aWNlU3RhdGUgPSB7XG4gICAgICAgIC8vIEtleWJvYXJkIG1vZGlmaWVyc1xuICAgICAgICBhbHQ6IGV2ZW50W1wiYWx0S2V5XCJdLFxuICAgICAgICBjdHJsOiBldmVudFtcImN0cmxLZXlcIl0sXG4gICAgICAgIG1ldGE6IGV2ZW50W1wibWV0YUtleVwiXSxcbiAgICAgICAgc2hpZnQ6IGV2ZW50W1wic2hpZnRLZXlcIl0sXG5cbiAgICAgICAgLy8gTW91c2UgYnV0dG9uc1xuICAgICAgICBidXR0b246IGV2ZW50W1wiYnV0dG9uXCJdLFxuICAgICAgICBidXR0b25zOiBldmVudFtcImJ1dHRvbnNcIl0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGlucHV0RGV2aWNlU3RhdGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIFNlbGVjdG9yIGRhdGEgc3RydWN0dXJlIGZyb20gZGF0YSBzdXBwbGllZCBieSB0aGVcbiAgICogcGxvdGx5X3NlbGVjdCBldmVudFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7bnVsbHxTZWxlY3Rvcn1cbiAgICovXG4gIGJ1aWxkU2VsZWN0b3JPYmplY3QoZGF0YTogYW55KTogbnVsbCB8IFNlbGVjdG9yIHtcbiAgICB2YXIgc2VsZWN0b3JPYmplY3Q6IFNlbGVjdG9yO1xuXG4gICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJyYW5nZVwiKSkge1xuICAgICAgLy8gQm94IHNlbGVjdGlvblxuICAgICAgc2VsZWN0b3JPYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IFwiYm94XCIsXG4gICAgICAgIHNlbGVjdG9yX3N0YXRlOiB7XG4gICAgICAgICAgeHJhbmdlOiBkYXRhW1wicmFuZ2VcIl1bXCJ4XCJdLFxuICAgICAgICAgIHlyYW5nZTogZGF0YVtcInJhbmdlXCJdW1wieVwiXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwibGFzc29Qb2ludHNcIikpIHtcbiAgICAgIC8vIExhc3NvIHNlbGVjdGlvblxuICAgICAgc2VsZWN0b3JPYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IFwibGFzc29cIixcbiAgICAgICAgc2VsZWN0b3Jfc3RhdGU6IHtcbiAgICAgICAgICB4czogZGF0YVtcImxhc3NvUG9pbnRzXCJdW1wieFwiXSxcbiAgICAgICAgICB5czogZGF0YVtcImxhc3NvUG9pbnRzXCJdW1wieVwiXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yT2JqZWN0ID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBwbG90eV9yZXN0eWxlIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9yZXN0eWxlKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gZGF0YSB0byByZXBvcnQgdG8gdGhlIFB5dGhvbiBzaWRlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGFbMF0gJiYgZGF0YVswXS5oYXNPd25Qcm9wZXJ0eShcIl9kb05vdFJlcG9ydFRvUHlcIikpIHtcbiAgICAgIC8vIFJlc3R5bGUgb3JpZ2luYXRlZCBvbiB0aGUgUHl0aG9uIHNpZGVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVbnBhY2sgZGF0YVxuICAgIHZhciBzdHlsZURhdGEgPSBkYXRhWzBdO1xuICAgIHZhciBzdHlsZVRyYWNlcyA9IGRhdGFbMV07XG5cbiAgICAvLyBDb25zdHJ1Y3QgcmVzdHlsZSBtZXNzYWdlIHRvIHNlbmQgdG8gdGhlIFB5dGhvbiBzaWRlXG4gICAgLyoqIEB0eXBlIHtKczJQeVJlc3R5bGVNc2d9ICovXG4gICAgdmFyIHJlc3R5bGVNc2c6IEpzMlB5UmVzdHlsZU1zZyA9IHtcbiAgICAgIHN0eWxlX2RhdGE6IHN0eWxlRGF0YSxcbiAgICAgIHN0eWxlX3RyYWNlczogc3R5bGVUcmFjZXMsXG4gICAgICBzb3VyY2Vfdmlld19pZDogdGhpcy52aWV3SUQsXG4gICAgfTtcblxuICAgIHRoaXMubW9kZWwuc2V0KFwiX2pzMnB5X3Jlc3R5bGVcIiwgcmVzdHlsZU1zZyk7XG4gICAgdGhpcy50b3VjaCgpO1xuICB9XG5cbiAgdG91Y2goKSB7XG4gICAgdGhpcy5tb2RlbC5zYXZlX2NoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X3JlbGF5b3V0IGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9yZWxheW91dChkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIGRhdGEgdG8gcmVwb3J0IHRvIHRoZSBQeXRob24gc2lkZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiX2RvTm90UmVwb3J0VG9QeVwiKSkge1xuICAgICAgLy8gUmVsYXlvdXQgb3JpZ2luYXRlZCBvbiB0aGUgUHl0aG9uIHNpZGVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0pzMlB5UmVsYXlvdXRNc2d9ICovXG4gICAgdmFyIHJlbGF5b3V0TXNnOiBKczJQeVJlbGF5b3V0TXNnID0ge1xuICAgICAgcmVsYXlvdXRfZGF0YTogZGF0YSxcbiAgICAgIHNvdXJjZV92aWV3X2lkOiB0aGlzLnZpZXdJRCxcbiAgICB9O1xuXG4gICAgdGhpcy5tb2RlbC5zZXQoXCJfanMycHlfcmVsYXlvdXRcIiwgcmVsYXlvdXRNc2cpO1xuICAgIHRoaXMudG91Y2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X3VwZGF0ZSBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfdXBkYXRlKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gZGF0YSB0byByZXBvcnQgdG8gdGhlIFB5dGhvbiBzaWRlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGFbXCJkYXRhXCJdICYmIGRhdGFbXCJkYXRhXCJdWzBdLmhhc093blByb3BlcnR5KFwiX2RvTm90UmVwb3J0VG9QeVwiKSkge1xuICAgICAgLy8gVXBkYXRlIG9yaWdpbmF0ZWQgb24gdGhlIFB5dGhvbiBzaWRlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtKczJQeVVwZGF0ZU1zZ30gKi9cbiAgICB2YXIgdXBkYXRlTXNnOiBKczJQeVVwZGF0ZU1zZyA9IHtcbiAgICAgIHN0eWxlX2RhdGE6IGRhdGFbXCJkYXRhXCJdWzBdLFxuICAgICAgc3R5bGVfdHJhY2VzOiBkYXRhW1wiZGF0YVwiXVsxXSxcbiAgICAgIGxheW91dF9kYXRhOiBkYXRhW1wibGF5b3V0XCJdLFxuICAgICAgc291cmNlX3ZpZXdfaWQ6IHRoaXMudmlld0lELFxuICAgIH07XG5cbiAgICAvLyBMb2cgbWVzc2FnZVxuICAgIHRoaXMubW9kZWwuc2V0KFwiX2pzMnB5X3VwZGF0ZVwiLCB1cGRhdGVNc2cpO1xuICAgIHRoaXMudG91Y2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X2NsaWNrIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9jbGljayhkYXRhOiBhbnkpIHtcbiAgICB0aGlzLl9zZW5kX3BvaW50c19jYWxsYmFja19tZXNzYWdlKGRhdGEsIFwicGxvdGx5X2NsaWNrXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBwbG90bHlfaG92ZXIgZXZlbnRzIGVtaXR0ZWQgYnkgdGhlIFBsb3RseS5qcyBsaWJyYXJ5XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBoYW5kbGVfcGxvdGx5X2hvdmVyKGRhdGE6IGFueSkge1xuICAgIHRoaXMuX3NlbmRfcG9pbnRzX2NhbGxiYWNrX21lc3NhZ2UoZGF0YSwgXCJwbG90bHlfaG92ZXJcIik7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHBsb3RseV91bmhvdmVyIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV91bmhvdmVyKGRhdGE6IGFueSkge1xuICAgIHRoaXMuX3NlbmRfcG9pbnRzX2NhbGxiYWNrX21lc3NhZ2UoZGF0YSwgXCJwbG90bHlfdW5ob3ZlclwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X3NlbGVjdGVkIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9zZWxlY3RlZChkYXRhOiBhbnkpIHtcbiAgICB0aGlzLl9zZW5kX3BvaW50c19jYWxsYmFja19tZXNzYWdlKGRhdGEsIFwicGxvdGx5X3NlbGVjdGVkXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBwbG90bHlfZGVzZWxlY3QgZXZlbnRzIGVtaXR0ZWQgYnkgdGhlIFBsb3RseS5qcyBsaWJyYXJ5XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBoYW5kbGVfcGxvdGx5X2Rlc2VsZWN0KGRhdGE6IGFueSkge1xuICAgIGRhdGEgPSB7XG4gICAgICBwb2ludHM6IFtdLFxuICAgIH07XG4gICAgdGhpcy5fc2VuZF9wb2ludHNfY2FsbGJhY2tfbWVzc2FnZShkYXRhLCBcInBsb3RseV9kZXNlbGVjdFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZCBhbmQgc2VuZCBhIHBvaW50cyBjYWxsYmFjayBtZXNzYWdlIHRvIHRoZSBQeXRob24gc2lkZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiAgZGF0YSBvYmplY3QgYXMgcHJvdmlkZWQgYnkgdGhlIHBsb3RseV9jbGljaywgcGxvdGx5X2hvdmVyLFxuICAgKiAgcGxvdGx5X3VuaG92ZXIsIG9yIHBsb3RseV9zZWxlY3RlZCBldmVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50X3R5cGVcbiAgICogIE5hbWUgb2YgdGhlIHRyaWdnZXJpbmcgZXZlbnQuIE9uZSBvZiAncGxvdGx5X2NsaWNrJyxcbiAgICogICdwbG90bHlfaG92ZXInLCAncGxvdGx5X3VuaG92ZXInLCBvciAncGxvdGx5X3NlbGVjdGVkJ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NlbmRfcG9pbnRzX2NhbGxiYWNrX21lc3NhZ2UoZGF0YTogYW55LCBldmVudF90eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIGRhdGEgdG8gcmVwb3J0IHRvIHRoZSBQeXRob24gc2lkZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7SnMyUHlQb2ludHNDYWxsYmFja01zZ30gKi9cbiAgICB2YXIgcG9pbnRzTXNnOiBKczJQeVBvaW50c0NhbGxiYWNrTXNnID0ge1xuICAgICAgZXZlbnRfdHlwZTogZXZlbnRfdHlwZSxcbiAgICAgIHBvaW50czogdGhpcy5idWlsZFBvaW50c09iamVjdChkYXRhKSxcbiAgICAgIGRldmljZV9zdGF0ZTogdGhpcy5idWlsZElucHV0RGV2aWNlU3RhdGVPYmplY3QoZGF0YSksXG4gICAgICBzZWxlY3RvcjogdGhpcy5idWlsZFNlbGVjdG9yT2JqZWN0KGRhdGEpLFxuICAgIH07XG5cbiAgICBpZiAocG9pbnRzTXNnW1wicG9pbnRzXCJdICE9PSBudWxsICYmIHBvaW50c01zZ1tcInBvaW50c1wiXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1vZGVsLnNldChcIl9qczJweV9wb2ludHNDYWxsYmFja1wiLCBwb2ludHNNc2cpO1xuICAgICAgdGhpcy50b3VjaCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHViIGZvciBmdXR1cmUgaGFuZGxpbmcgb2YgcGxvdGx5X2RvdWJsZWNsaWNrXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBoYW5kbGVfcGxvdGx5X2RvdWJsZWNsaWNrKGRhdGE6IGFueSkge31cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5hZGRUcmFjZXMgcmVxdWVzdFxuICAgKi9cbiAgZG9fYWRkVHJhY2VzKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNBZGRUcmFjZXNNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzQWRkVHJhY2VzTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfYWRkVHJhY2VzXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIFBsb3RseS5hZGRUcmFjZXModGhpcy5lbCwgbXNnRGF0YS50cmFjZV9kYXRhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgICB0aGF0Ll9zZW5kVHJhY2VEZWx0YXMobXNnRGF0YS50cmFjZV9lZGl0X2lkKTtcblxuICAgICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICAgIHZhciBsYXlvdXRfZWRpdF9pZCA9IG1zZ0RhdGEubGF5b3V0X2VkaXRfaWQ7XG4gICAgICAgIHRoYXQuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5kZWxldGVUcmFjZXMgcmVxdWVzdFxuICAgKi9cbiAgZG9fZGVsZXRlVHJhY2VzKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNEZWxldGVUcmFjZXNNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzRGVsZXRlVHJhY2VzTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfZGVsZXRlVHJhY2VzXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBkZWxldGVfaW5kcyA9IG1zZ0RhdGEuZGVsZXRlX2luZHM7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICBQbG90bHkuZGVsZXRlVHJhY2VzKHRoaXMuZWwsIGRlbGV0ZV9pbmRzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgICB2YXIgdHJhY2VfZWRpdF9pZCA9IG1zZ0RhdGEudHJhY2VfZWRpdF9pZDtcbiAgICAgICAgdGhhdC5fc2VuZFRyYWNlRGVsdGFzKHRyYWNlX2VkaXRfaWQpO1xuXG4gICAgICAgIC8vICMjIyBTZW5kIGxheW91dCBkZWx0YSAjIyNcbiAgICAgICAgdmFyIGxheW91dF9lZGl0X2lkID0gbXNnRGF0YS5sYXlvdXRfZWRpdF9pZDtcbiAgICAgICAgdGhhdC5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgUGxvdGx5Lm1vdmVUcmFjZXMgcmVxdWVzdFxuICAgKi9cbiAgZG9fbW92ZVRyYWNlcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzTW92ZVRyYWNlc01zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNNb3ZlVHJhY2VzTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfbW92ZVRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICAvLyBVbnBhY2sgbWVzc2FnZVxuICAgICAgdmFyIGN1cnJlbnRJbmRzID0gbXNnRGF0YS5jdXJyZW50X3RyYWNlX2luZHM7XG4gICAgICB2YXIgbmV3SW5kcyA9IG1zZ0RhdGEubmV3X3RyYWNlX2luZHM7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBuZXcgdHJhY2UgaW5kZXhlcyBhcmUgYWN0dWFsbHkgZGlmZmVyZW50IHRoYW5cbiAgICAgIC8vIHRoZSBjdXJyZW50IGluZGV4ZXNcbiAgICAgIHZhciBpbmRzX2VxdWFsID0gXy5pc0VxdWFsKGN1cnJlbnRJbmRzLCBuZXdJbmRzKTtcblxuICAgICAgaWYgKCFpbmRzX2VxdWFsKSB7XG4gICAgICAgIFBsb3RseS5tb3ZlVHJhY2VzKHRoaXMuZWwsIGN1cnJlbnRJbmRzLCBuZXdJbmRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5yZXN0eWxlIHJlcXVlc3RcbiAgICovXG4gIGRvX3Jlc3R5bGUoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc1Jlc3R5bGVNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzUmVzdHlsZU1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3Jlc3R5bGVcIik7XG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciByZXN0eWxlRGF0YSA9IG1zZ0RhdGEucmVzdHlsZV9kYXRhO1xuICAgICAgdmFyIHRyYWNlSW5kZXhlcyA9ICh0aGlzLm1vZGVsIGFzIEZpZ3VyZU1vZGVsKS5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMoXG4gICAgICAgIG1zZ0RhdGEucmVzdHlsZV90cmFjZXNcbiAgICAgICk7XG5cbiAgICAgIHJlc3R5bGVEYXRhW1wiX2RvTm90UmVwb3J0VG9QeVwiXSA9IHRydWU7XG4gICAgICBQbG90bHkucmVzdHlsZSh0aGlzLmVsLCByZXN0eWxlRGF0YSwgdHJhY2VJbmRleGVzKTtcblxuICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgLy8gV2UgY3JlYXRlIGFuIGFycmF5IG9mIGRlbHRhcyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZXN0eWxlZFxuICAgICAgLy8gdHJhY2VzLlxuICAgICAgdGhpcy5fc2VuZFRyYWNlRGVsdGFzKG1zZ0RhdGEudHJhY2VfZWRpdF9pZCk7XG5cbiAgICAgIC8vICMjIyBTZW5kIGxheW91dCBkZWx0YSAjIyNcbiAgICAgIHZhciBsYXlvdXRfZWRpdF9pZCA9IG1zZ0RhdGEubGF5b3V0X2VkaXRfaWQ7XG4gICAgICB0aGlzLl9zZW5kTGF5b3V0RGVsdGEobGF5b3V0X2VkaXRfaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgUGxvdGx5LnJlbGF5b3V0IHJlcXVlc3RcbiAgICovXG4gIGRvX3JlbGF5b3V0KCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNSZWxheW91dE1zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNSZWxheW91dE1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3JlbGF5b3V0XCIpO1xuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICBpZiAobXNnRGF0YS5zb3VyY2Vfdmlld19pZCAhPT0gdGhpcy52aWV3SUQpIHtcbiAgICAgICAgdmFyIHJlbGF5b3V0RGF0YSA9IG1zZ0RhdGEucmVsYXlvdXRfZGF0YTtcbiAgICAgICAgcmVsYXlvdXREYXRhW1wiX2RvTm90UmVwb3J0VG9QeVwiXSA9IHRydWU7XG4gICAgICAgIFBsb3RseS5yZWxheW91dCh0aGlzLmVsLCBtc2dEYXRhLnJlbGF5b3V0X2RhdGEpO1xuICAgICAgfVxuXG4gICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSBtc2dEYXRhLmxheW91dF9lZGl0X2lkO1xuICAgICAgdGhpcy5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS51cGRhdGUgcmVxdWVzdFxuICAgKi9cbiAgZG9fdXBkYXRlKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNVcGRhdGVNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzVXBkYXRlTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfdXBkYXRlXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBzdHlsZSA9IG1zZ0RhdGEuc3R5bGVfZGF0YSB8fCB7fTtcbiAgICAgIHZhciBsYXlvdXQgPSBtc2dEYXRhLmxheW91dF9kYXRhIHx8IHt9O1xuICAgICAgdmFyIHRyYWNlSW5kZXhlcyA9ICh0aGlzLm1vZGVsIGFzIEZpZ3VyZU1vZGVsKS5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMoXG4gICAgICAgIG1zZ0RhdGEuc3R5bGVfdHJhY2VzXG4gICAgICApO1xuXG4gICAgICBzdHlsZVtcIl9kb05vdFJlcG9ydFRvUHlcIl0gPSB0cnVlO1xuICAgICAgUGxvdGx5LnVwZGF0ZSh0aGlzLmVsLCBzdHlsZSwgbGF5b3V0LCB0cmFjZUluZGV4ZXMpO1xuXG4gICAgICAvLyAjIyMgU2VuZCB0cmFjZSBkZWx0YXMgIyMjXG4gICAgICAvLyBXZSBjcmVhdGUgYW4gYXJyYXkgb2YgZGVsdGFzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHVwZGF0ZWRcbiAgICAgIC8vIHRyYWNlcy5cbiAgICAgIHRoaXMuX3NlbmRUcmFjZURlbHRhcyhtc2dEYXRhLnRyYWNlX2VkaXRfaWQpO1xuXG4gICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSBtc2dEYXRhLmxheW91dF9lZGl0X2lkO1xuICAgICAgdGhpcy5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5hbmltYXRlIHJlcXVlc3RcbiAgICovXG4gIGRvX2FuaW1hdGUoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc0FuaW1hdGVNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzQW5pbWF0ZU1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2FuaW1hdGVcIik7XG5cbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgLy8gVW5wYWNrIHBhcmFtc1xuICAgICAgLy8gdmFyIGFuaW1hdGlvbkRhdGEgPSBtc2dEYXRhWzBdO1xuICAgICAgdmFyIGFuaW1hdGlvbk9wdHMgPSBtc2dEYXRhLmFuaW1hdGlvbl9vcHRzO1xuXG4gICAgICB2YXIgc3R5bGVzID0gbXNnRGF0YS5zdHlsZV9kYXRhO1xuICAgICAgdmFyIGxheW91dCA9IG1zZ0RhdGEubGF5b3V0X2RhdGE7XG4gICAgICB2YXIgdHJhY2VJbmRleGVzID0gKHRoaXMubW9kZWwgYXMgRmlndXJlTW9kZWwpLl9ub3JtYWxpemVfdHJhY2VfaW5kZXhlcyhcbiAgICAgICAgbXNnRGF0YS5zdHlsZV90cmFjZXNcbiAgICAgICk7XG5cbiAgICAgIHZhciBhbmltYXRpb25EYXRhOiBhbnkgPSB7XG4gICAgICAgIGRhdGE6IHN0eWxlcyxcbiAgICAgICAgbGF5b3V0OiBsYXlvdXQsXG4gICAgICAgIHRyYWNlczogdHJhY2VJbmRleGVzLFxuICAgICAgfTtcblxuICAgICAgYW5pbWF0aW9uRGF0YVtcIl9kb05vdFJlcG9ydFRvUHlcIl0gPSB0cnVlO1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBQbG90bHkuYW5pbWF0ZSh0aGlzLmVsLCBhbmltYXRpb25EYXRhLCBhbmltYXRpb25PcHRzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgICAvLyBXZSBjcmVhdGUgYW4gYXJyYXkgb2YgZGVsdGFzIGNvcnJlc3BvbmRpbmcgdG8gdGhlXG4gICAgICAgIC8vIGFuaW1hdGVkIHRyYWNlcy5cbiAgICAgICAgdGhhdC5fc2VuZFRyYWNlRGVsdGFzKG1zZ0RhdGEudHJhY2VfZWRpdF9pZCk7XG5cbiAgICAgICAgLy8gIyMjIFNlbmQgbGF5b3V0IGRlbHRhICMjI1xuICAgICAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSBtc2dEYXRhLmxheW91dF9lZGl0X2lkO1xuICAgICAgICB0aGF0Ll9zZW5kTGF5b3V0RGVsdGEobGF5b3V0X2VkaXRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBsYXlvdXQgZGVsdGEgb2JqZWN0IGFuZCBzZW5kIGxheW91dERlbHRhIG1lc3NhZ2UgdG8gdGhlXG4gICAqIFB5dGhvbiBzaWRlXG4gICAqXG4gICAqIEBwYXJhbSBsYXlvdXRfZWRpdF9pZFxuICAgKiAgRWRpdCBJRCBvZiBtZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjcmVhdGlvbiBvZiB0aGUgbGF5b3V0IGRlbHRhXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkOiBhbnkpIHtcbiAgICAvLyAjIyMgSGFuZGxlIGxheW91dCBkZWx0YSAjIyNcbiAgICB2YXIgbGF5b3V0X2RlbHRhID0gY3JlYXRlRGVsdGFPYmplY3QoXG4gICAgICB0aGlzLmdldEZ1bGxMYXlvdXQoKSxcbiAgICAgIHRoaXMubW9kZWwuZ2V0KFwiX2xheW91dFwiKVxuICAgICk7XG5cbiAgICAvKiogQHR5cGV7SnMyUHlMYXlvdXREZWx0YU1zZ30gKi9cbiAgICB2YXIgbGF5b3V0RGVsdGFNc2c6IEpzMlB5TGF5b3V0RGVsdGFNc2cgPSB7XG4gICAgICBsYXlvdXRfZGVsdGE6IGxheW91dF9kZWx0YSxcbiAgICAgIGxheW91dF9lZGl0X2lkOiBsYXlvdXRfZWRpdF9pZCxcbiAgICB9O1xuXG4gICAgdGhpcy5tb2RlbC5zZXQoXCJfanMycHlfbGF5b3V0RGVsdGFcIiwgbGF5b3V0RGVsdGFNc2cpO1xuICAgIHRoaXMudG91Y2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgdHJhY2UgZGVsdGFzIGFycmF5IGZvciB0aGUgcmVxdWVzdGVkIHRyYWNlIGluZGV4ZXMgYW5kXG4gICAqIHNlbmQgdHJhY2VEZWx0YXMgbWVzc2FnZSB0byB0aGUgUHl0aG9uIHNpZGVcbiAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdHJhY2VzIGZvciB3aGljaCB0byBjb21wdXRlIGRlbHRhc1xuICAgKiBAcGFyYW0gdHJhY2VfZWRpdF9pZFxuICAgKiAgRWRpdCBJRCBvZiBtZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjcmVhdGlvbiBvZiB0cmFjZSBkZWx0YXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZW5kVHJhY2VEZWx0YXModHJhY2VfZWRpdF9pZDogYW55KSB7XG4gICAgdmFyIHRyYWNlX2RhdGEgPSB0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpO1xuICAgIHZhciB0cmFjZUluZGV4ZXMgPSBfLnJhbmdlKHRyYWNlX2RhdGEubGVuZ3RoKTtcbiAgICB2YXIgdHJhY2VfZGVsdGFzID0gbmV3IEFycmF5KHRyYWNlSW5kZXhlcy5sZW5ndGgpO1xuXG4gICAgdmFyIGZ1bGxEYXRhID0gdGhpcy5nZXRGdWxsRGF0YSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHJhY2VJbmQgPSB0cmFjZUluZGV4ZXNbaV07XG4gICAgICB0cmFjZV9kZWx0YXNbaV0gPSBjcmVhdGVEZWx0YU9iamVjdChcbiAgICAgICAgZnVsbERhdGFbdHJhY2VJbmRdLFxuICAgICAgICB0cmFjZV9kYXRhW3RyYWNlSW5kXVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogQHR5cGV7SnMyUHlUcmFjZURlbHRhc01zZ30gKi9cbiAgICB2YXIgdHJhY2VEZWx0YXNNc2c6IEpzMlB5VHJhY2VEZWx0YXNNc2cgPSB7XG4gICAgICB0cmFjZV9kZWx0YXM6IHRyYWNlX2RlbHRhcyxcbiAgICAgIHRyYWNlX2VkaXRfaWQ6IHRyYWNlX2VkaXRfaWQsXG4gICAgfTtcblxuICAgIHRoaXMubW9kZWwuc2V0KFwiX2pzMnB5X3RyYWNlRGVsdGFzXCIsIHRyYWNlRGVsdGFzTXNnKTtcbiAgICB0aGlzLnRvdWNoKCk7XG4gIH1cbn1cblxuLy8gU2VyaWFsaXphdGlvblxuLyoqXG4gKiBDcmVhdGUgYSBtYXBwaW5nIGZyb20gbnVtcHkgZHR5cGUgc3RyaW5ncyB0byBjb3JyZXNwb25kaW5nIHR5cGVkIGFycmF5XG4gKiBjb25zdHJ1Y3RvcnNcbiAqL1xuY29uc3QgbnVtcHlfZHR5cGVfdG9fdHlwZWRhcnJheV90eXBlID0ge1xuICBpbnQ4OiBJbnQ4QXJyYXksXG4gIGludDE2OiBJbnQxNkFycmF5LFxuICBpbnQzMjogSW50MzJBcnJheSxcbiAgdWludDg6IFVpbnQ4QXJyYXksXG4gIHVpbnQxNjogVWludDE2QXJyYXksXG4gIHVpbnQzMjogVWludDMyQXJyYXksXG4gIGZsb2F0MzI6IEZsb2F0MzJBcnJheSxcbiAgZmxvYXQ2NDogRmxvYXQ2NEFycmF5LFxufTtcblxuZnVuY3Rpb24gc2VyaWFsaXplVHlwZWRBcnJheSh2OiBBcnJheUNvbnN0cnVjdG9yKSB7XG4gIHZhciBudW1weVR5cGU7XG4gIGlmICh2IGluc3RhbmNlb2YgSW50OEFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJpbnQ4XCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIEludDE2QXJyYXkpIHtcbiAgICBudW1weVR5cGUgPSBcImludDE2XCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIEludDMyQXJyYXkpIHtcbiAgICBudW1weVR5cGUgPSBcImludDMyXCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICBudW1weVR5cGUgPSBcInVpbnQ4XCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJ1aW50MTZcIjtcbiAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICBudW1weVR5cGUgPSBcInVpbnQzMlwiO1xuICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICBudW1weVR5cGUgPSBcImZsb2F0MzJcIjtcbiAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJmbG9hdDY0XCI7XG4gIH0gZWxzZSB7XG4gICAgLy8gRG9uJ3QgdW5kZXJzdGFuZCBpdCwgcmV0dXJuIGFzIGlzXG4gICAgcmV0dXJuIHY7XG4gIH1cbiAgdmFyIHJlcyA9IHtcbiAgICBkdHlwZTogbnVtcHlUeXBlLFxuICAgIHNoYXBlOiBbdi5sZW5ndGhdLFxuICAgIHZhbHVlOiB2LmJ1ZmZlcixcbiAgfTtcbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBpcHl3aWRnZXQgSmF2YVNjcmlwdCAtPiBQeXRob24gc2VyaWFsaXplclxuICovXG5mdW5jdGlvbiBqczJweV9zZXJpYWxpemVyKHY6IGFueSwgd2lkZ2V0TWFuYWdlcj86IGFueSkge1xuICB2YXIgcmVzOiBhbnk7XG5cbiAgaWYgKF8uaXNUeXBlZEFycmF5KHYpKSB7XG4gICAgcmVzID0gc2VyaWFsaXplVHlwZWRBcnJheSh2KTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgLy8gU2VyaWFsaXplIGFycmF5IGVsZW1lbnRzIHJlY3Vyc2l2ZWx5XG4gICAgcmVzID0gbmV3IEFycmF5KHYubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHYubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc1tpXSA9IGpzMnB5X3NlcmlhbGl6ZXIodltpXSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKF8uaXNQbGFpbk9iamVjdCh2KSkge1xuICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgcHJvcGVydGllcyByZWN1cnNpdmVseVxuICAgIHJlcyA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gdikge1xuICAgICAgaWYgKHYuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgcmVzW3BdID0ganMycHlfc2VyaWFsaXplcih2W3BdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gVHJhbnNsYXRlIHVuZGVmaW5lZCBpbnRvICdfdW5kZWZpbmVkXycgc2VudGluYWwgc3RyaW5nLiBUaGVcbiAgICAvLyBQeXRob24gX2pzX3RvX3B5IGRlc2VyaWFsaXplciB3aWxsIGNvbnZlcnQgdGhpcyBpbnRvIGFuXG4gICAgLy8gVW5kZWZpbmVkIG9iamVjdFxuICAgIHJlcyA9IFwiX3VuZGVmaW5lZF9cIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBQcmltaXRpdmUgdmFsdWUgdG8gdHJhbnNmZXIgZGlyZWN0bHlcbiAgICByZXMgPSB2O1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbi8qKlxuICogaXB5d2lkZ2V0IFB5dGhvbiAtPiBKYXZhc2NyaXB0IGRlc2VyaWFsaXplclxuICovXG5mdW5jdGlvbiBweTJqc19kZXNlcmlhbGl6ZXIodjogYW55LCB3aWRnZXRNYW5hZ2VyPzogYW55KSB7XG4gIHZhciByZXM6IGFueTtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgIC8vIERlc2VyaWFsaXplIGFycmF5IGVsZW1lbnRzIHJlY3Vyc2l2ZWx5XG4gICAgcmVzID0gbmV3IEFycmF5KHYubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHYubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc1tpXSA9IHB5MmpzX2Rlc2VyaWFsaXplcih2W2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXy5pc1BsYWluT2JqZWN0KHYpKSB7XG4gICAgaWYgKFxuICAgICAgKF8uaGFzKHYsIFwidmFsdWVcIikgfHwgXy5oYXModiwgXCJidWZmZXJcIikpICYmXG4gICAgICBfLmhhcyh2LCBcImR0eXBlXCIpICYmXG4gICAgICBfLmhhcyh2LCBcInNoYXBlXCIpXG4gICAgKSB7XG4gICAgICAvLyBEZXNlcmlhbGl6ZSBzcGVjaWFsIGJ1ZmZlci9kdHlwZS9zaGFwZSBvYmplY3RzIGludG8gdHlwZWQgYXJyYXlzXG4gICAgICAvLyBUaGVzZSBvYmplY3RzIGNvcnJlc3BvbmQgdG8gbnVtcHkgYXJyYXlzIG9uIHRoZSBQeXRob24gc2lkZVxuICAgICAgLy9cbiAgICAgIC8vIE5vdGUgcGxvdGx5LnB5PD0zLjEuMSBjYWxsZWQgdGhlIGJ1ZmZlciBvYmplY3QgYGJ1ZmZlcmBcbiAgICAgIC8vIFRoaXMgd2FzIHJlbmFtZWQgYHZhbHVlYCBpbiAzLjIgdG8gd29yayBhcm91bmQgYSBuYW1pbmcgY29uZmxpY3RcbiAgICAgIC8vIHdoZW4gc2F2aW5nIHdpZGdldCBzdGF0ZSB0byBhIG5vdGVib29rLlxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdmFyIHR5cGVkYXJyYXlfdHlwZSA9IG51bXB5X2R0eXBlX3RvX3R5cGVkYXJyYXlfdHlwZVt2LmR0eXBlXTtcbiAgICAgIHZhciBidWZmZXIgPSBfLmhhcyh2LCBcInZhbHVlXCIpID8gdi52YWx1ZS5idWZmZXIgOiB2LmJ1ZmZlci5idWZmZXI7XG4gICAgICByZXMgPSBuZXcgdHlwZWRhcnJheV90eXBlKGJ1ZmZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlc2VyaWFsaXplIG9iamVjdCBwcm9wZXJ0aWVzIHJlY3Vyc2l2ZWx5XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGZvciAodmFyIHAgaW4gdikge1xuICAgICAgICBpZiAodi5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgIHJlc1twXSA9IHB5MmpzX2Rlc2VyaWFsaXplcih2W3BdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh2ID09PSBcIl91bmRlZmluZWRfXCIpIHtcbiAgICAvLyBDb252ZXJ0IHRoZSBfdW5kZWZpbmVkXyBzZW50aW5hbCBpbnRvIHVuZGVmaW5lZFxuICAgIHJlcyA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIHtcbiAgICAvLyBBY2NlcHQgcHJpbWl0aXZlIHZhbHVlIGRpcmVjdGx5XG4gICAgcmVzID0gdjtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBpbnB1dCB2YWx1ZSBpcyBhIHR5cGVkIGFycmF5XG4gKiBAcGFyYW0gcG90ZW50aWFsVHlwZWRBcnJheVxuICogIFZhbHVlIHRvIGV4YW1pbmVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1R5cGVkQXJyYXkocG90ZW50aWFsVHlwZWRBcnJheTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3KHBvdGVudGlhbFR5cGVkQXJyYXkpICYmXG4gICAgIShwb3RlbnRpYWxUeXBlZEFycmF5IGluc3RhbmNlb2YgRGF0YVZpZXcpXG4gICk7XG59XG5cbi8qKlxuICogQ3VzdG9taXplciBmb3IgdXNlIHdpdGggbG9kYXNoJ3MgbWVyZ2VXaXRoIGZ1bmN0aW9uXG4gKlxuICogVGhlIGN1c3RvbWl6ZXIgZW5zdXJlcyB0aGF0IHR5cGVkIGFycmF5cyBhcmUgbm90IGNvbnZlcnRlZCBpbnRvIHN0YW5kYXJkXG4gKiBhcnJheXMgZHVyaW5nIHRoZSByZWN1cnNpdmUgbWVyZ2VcbiAqXG4gKiBTZWU6IGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzL2xhdGVzdCNtZXJnZVdpdGhcbiAqL1xuZnVuY3Rpb24gZnVsbE1lcmdlQ3VzdG9taXplcihvYmpWYWx1ZTogYW55LCBzcmNWYWx1ZTogYW55LCBrZXk6IHN0cmluZykge1xuICBpZiAoa2V5WzBdID09PSBcIl9cIikge1xuICAgIC8vIERvbid0IHJlY3Vyc2UgaW50byBwcml2YXRlIHByb3BlcnRpZXNcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmIChpc1R5cGVkQXJyYXkoc3JjVmFsdWUpKSB7XG4gICAgLy8gUmV0dXJuIHR5cGVkIGFycmF5cyBkaXJlY3RseSwgZG9uJ3QgcmVjdXJzZSBpbnNpZGVcbiAgICByZXR1cm4gc3JjVmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWZvcm0gYSBQbG90bHkucmVsYXlvdXQgbGlrZSBvcGVyYXRpb24gb24gYW4gaW5wdXQgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmVudE9ialxuICogIFRoZSBvYmplY3QgdGhhdCB0aGUgcmVsYXlvdXQgb3BlcmF0aW9uIHNob3VsZCBiZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0ge09iamVjdH0gcmVsYXlvdXREYXRhXG4gKiAgQW4gcmVsYXlvdXQgb2JqZWN0IGFzIGFjY2VwdGVkIGJ5IFBsb3RseS5yZWxheW91dFxuICpcbiAqICBFeGFtcGxlczpcbiAqICAgICAgdmFyIGQgPSB7Zm9vIHtiYXIgWzUsIDEwXX19O1xuICogICAgICBwZXJmb3JtUmVsYXlvdXRMaWtlKGQsIHsnZm9vLmJhcic6IFswLCAxXX0pO1xuICogICAgICBkIC0+IHtmb286IHtiYXI6IFswLCAxXX19XG4gKlxuICogICAgICB2YXIgZCA9IHtmb28ge2JhciBbNSwgMTBdfX07XG4gKiAgICAgIHBlcmZvcm1SZWxheW91dExpa2UoZCwgeydiYXonOiAzNH0pO1xuICogICAgICBkIC0+IHtmb286IHtiYXI6IFs1LCAxMF19LCBiYXo6IDM0fVxuICpcbiAqICAgICAgdmFyIGQgPSB7Zm9vOiB7YmFyOiBbNSwgMTBdfTtcbiAqICAgICAgcGVyZm9ybVJlbGF5b3V0TGlrZShkLCB7J2Zvby5iYXpbMV0nOiAxN30pO1xuICogICAgICBkIC0+IHtmb286IHtiYXI6IFs1LCAxN119fVxuICpcbiAqL1xuZnVuY3Rpb24gcGVyZm9ybVJlbGF5b3V0TGlrZShwYXJlbnRPYmo6IGFueSwgcmVsYXlvdXREYXRhOiBhbnkpIHtcbiAgLy8gUGVyZm9ybSBhIHJlbGF5b3V0IHN0eWxlIG9wZXJhdGlvbiBvbiBhIGdpdmVuIHBhcmVudCBvYmplY3RcbiAgZm9yICh2YXIgcmF3S2V5IGluIHJlbGF5b3V0RGF0YSkge1xuICAgIGlmICghcmVsYXlvdXREYXRhLmhhc093blByb3BlcnR5KHJhd0tleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgdmFsdWUgZm9yIHRoaXMga2V5XG4gICAgdmFyIHJlbGF5b3V0VmFsID0gcmVsYXlvdXREYXRhW3Jhd0tleV07XG5cbiAgICAvLyBTZXQgcHJvcGVydHkgdmFsdWVcbiAgICBpZiAocmVsYXlvdXRWYWwgPT09IG51bGwpIHtcbiAgICAgIF8udW5zZXQocGFyZW50T2JqLCByYXdLZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLnNldChwYXJlbnRPYmosIHJhd0tleSwgcmVsYXlvdXRWYWwpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFBlcmZvcm0gYSBQbG90bHkucmVzdHlsZSBsaWtlIG9wZXJhdGlvbiBvbiBhbiBpbnB1dCBvYmplY3QgYXJyYXlcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBwYXJlbnRBcnJheVxuICogIFRoZSBvYmplY3QgdGhhdCB0aGUgcmVzdHlsZSBvcGVyYXRpb24gc2hvdWxkIGJlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSB7T2JqZWN0fSByZXN0eWxlRGF0YVxuICogIEEgcmVzdHlsZSBvYmplY3QgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LnJlc3R5bGVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IHJlc3R5bGVUcmFjZXNcbiAqICBBcnJheSBvZiBpbmRleGVzIG9mIHRoZSB0cmFjZXMgdGhhdCB0aGUgcmVzeXRsZSBvcGVyYXRpb24gYXBwbGllcyB0b1xuICpcbiAqICBFeGFtcGxlczpcbiAqICAgICAgdmFyIGQgPSBbe2Zvbzoge2JhcjogMX19LCB7fSwge31dXG4gKiAgICAgIHBlcmZvcm1SZXN0eWxlTGlrZShkLCB7J2Zvby5iYXInOiAyfSwgWzBdKVxuICogICAgICBkIC0+IFt7Zm9vOiB7YmFyOiAyfX0sIHt9LCB7fV1cbiAqXG4gKiAgICAgIHZhciBkID0gW3tmb286IHtiYXI6IDF9fSwge30sIHt9XVxuICogICAgICBwZXJmb3JtUmVzdHlsZUxpa2UoZCwgeydmb28uYmFyJzogMn0sIFswLCAxLCAyXSlcbiAqICAgICAgZCAtPiBbe2Zvbzoge2JhcjogMn19LCB7Zm9vOiB7YmFyOiAyfX0sIHtmb286IHtiYXI6IDJ9fV1cbiAqXG4gKiAgICAgIHZhciBkID0gW3tmb286IHtiYXI6IDF9fSwge30sIHt9XVxuICogICAgICBwZXJmb3JtUmVzdHlsZUxpa2UoZCwgeydmb28uYmFyJzogWzIsIDMsIDRdfSwgWzAsIDEsIDJdKVxuICogICAgICBkIC0+IFt7Zm9vOiB7YmFyOiAyfX0sIHtmb286IHtiYXI6IDN9fSwge2Zvbzoge2JhcjogNH19XVxuICpcbiAqL1xuZnVuY3Rpb24gcGVyZm9ybVJlc3R5bGVMaWtlKFxuICBwYXJlbnRBcnJheTogYW55W10sXG4gIHJlc3R5bGVEYXRhOiBhbnksXG4gIHJlc3R5bGVUcmFjZXM6IG51bWJlcltdXG4pIHtcbiAgLy8gTG9vcCBvdmVyIHRoZSBwcm9wZXJ0aWVzIG9mIHJlc3R5bGVEYXRhXG4gIGZvciAodmFyIHJhd0tleSBpbiByZXN0eWxlRGF0YSkge1xuICAgIGlmICghcmVzdHlsZURhdGEuaGFzT3duUHJvcGVydHkocmF3S2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCB2YWx1ZSBmb3IgcHJvcGVydHkgYW5kIG5vcm1hbGl6ZSBpbnRvIGEgdmFsdWUgbGlzdFxuICAgIHZhciB2YWxBcnJheSA9IHJlc3R5bGVEYXRhW3Jhd0tleV07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbEFycmF5KSkge1xuICAgICAgdmFsQXJyYXkgPSBbdmFsQXJyYXldO1xuICAgIH1cblxuICAgIC8vIExvb3Agb3ZlciB0aGUgaW5kZXhlcyBvZiB0aGUgdHJhY2VzIGJlaW5nIHJlc3R5bGVkXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0eWxlVHJhY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBHZXQgdHJhY2Ugb2JqZWN0XG4gICAgICB2YXIgdHJhY2VJbmQgPSByZXN0eWxlVHJhY2VzW2ldO1xuICAgICAgdmFyIHRyYWNlID0gcGFyZW50QXJyYXlbdHJhY2VJbmRdO1xuXG4gICAgICAvLyBFeHRyYWN0IHZhbHVlIGZvciB0aGlzIHRyYWNlXG4gICAgICB2YXIgc2luZ2xlVmFsID0gdmFsQXJyYXlbaSAlIHZhbEFycmF5Lmxlbmd0aF07XG5cbiAgICAgIC8vIFNldCBwcm9wZXJ0eSB2YWx1ZVxuICAgICAgaWYgKHNpbmdsZVZhbCA9PT0gbnVsbCkge1xuICAgICAgICBfLnVuc2V0KHRyYWNlLCByYXdLZXkpO1xuICAgICAgfSBlbHNlIGlmIChzaW5nbGVWYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBfLnNldCh0cmFjZSwgcmF3S2V5LCBzaW5nbGVWYWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFBlcmZvcm0gYSBQbG90bHkubW92ZVRyYWNlcyBsaWtlIG9wZXJhdGlvbiBvbiBhbiBpbnB1dCBvYmplY3QgYXJyYXlcbiAqIEBwYXJhbSBwYXJlbnRBcnJheVxuICogIFRoZSBvYmplY3QgdGhhdCB0aGUgbW92ZVRyYWNlcyBvcGVyYXRpb24gc2hvdWxkIGJlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBjdXJyZW50SW5kc1xuICogIEFycmF5IG9mIHRoZSBjdXJyZW50IGluZGV4ZXMgb2YgdHJhY2VzIHRvIGJlIG1vdmVkXG4gKiBAcGFyYW0gbmV3SW5kc1xuICogIEFycmF5IG9mIHRoZSBuZXcgaW5kZXhlcyB0aGF0IHRyYWNlcyBzZWxlY3RlZCBieSBjdXJyZW50SW5kcyBzaG91bGQgYmVcbiAqICBtb3ZlZCB0by5cbiAqXG4gKiAgRXhhbXBsZXM6XG4gKiAgICAgIHZhciBkID0gW3tmb286IDB9LCB7Zm9vOiAxfSwge2ZvbzogMn1dXG4gKiAgICAgIHBlcmZvcm1Nb3ZlVHJhY2VzTGlrZShkLCBbMCwgMV0sIFsyLCAwXSlcbiAqICAgICAgZCAtPiBbe2ZvbzogMX0sIHtmb286IDJ9LCB7Zm9vOiAwfV1cbiAqXG4gKiAgICAgIHZhciBkID0gW3tmb286IDB9LCB7Zm9vOiAxfSwge2ZvbzogMn1dXG4gKiAgICAgIHBlcmZvcm1Nb3ZlVHJhY2VzTGlrZShkLCBbMCwgMl0sIFsxLCAyXSlcbiAqICAgICAgZCAtPiBbe2ZvbzogMX0sIHtmb286IDB9LCB7Zm9vOiAyfV1cbiAqL1xuZnVuY3Rpb24gcGVyZm9ybU1vdmVUcmFjZXNMaWtlKFxuICBwYXJlbnRBcnJheTogYW55W10sXG4gIGN1cnJlbnRJbmRzOiBudW1iZXJbXSxcbiAgbmV3SW5kczogbnVtYmVyW11cbikge1xuICAvLyAjIyMgUmVtb3ZlIGJ5IGN1cnJlbnRJbmRzIGluIHJldmVyc2Ugb3JkZXIgIyMjXG4gIHZhciBtb3ZpbmdUcmFjZXNEYXRhOiBhbnlbXSA9IFtdO1xuICBmb3IgKHZhciBjaSA9IGN1cnJlbnRJbmRzLmxlbmd0aCAtIDE7IGNpID49IDA7IGNpLS0pIHtcbiAgICAvLyBJbnNlcnQgbW92aW5nIHBhcmVudEFycmF5IGF0IGJlZ2lubmluZyBvZiB0aGUgbGlzdFxuICAgIG1vdmluZ1RyYWNlc0RhdGEuc3BsaWNlKDAsIDAsIHBhcmVudEFycmF5W2N1cnJlbnRJbmRzW2NpXV0pO1xuICAgIHBhcmVudEFycmF5LnNwbGljZShjdXJyZW50SW5kc1tjaV0sIDEpO1xuICB9XG5cbiAgLy8gIyMjIFNvcnQgbmV3SW5kcyBhbmQgbW92aW5nVHJhY2VzRGF0YSBieSBuZXdJbmRzICMjI1xuICB2YXIgbmV3SW5kZXhTb3J0ZWRBcnJheXMgPSBfKG5ld0luZHMpXG4gICAgLnppcChtb3ZpbmdUcmFjZXNEYXRhKVxuICAgIC5zb3J0QnkoMClcbiAgICAudW56aXAoKVxuICAgIC52YWx1ZSgpO1xuXG4gIG5ld0luZHMgPSBuZXdJbmRleFNvcnRlZEFycmF5c1swXTtcbiAgbW92aW5nVHJhY2VzRGF0YSA9IG5ld0luZGV4U29ydGVkQXJyYXlzWzFdO1xuXG4gIC8vICMjIyBJbnNlcnQgYnkgbmV3SW5kcyBpbiBmb3J3YXJkIG9yZGVyICMjI1xuICBmb3IgKHZhciBuaSA9IDA7IG5pIDwgbmV3SW5kcy5sZW5ndGg7IG5pKyspIHtcbiAgICBwYXJlbnRBcnJheS5zcGxpY2UobmV3SW5kc1tuaV0sIDAsIG1vdmluZ1RyYWNlc0RhdGFbbmldKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBuZXN0ZWQgcHJvcGVydGllcyBmcm9tIGEgcGFyZW50IG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmVudE9ialxuICogIFBhcmVudCBvYmplY3QgZnJvbSB3aGljaCBwcm9wZXJ0aWVzIG9yIG5lc3RlZCBwcm9wZXJ0aWVzIHNob3VsZCBiZSByZW1vdmVkXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheS48TnVtYmVyfFN0cmluZz4+fSBrZXlQYXRoc1xuICogIEFycmF5IG9mIGtleSBwYXRocyBmb3IgcHJvcGVydGllcyB0aGF0IHNob3VsZCBiZSByZW1vdmVkLiBFYWNoIGtleSBwYXRoXG4gKiAgaXMgYW4gYXJyYXkgb2YgcHJvcGVydGllcyBuYW1lcyBvciBhcnJheSBpbmRleGVzIHRoYXQgcmVmZXJlbmNlIGFcbiAqICBwcm9wZXJ0eSB0byBiZSByZW1vdmVkXG4gKlxuICogIEV4YW1wbGVzOlxuICogICAgICB2YXIgZCA9IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dLCBiYXo6IDMyfVxuICogICAgICBwZXJmb3JtUmVtb3ZlUHJvcHMoZCwgWydiYXonXSlcbiAqICAgICAgZCAtPiB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XX1cbiAqXG4gKiAgICAgIHZhciBkID0ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV0sIGJhejogMzJ9XG4gKiAgICAgIHBlcmZvcm1SZW1vdmVQcm9wcyhkLCBbJ2Zvb1sxXS5iYXInLCAnYmF6J10pXG4gKiAgICAgIGQgLT4ge2ZvbzogW3tiYXI6IDB9LCB7fV19XG4gKlxuICovXG5mdW5jdGlvbiBwZXJmb3JtUmVtb3ZlUHJvcHMoXG4gIHBhcmVudE9iajogb2JqZWN0LFxuICBrZXlQYXRoczogQXJyYXk8QXJyYXk8bnVtYmVyIHwgc3RyaW5nPj5cbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleVBhdGggPSBrZXlQYXRoc1tpXTtcbiAgICBfLnVuc2V0KHBhcmVudE9iaiwga2V5UGF0aCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gb2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHByb3BlcnRpZXMgaW4gZnVsbE9iaiB0aGF0IGFyZSBub3RcbiAqIGlkZW50aWNhbCB0byB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0aWVzIGluIHJlbW92ZU9ialxuICpcbiAqIFByb3BlcnRpZXMgb2YgZnVsbE9iaiBhbmQgcmVtb3ZlT2JqIG1heSBiZSBvYmplY3RzIG9yIGFycmF5cyBvZiBvYmplY3RzXG4gKlxuICogUmV0dXJuZWQgb2JqZWN0IGlzIGEgZGVlcCBjbG9uZSBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGUgaW5wdXQgb2JqZWN0c1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBmdWxsT2JqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVtb3ZlT2JqXG4gKlxuICogIEV4YW1wbGVzOlxuICogICAgICB2YXIgZnVsbEQgPSB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XSwgYmF6OiAzMn1cbiAqICAgICAgdmFyIHJlbW92ZUQgPSB7YmF6OiAzMn1cbiAqICAgICAgY3JlYXRlRGVsdGFPYmplY3QoZnVsbEQsIHJlbW92ZUQpXG4gKiAgICAgICAgICAtPiB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XX1cbiAqXG4gKiAgICAgIHZhciBmdWxsRCA9IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dLCBiYXo6IDMyfVxuICogICAgICB2YXIgcmVtb3ZlRCA9IHtiYXo6IDQ1fVxuICogICAgICBjcmVhdGVEZWx0YU9iamVjdChmdWxsRCwgcmVtb3ZlRClcbiAqICAgICAgICAgIC0+IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dLCBiYXo6IDMyfVxuICpcbiAqICAgICAgdmFyIGZ1bGxEID0ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV0sIGJhejogMzJ9XG4gKiAgICAgIHZhciByZW1vdmVEID0ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV19XG4gKiAgICAgIGNyZWF0ZURlbHRhT2JqZWN0KGZ1bGxELCByZW1vdmVEKVxuICogICAgICAgICAgLT4ge2JhejogMzJ9XG4gKlxuICovXG5mdW5jdGlvbiBjcmVhdGVEZWx0YU9iamVjdChmdWxsT2JqOiBhbnksIHJlbW92ZU9iajogYW55KSB7XG4gIC8vIEluaXRpYWxpemUgcmVzdWx0IGFzIG9iamVjdCBvciBhcnJheVxuICB2YXIgcmVzOiBhbnk7XG4gIGlmIChBcnJheS5pc0FycmF5KGZ1bGxPYmopKSB7XG4gICAgcmVzID0gbmV3IEFycmF5KGZ1bGxPYmoubGVuZ3RoKTtcbiAgfSBlbHNlIHtcbiAgICByZXMgPSB7fTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgcmVtb3ZlT2JqIHRvIGVtcHR5IG9iamVjdCBpZiBub3Qgc3BlY2lmaWVkXG4gIGlmIChyZW1vdmVPYmogPT09IG51bGwgfHwgcmVtb3ZlT2JqID09PSB1bmRlZmluZWQpIHtcbiAgICByZW1vdmVPYmogPSB7fTtcbiAgfVxuXG4gIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3QgcHJvcGVydGllcyBvciBhcnJheSBpbmRpY2VzXG4gIGZvciAodmFyIHAgaW4gZnVsbE9iaikge1xuICAgIGlmIChcbiAgICAgIHBbMF0gIT09IFwiX1wiICYmIC8vIERvbid0IGNvbnNpZGVyIHByaXZhdGUgcHJvcGVydGllc1xuICAgICAgZnVsbE9iai5oYXNPd25Qcm9wZXJ0eShwKSAmJiAvLyBFeGNsdWRlIHBhcmVudCBwcm9wZXJ0aWVzXG4gICAgICBmdWxsT2JqW3BdICE9PSBudWxsIC8vIEV4Y2x1ZGUgY2FzZXMgd2hlcmUgZnVsbE9iaiBkb2Vzbid0XG4gICAgICAvLyBoYXZlIHRoZSBwcm9wZXJ0eVxuICAgICkge1xuICAgICAgLy8gQ29tcHV0ZSBvYmplY3QgZXF1YWxpdHlcbiAgICAgIHZhciBwcm9wc19lcXVhbDtcbiAgICAgIHByb3BzX2VxdWFsID0gXy5pc0VxdWFsKGZ1bGxPYmpbcF0sIHJlbW92ZU9ialtwXSk7XG5cbiAgICAgIC8vIFBlcmZvcm0gcmVjdXJzaXZlIGNvbXBhcmlzb24gaWYgcHJvcHMgYXJlIG5vdCBlcXVhbFxuICAgICAgaWYgKCFwcm9wc19lcXVhbCB8fCBwID09PSBcInVpZFwiKSB7XG4gICAgICAgIC8vIExldCB1aWRzIHRocm91Z2hcblxuICAgICAgICAvLyBwcm9wZXJ0eSBoYXMgbm9uLW51bGwgdmFsdWUgaW4gZnVsbE9iaiB0aGF0IGRvZXNuJ3RcbiAgICAgICAgLy8gbWF0Y2ggdGhlIHZhbHVlIGluIHJlbW92ZU9ialxuICAgICAgICB2YXIgZnVsbFZhbCA9IGZ1bGxPYmpbcF07XG4gICAgICAgIGlmIChyZW1vdmVPYmouaGFzT3duUHJvcGVydHkocCkgJiYgdHlwZW9mIGZ1bGxWYWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAvLyBSZWN1cnNlIG92ZXIgb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmdWxsVmFsKSkge1xuICAgICAgICAgICAgaWYgKGZ1bGxWYWwubGVuZ3RoID4gMCAmJiB0eXBlb2YgZnVsbFZhbFswXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAvLyBXZSBoYXZlIGFuIG9iamVjdCBhcnJheVxuICAgICAgICAgICAgICByZXNbcF0gPSBuZXcgQXJyYXkoZnVsbFZhbC5sZW5ndGgpO1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bGxWYWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVtb3ZlT2JqW3BdKSB8fCByZW1vdmVPYmpbcF0ubGVuZ3RoIDw9IGkpIHtcbiAgICAgICAgICAgICAgICAgIHJlc1twXVtpXSA9IGZ1bGxWYWxbaV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc1twXVtpXSA9IGNyZWF0ZURlbHRhT2JqZWN0KGZ1bGxWYWxbaV0sIHJlbW92ZU9ialtwXVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgcHJpbWl0aXZlIGFycmF5IG9yIHR5cGVkIGFycmF5XG4gICAgICAgICAgICAgIHJlc1twXSA9IGZ1bGxWYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG9iamVjdFxuICAgICAgICAgICAgdmFyIGZ1bGxfb2JqID0gY3JlYXRlRGVsdGFPYmplY3QoZnVsbFZhbCwgcmVtb3ZlT2JqW3BdKTtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhmdWxsX29iaikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBuZXcgb2JqZWN0IGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgICByZXNbcF0gPSBmdWxsX29iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZ1bGxWYWwgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoZnVsbFZhbCkpIHtcbiAgICAgICAgICAvLyBSZXR1cm4gJ2Nsb25lJyBvZiBmdWxsVmFsXG4gICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlIGEgc3RhbmRhcmQgY2xvbmUgbWV0aG9kIHNvIHRoYXQgd2Uga2VlcFxuICAgICAgICAgIC8vIHRoZSBzcGVjaWFsIGNhc2UgaGFuZGxpbmcgb2YgdGhpcyBtZXRob2RcbiAgICAgICAgICByZXNbcF0gPSBjcmVhdGVEZWx0YU9iamVjdChmdWxsVmFsLCB7fSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZnVsbFZhbCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBmdWxsVmFsICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAvLyBObyByZWN1cnNpb24gbmVjZXNzYXJ5LCBKdXN0IGtlZXAgdmFsdWUgZnJvbSBmdWxsT2JqLlxuICAgICAgICAgIC8vIEJ1dCBza2lwIHZhbHVlcyB3aXRoIGZ1bmN0aW9uIHR5cGVcbiAgICAgICAgICByZXNbcF0gPSBmdWxsVmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHJhbmRzdHIoXG4gIGV4aXN0aW5nPzogeyBbazogc3RyaW5nXTogYW55IH0sXG4gIGJpdHM/OiBudW1iZXIsXG4gIGJhc2U/OiBudW1iZXIsXG4gIF9yZWN1cnNpb24/OiBudW1iZXJcbik6IHN0cmluZyB7XG4gIGlmICghYmFzZSkgYmFzZSA9IDE2O1xuICBpZiAoYml0cyA9PT0gdW5kZWZpbmVkKSBiaXRzID0gMjQ7XG4gIGlmIChiaXRzIDw9IDApIHJldHVybiBcIjBcIjtcblxuICB2YXIgZGlnaXRzID0gTWF0aC5sb2coTWF0aC5wb3coMiwgYml0cykpIC8gTWF0aC5sb2coYmFzZSk7XG4gIHZhciByZXMgPSBcIlwiO1xuICB2YXIgaSwgYiwgeDtcblxuICBmb3IgKGkgPSAyOyBkaWdpdHMgPT09IEluZmluaXR5OyBpICo9IDIpIHtcbiAgICBkaWdpdHMgPSAoTWF0aC5sb2coTWF0aC5wb3coMiwgYml0cyAvIGkpKSAvIE1hdGgubG9nKGJhc2UpKSAqIGk7XG4gIH1cblxuICB2YXIgcmVtID0gZGlnaXRzIC0gTWF0aC5mbG9vcihkaWdpdHMpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBNYXRoLmZsb29yKGRpZ2l0cyk7IGkrKykge1xuICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBiYXNlKS50b1N0cmluZyhiYXNlKTtcbiAgICByZXMgPSB4ICsgcmVzO1xuICB9XG5cbiAgaWYgKHJlbSkge1xuICAgIGIgPSBNYXRoLnBvdyhiYXNlLCByZW0pO1xuICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBiKS50b1N0cmluZyhiYXNlKTtcbiAgICByZXMgPSB4ICsgcmVzO1xuICB9XG5cbiAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHJlcywgYmFzZSk7XG4gIGlmIChcbiAgICAoZXhpc3RpbmcgJiYgZXhpc3RpbmdbcmVzXSkgfHxcbiAgICAocGFyc2VkICE9PSBJbmZpbml0eSAmJiBwYXJzZWQgPj0gTWF0aC5wb3coMiwgYml0cykpXG4gICkge1xuICAgIGlmIChfcmVjdXJzaW9uID4gMTApIHtcbiAgICAgIGNvbnNvbGUud2FybihcInJhbmRzdHIgZmFpbGVkIHVuaXF1ZW5lc3NcIik7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICByZXR1cm4gcmFuZHN0cihleGlzdGluZywgYml0cywgYmFzZSwgKF9yZWN1cnNpb24gfHwgMCkgKyAxKTtcbiAgfSBlbHNlIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgbGV0IG1vZGVsO1xuICByZXR1cm4ge1xuICAgIGluaXRpYWxpemUoY3R4KSB7XG4gICAgICBtb2RlbCA9IG5ldyBGaWd1cmVNb2RlbChjdHgubW9kZWwsIHNlcmlhbGl6ZXJzKTtcbiAgICAgIG1vZGVsLmluaXRpYWxpemUoKTtcbiAgICB9LFxuICAgIHJlbmRlcih7IGVsIH0pIHtcbiAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRmlndXJlVmlldyhtb2RlbCwgZWwpO1xuICAgICAgdmlldy5wZXJmb3JtX3JlbmRlcigpXG4gICAgICByZXR1cm4gKCkgPT4gdmlldy5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxPQUFPO0FBQ2QsT0FBTyxZQUFZO0FBR25CLE9BQU8sZUFBZSxFQUFFLGVBQWUsUUFBUTtBQWdJeEMsSUFBTSxjQUFOLE1BQWtCO0FBQUEsRUFJdkIsWUFBWSxPQUF1QkEsY0FBeUM7QUFDMUUsU0FBSyxRQUFRO0FBQ2IsU0FBSyxjQUFjQTtBQUFBLEVBQ3JCO0FBQUEsRUFFQSxJQUFJLEtBQWE7QUFDZixVQUFNLGFBQWEsS0FBSyxZQUFZLEdBQUc7QUFDdkMsVUFBTSxTQUFTLEtBQUssTUFBTSxJQUFJLEdBQUc7QUFDakMsUUFBSSxZQUFZLGFBQWE7QUFDM0IsYUFBTyxXQUFXLFlBQVksTUFBTTtBQUFBLElBQ3RDO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLElBQUksS0FBYSxPQUFnQjtBQUMvQixRQUFJLGFBQWEsS0FBSyxZQUFZLEdBQUc7QUFDckMsUUFBSSxZQUFZLFdBQVc7QUFDekIsY0FBUSxXQUFXLFVBQVUsS0FBSztBQUFBLElBQ3BDO0FBQ0EsU0FBSyxNQUFNLElBQUksS0FBSyxLQUFLO0FBQUEsRUFDM0I7QUFBQSxFQUVBLEdBQUcsT0FBZSxJQUFpQjtBQUNqQyxTQUFLLE1BQU0sR0FBRyxPQUFPLEVBQUU7QUFBQSxFQUN6QjtBQUFBLEVBRUEsZUFBZTtBQUNiLFNBQUssTUFBTSxhQUFhO0FBQUEsRUFDMUI7QUFBQSxFQUVBLFdBQVc7QUFDVCxXQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFRTCxPQUFPLENBQUM7QUFBQSxNQUNSLFNBQVMsQ0FBQztBQUFBLE1BQ1YsU0FBUyxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BZ0NWLGtCQUFrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWFsQixxQkFBcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BU3JCLG1CQUFtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1Bb0JuQixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWNoQixpQkFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFzQmpCLGVBQWU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1Bd0JmLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFTaEIsMEJBQTBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFXMUIseUJBQXlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BNkJ6QixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFVaEIsaUJBQWlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWVqQixlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFXZixvQkFBb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVdwQixvQkFBb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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
=======
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvamF2YXNjcmlwdC9qdXB5dGVybGFiLXBsb3RseS9zcmMvRmlndXJlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IERPTVdpZGdldE1vZGVsIH0gZnJvbSBcIkBqdXB5dGVyLXdpZGdldHMvYmFzZVwiO1xuaW1wb3J0IF8gZnJvbSBcImh0dHBzOi8vZXNtLnNoL2xvZGFzaC1lc1wiO1xuaW1wb3J0IFBsb3RseSBmcm9tIFwiaHR0cHM6Ly9lc20uc2gvcGxvdGx5LmpzQDIuMzMuMC9kaXN0L3Bsb3RseVwiO1xuXG4vLyBAdHMtaWdub3JlXG53aW5kb3cuUGxvdGx5Q29uZmlnID0geyBNYXRoSmF4Q29uZmlnOiBcImxvY2FsXCIgfTtcblxudHlwZSBJbnB1dERldmljZVN0YXRlID0ge1xuICBhbHQ6IGFueTtcbiAgY3RybDogYW55O1xuICBtZXRhOiBhbnk7XG4gIHNoaWZ0OiBhbnk7XG4gIGJ1dHRvbjogYW55O1xuICBidXR0b25zOiBhbnk7XG59O1xuXG50eXBlIEpzMlB5TGF5b3V0RGVsdGFNc2cgPSB7XG4gIGxheW91dF9kZWx0YTogYW55O1xuICBsYXlvdXRfZWRpdF9pZDogYW55O1xufTtcblxudHlwZSBKczJQeU1zZyA9IHtcbiAgc291cmNlX3ZpZXdfaWQ6IHN0cmluZztcbn07XG5cbnR5cGUgSnMyUHlQb2ludHNDYWxsYmFja01zZyA9IHtcbiAgZXZlbnRfdHlwZTogc3RyaW5nO1xuICBwb2ludHM6IFBvaW50cyB8IG51bGw7XG4gIGRldmljZV9zdGF0ZTogSW5wdXREZXZpY2VTdGF0ZSB8IG51bGw7XG4gIHNlbGVjdG9yOiBTZWxlY3RvciB8IG51bGw7XG59O1xuXG50eXBlIEpzMlB5UmVsYXlvdXRNc2cgPSBKczJQeU1zZyAmIHtcbiAgcmVsYXlvdXRfZGF0YTogYW55O1xufTtcblxudHlwZSBKczJQeVJlc3R5bGVNc2cgPSBKczJQeU1zZyAmIHtcbiAgc3R5bGVfZGF0YTogYW55O1xuICBzdHlsZV90cmFjZXM/OiBudWxsIHwgbnVtYmVyIHwgbnVtYmVyW107XG59O1xuXG50eXBlIEpzMlB5VHJhY2VEZWx0YXNNc2cgPSB7XG4gIHRyYWNlX2RlbHRhczogYW55O1xuICB0cmFjZV9lZGl0X2lkOiBhbnk7XG59O1xuXG50eXBlIEpzMlB5VXBkYXRlTXNnID0gSnMyUHlNc2cgJiB7XG4gIHN0eWxlX2RhdGE6IGFueTtcbiAgbGF5b3V0X2RhdGE6IGFueTtcbiAgc3R5bGVfdHJhY2VzPzogbnVsbCB8IG51bWJlciB8IG51bWJlcltdO1xufTtcblxudHlwZSBQb2ludHMgPSB7XG4gIHRyYWNlX2luZGV4ZXM6IG51bWJlcltdO1xuICBwb2ludF9pbmRleGVzOiBudW1iZXJbXTtcbiAgeHM6IG51bWJlcltdO1xuICB5czogbnVtYmVyW107XG4gIHpzPzogbnVtYmVyW107XG59O1xuXG50eXBlIFB5MkpzTXNnID0ge1xuICB0cmFjZV9lZGl0X2lkPzogYW55O1xuICBsYXlvdXRfZWRpdF9pZD86IGFueTtcbiAgc291cmNlX3ZpZXdfaWQ/OiBhbnk7XG59O1xuXG50eXBlIFB5MkpzQWRkVHJhY2VzTXNnID0gUHkySnNNc2cgJiB7XG4gIHRyYWNlX2RhdGE6IGFueTtcbn07XG5cbnR5cGUgUHkySnNBbmltYXRlTXNnID0gUHkySnNNc2cgJiB7XG4gIHN0eWxlX2RhdGE6IGFueTtcbiAgbGF5b3V0X2RhdGE6IGFueTtcbiAgc3R5bGVfdHJhY2VzPzogbnVsbCB8IG51bWJlciB8IG51bWJlcltdO1xuICBhbmltYXRpb25fb3B0cz86IGFueTtcbn07XG5cbnR5cGUgUHkySnNEZWxldGVUcmFjZXNNc2cgPSBQeTJKc01zZyAmIHtcbiAgZGVsZXRlX2luZHM6IG51bWJlcltdO1xufTtcblxudHlwZSBQeTJKc01vdmVUcmFjZXNNc2cgPSB7XG4gIGN1cnJlbnRfdHJhY2VfaW5kczogbnVtYmVyW107XG4gIG5ld190cmFjZV9pbmRzOiBudW1iZXJbXTtcbn07XG5cbnR5cGUgUHkySnNSZXN0eWxlTXNnID0gUHkySnNNc2cgJiB7XG4gIHJlc3R5bGVfZGF0YTogYW55O1xuICByZXN0eWxlX3RyYWNlcz86IG51bGwgfCBudW1iZXIgfCBudW1iZXJbXTtcbn07XG5cbnR5cGUgUHkySnNSZWxheW91dE1zZyA9IFB5MkpzTXNnICYge1xuICByZWxheW91dF9kYXRhOiBhbnk7XG59O1xuXG50eXBlIFB5MkpzUmVtb3ZlTGF5b3V0UHJvcHNNc2cgPSB7XG4gIHJlbW92ZV9wcm9wczogYW55O1xufTtcblxudHlwZSBQeTJKc1JlbW92ZVRyYWNlUHJvcHNNc2cgPSB7XG4gIHJlbW92ZV9wcm9wczogYW55O1xuICByZW1vdmVfdHJhY2U6IGFueTtcbn07XG5cbnR5cGUgUHkySnNVcGRhdGVNc2cgPSBQeTJKc01zZyAmIHtcbiAgc3R5bGVfZGF0YTogYW55O1xuICBsYXlvdXRfZGF0YTogYW55O1xuICBzdHlsZV90cmFjZXM/OiBudWxsIHwgbnVtYmVyIHwgbnVtYmVyW107XG59O1xuXG50eXBlIFNlbGVjdG9yID0ge1xuICB0eXBlOiBcImJveFwiIHwgXCJsYXNzb1wiO1xuICBzZWxlY3Rvcl9zdGF0ZTpcbiAgICB8IHsgeHJhbmdlOiBudW1iZXJbXTsgeXJhbmdlOiBudW1iZXJbXSB9XG4gICAgfCB7IHhzOiBudW1iZXJbXTsgeXM6IG51bWJlcltdIH07XG59O1xuXG4vLyBNb2RlbFxuLy8gPT09PT1cbi8qKlxuICogQSBGaWd1cmVNb2RlbCBob2xkcyBhIG1pcnJvciBjb3B5IG9mIHRoZSBzdGF0ZSBvZiBhIEZpZ3VyZVdpZGdldCBvblxuICogdGhlIFB5dGhvbiBzaWRlLiAgVGhlcmUgaXMgYSBvbmUtdG8tb25lIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIEphdmFTY3JpcHRcbiAqIEZpZ3VyZU1vZGVscyBhbmQgUHl0aG9uIEZpZ3VyZVdpZGdldHMuIFRoZSBKYXZhU2NyaXB0IEZpZ3VyZU1vZGVsIGlzXG4gKiBpbml0aWFsaXplZCBhcyBzb29uIGFzIGEgUHl0aG9uIEZpZ3VyZVdpZGdldCBpbml0aWFsaXplZCwgdGhpcyBoYXBwZW5zXG4gKiBldmVuIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGZpcnN0IGRpc3BsYXllZCBpbiB0aGUgTm90ZWJvb2tcbiAqIEB0eXBlIHt3aWRnZXRzLkRPTVdpZGdldE1vZGVsfVxuICovXG5cbnR5cGUgU2VyaWFsaXplcjxJbj1hbnksIE91dD1hbnk+ID0ge1xuICBkZXNlcmlhbGl6ZSh2YWx1ZTogT3V0KTogSW47XG4gIHNlcmlhbGl6ZSh2YWx1ZTogSW4pOiBPdXQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGaWd1cmVNb2RlbCB7XG4gIG1vZGVsOiBET01XaWRnZXRNb2RlbDtcbiAgc2VyaWFsaXplcnM6IFJlY29yZDxzdHJpbmcsIFNlcmlhbGl6ZXI+XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IERPTVdpZGdldE1vZGVsLCBzZXJpYWxpemVyczogUmVjb3JkPHN0cmluZywgU2VyaWFsaXplcj4pIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5zZXJpYWxpemVycyA9IHNlcmlhbGl6ZXJzO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKSB7XG4gICAgY29uc3Qgc2VyaWFsaXplciA9IHRoaXMuc2VyaWFsaXplcnNba2V5XTtcbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLm1vZGVsLmdldChrZXkpXG4gICAgaWYgKHNlcmlhbGl6ZXI/LmRlc2VyaWFsaXplKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplci5kZXNlcmlhbGl6ZSh1cGRhdGUpXG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gICAgbGV0IHNlcmlhbGl6ZXIgPSB0aGlzLnNlcmlhbGl6ZXJzW2tleV07XG4gICAgaWYgKHNlcmlhbGl6ZXI/LnNlcmlhbGl6ZSkge1xuICAgICAgdmFsdWUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZSh2YWx1ZSlcbiAgICB9XG4gICAgdGhpcy5tb2RlbC5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNiOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5tb2RlbC5vbihldmVudCwgY2IpO1xuICB9XG5cbiAgc2F2ZV9jaGFuZ2VzKCkge1xuICAgIHRoaXMubW9kZWwuc2F2ZV9jaGFuZ2VzKCk7XG4gIH1cblxuICBkZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuXG4gICAgICAvLyBEYXRhIGFuZCBMYXlvdXRcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gVGhlIF9kYXRhIGFuZCBfbGF5b3V0IHByb3BlcnRpZXMgYXJlIHN5bmNocm9uaXplZCB3aXRoIHRoZVxuICAgICAgLy8gUHl0aG9uIHNpZGUgb24gaW5pdGlhbGl6YXRpb24gb25seS4gIEFmdGVyIGluaXRpYWxpemF0aW9uLCB0aGVzZVxuICAgICAgLy8gcHJvcGVydGllcyBhcmUga2VwdCBpbiBzeW5jIHRocm91Z2ggdGhlIHVzZSBvZiB0aGUgX3B5MmpzXypcbiAgICAgIC8vIG1lc3NhZ2VzXG4gICAgICBfZGF0YTogW10sXG4gICAgICBfbGF5b3V0OiB7fSxcbiAgICAgIF9jb25maWc6IHt9LFxuXG4gICAgICAvLyBQeXRob24gLT4gSlMgbWVzc2FnZXNcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gTWVzc2FnZXMgYXJlIGltcGxlbWVudGVkIHVzaW5nIHRyYWl0IHByb3BlcnRpZXMuIFRoaXMgaXMgZG9uZSBzb1xuICAgICAgLy8gdGhhdCB3ZSBjYW4gdGFrZSBhZHZhbnRhZ2Ugb2YgaXB5d2lkZ2V0J3MgYmluYXJ5IHNlcmlhbGl6YXRpb25cbiAgICAgIC8vIHByb3RvY29sLlxuICAgICAgLy9cbiAgICAgIC8vIE1lc3NhZ2VzIGFyZSBzZW50IGJ5IHRoZSBQeXRob24gc2lkZSBieSBhc3NpZ25pbmcgdGhlIG1lc3NhZ2VcbiAgICAgIC8vIGNvbnRlbnRzIHRvIHRoZSBhcHByb3ByaWF0ZSBfcHkyanNfKiBwcm9wZXJ0eSwgYW5kIHRoZW4gaW1tZWRpYXRlbHlcbiAgICAgIC8vIHNldHRpbmcgaXQgdG8gTm9uZS4gIE1lc3NhZ2VzIGFyZSByZWNlaXZlZCBieSB0aGUgSmF2YVNjcmlwdFxuICAgICAgLy8gc2lkZSBieSByZWdpc3RlcmluZyBwcm9wZXJ0eSBjaGFuZ2UgY2FsbGJhY2tzIGluIHRoZSBpbml0aWFsaXplXG4gICAgICAvLyBtZXRob2RzIGZvciBGaWd1cmVNb2RlbCBhbmQgRmlndXJlVmlldy4gZS5nLiAod2hlcmUgdGhpcyBpcyBhXG4gICAgICAvLyBGaWd1cmVNb2RlbCk6XG4gICAgICAvL1xuICAgICAgLy8gICAgICB0aGlzLm9uKCdjaGFuZ2U6X3B5MmpzX2FkZFRyYWNlcycsIHRoaXMuZG9fYWRkVHJhY2VzLCB0aGlzKTtcbiAgICAgIC8vXG4gICAgICAvLyBNZXNzYWdlIGhhbmRsaW5nIG1ldGhvZHMsIGRvX2FkZFRyYWNlcywgYXJlIHJlc3BvbnNpYmxlIGZvclxuICAgICAgLy8gcGVyZm9ybWluZyB0aGUgYXBwcm9wcmlhdGUgYWN0aW9uIGlmIHRoZSBtZXNzYWdlIGNvbnRlbnRzIGFyZVxuICAgICAgLy8gbm90IG51bGxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzQWRkVHJhY2VzTXNnXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxPYmplY3Q+fSB0cmFjZV9kYXRhXG4gICAgICAgKiAgQXJyYXkgb2YgdHJhY2VzIHRvIGFwcGVuZCB0byB0aGUgZW5kIG9mIHRoZSBmaWd1cmUncyBjdXJyZW50IHRyYWNlc1xuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRyYWNlX2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyB0cmFjZSBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X3RyYWNlRGVsdGFzIG1lc3NhZ2UuXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlLlxuICAgICAgICovXG4gICAgICBfcHkyanNfYWRkVHJhY2VzOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gUHkySnNEZWxldGVUcmFjZXNNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IGRlbGV0ZV9pbmRzXG4gICAgICAgKiAgQXJyYXkgb2YgaW5kZXhlcyBvZiB0cmFjZXMgdG8gYmUgZGVsZXRlZCwgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdHJhY2VfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgdG8gdXNlIHdoZW4gcmV0dXJuaW5nIHRyYWNlIGRlbHRhcyB1c2luZ1xuICAgICAgICogIHRoZSBfanMycHlfdHJhY2VEZWx0YXMgbWVzc2FnZS5cbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXlvdXRfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgdG8gdXNlIHdoZW4gcmV0dXJuaW5nIGxheW91dCBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X2xheW91dERlbHRhIG1lc3NhZ2UuXG4gICAgICAgKi9cbiAgICAgIF9weTJqc19kZWxldGVUcmFjZXM6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc01vdmVUcmFjZXNNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IGN1cnJlbnRfdHJhY2VfaW5kc1xuICAgICAgICogIEFycmF5IG9mIHRoZSBjdXJyZW50IGluZGV4ZXMgb2YgdHJhY2VzIHRvIGJlIG1vdmVkXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBuZXdfdHJhY2VfaW5kc1xuICAgICAgICogIEFycmF5IG9mIHRoZSBuZXcgaW5kZXhlcyB0aGF0IHRyYWNlcyBzaG91bGQgYmUgbW92ZWQgdG8uXG4gICAgICAgKi9cbiAgICAgIF9weTJqc19tb3ZlVHJhY2VzOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gUHkySnNSZXN0eWxlTXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcmVzdHlsZV9kYXRhXG4gICAgICAgKiAgUmVzdHlsZSBkYXRhIGFzIGFjY2VwdGVkIGJ5IFBsb3RseS5yZXN0eWxlXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8QXJyYXkuPE51bWJlcj59IHJlc3R5bGVfdHJhY2VzXG4gICAgICAgKiAgQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgdHJhY2VzIHRoYXQgdGhlIHJlc3l0bGUgb3BlcmF0aW9uIGFwcGxpZXNcbiAgICAgICAqICB0bywgb3IgbnVsbCB0byBhcHBseSB0aGUgb3BlcmF0aW9uIHRvIGFsbCB0cmFjZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0cmFjZV9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCB0byB1c2Ugd2hlbiByZXR1cm5pbmcgdHJhY2UgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV90cmFjZURlbHRhcyBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHJlc3R5bGVcbiAgICAgICAqICBldmVudCAoZS5nLiBieSBjbGlja2luZyB0aGUgbGVnZW5kKSwgb3IgbnVsbCBpZiB0aGUgcmVzdHlsZSB3YXNcbiAgICAgICAqICB0cmlnZ2VyZWQgZnJvbSBQeXRob25cbiAgICAgICAqL1xuICAgICAgX3B5MmpzX3Jlc3R5bGU6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc1JlbGF5b3V0TXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcmVsYXlvdXRfZGF0YVxuICAgICAgICogIFJlbGF5b3V0IGRhdGEgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LnJlbGF5b3V0XG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGF5b3V0X2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyBsYXlvdXQgZGVsdGFzIHVzaW5nXG4gICAgICAgKiAgdGhlIF9qczJweV9sYXlvdXREZWx0YSBtZXNzYWdlXG4gICAgICAgKiBAcHJvcGVydHkge251bGx8U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHJlbGF5b3V0XG4gICAgICAgKiAgZXZlbnQgKGUuZy4gYnkgY2xpY2tpbmcgdGhlIHpvb20gYnV0dG9uKSwgb3IgbnVsbCBpZiB0aGVcbiAgICAgICAqICByZWxheW91dCB3YXMgdHJpZ2dlcmVkIGZyb20gUHl0aG9uXG4gICAgICAgKi9cbiAgICAgIF9weTJqc19yZWxheW91dDogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzVXBkYXRlTXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gc3R5bGVfZGF0YVxuICAgICAgICogIFN0eWxlIGRhdGEgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LnVwZGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxheW91dF9kYXRhXG4gICAgICAgKiAgTGF5b3V0IGRhdGEgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LnVwZGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0gc3R5bGVfdHJhY2VzXG4gICAgICAgKiAgQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgdHJhY2VzIHRoYXQgdGhlIHVwZGF0ZSBvcGVyYXRpb24gYXBwbGllc1xuICAgICAgICogIHRvLCBvciBudWxsIHRvIGFwcGx5IHRoZSBvcGVyYXRpb24gdG8gYWxsIHRyYWNlc1xuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRyYWNlX2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyB0cmFjZSBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X3RyYWNlRGVsdGFzIG1lc3NhZ2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXlvdXRfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgdG8gdXNlIHdoZW4gcmV0dXJuaW5nIGxheW91dCBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X2xheW91dERlbHRhIG1lc3NhZ2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxTdHJpbmd9IHNvdXJjZV92aWV3X2lkXG4gICAgICAgKiAgdmlld19pZCBvZiB0aGUgRmlndXJlVmlldyB0aGF0IHRyaWdnZXJlZCB0aGUgb3JpZ2luYWwgdXBkYXRlXG4gICAgICAgKiAgZXZlbnQgKGUuZy4gYnkgY2xpY2tpbmcgYSBidXR0b24pLCBvciBudWxsIGlmIHRoZSB1cGRhdGUgd2FzXG4gICAgICAgKiAgdHJpZ2dlcmVkIGZyb20gUHl0aG9uXG4gICAgICAgKi9cbiAgICAgIF9weTJqc191cGRhdGU6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBQeTJKc0FuaW1hdGVNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzdHlsZV9kYXRhXG4gICAgICAgKiAgU3R5bGUgZGF0YSBhcyBhY2NlcHRlZCBieSBQbG90bHkuYW5pbWF0ZVxuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxheW91dF9kYXRhXG4gICAgICAgKiAgTGF5b3V0IGRhdGEgYXMgYWNjZXB0ZWQgYnkgUGxvdGx5LmFuaW1hdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHN0eWxlX3RyYWNlc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyB0aGF0IHRoZSBhbmltYXRlIG9wZXJhdGlvbiBhcHBsaWVzXG4gICAgICAgKiAgdG8sIG9yIG51bGwgdG8gYXBwbHkgdGhlIG9wZXJhdGlvbiB0byBhbGwgdHJhY2VzXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gYW5pbWF0aW9uX29wdHNcbiAgICAgICAqICBBbmltYXRpb24gb3B0aW9ucyBhcyBhY2NlcHRlZCBieSBQbG90bHkuYW5pbWF0ZVxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRyYWNlX2VkaXRfaWRcbiAgICAgICAqICBFZGl0IElEIHRvIHVzZSB3aGVuIHJldHVybmluZyB0cmFjZSBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X3RyYWNlRGVsdGFzIG1lc3NhZ2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXlvdXRfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgdG8gdXNlIHdoZW4gcmV0dXJuaW5nIGxheW91dCBkZWx0YXMgdXNpbmdcbiAgICAgICAqICB0aGUgX2pzMnB5X2xheW91dERlbHRhIG1lc3NhZ2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxTdHJpbmd9IHNvdXJjZV92aWV3X2lkXG4gICAgICAgKiAgdmlld19pZCBvZiB0aGUgRmlndXJlVmlldyB0aGF0IHRyaWdnZXJlZCB0aGUgb3JpZ2luYWwgYW5pbWF0ZVxuICAgICAgICogIGV2ZW50IChlLmcuIGJ5IGNsaWNraW5nIGEgYnV0dG9uKSwgb3IgbnVsbCBpZiB0aGUgdXBkYXRlIHdhc1xuICAgICAgICogIHRyaWdnZXJlZCBmcm9tIFB5dGhvblxuICAgICAgICovXG4gICAgICBfcHkyanNfYW5pbWF0ZTogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzUmVtb3ZlTGF5b3V0UHJvcHNNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPEFycmF5LjxTdHJpbmd8TnVtYmVyPj59IHJlbW92ZV9wcm9wc1xuICAgICAgICogIEFycmF5IG9mIHByb3BlcnR5IHBhdGhzIHRvIHJlbW92ZS4gRWFjaCBwcm9wZXJ5IHBhdGggaXMgYW5cbiAgICAgICAqICBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBvciBhcnJheSBpbmRleGVzIHRoYXQgbG9jYXRlIGEgcHJvcGVydHlcbiAgICAgICAqICBpbnNpZGUgdGhlIF9sYXlvdXQgb2JqZWN0XG4gICAgICAgKi9cbiAgICAgIF9weTJqc19yZW1vdmVMYXlvdXRQcm9wczogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7bnVsbHxPYmplY3R9IFB5MkpzUmVtb3ZlVHJhY2VQcm9wc01zZ1xuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJlbW92ZV90cmFjZVxuICAgICAgICogIFRoZSBpbmRleCBvZiB0aGUgdHJhY2UgZnJvbSB3aGljaCB0byByZW1vdmUgcHJvcGVydGllc1xuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48QXJyYXkuPFN0cmluZ3xOdW1iZXI+Pn0gcmVtb3ZlX3Byb3BzXG4gICAgICAgKiAgQXJyYXkgb2YgcHJvcGVydHkgcGF0aHMgdG8gcmVtb3ZlLiBFYWNoIHByb3BlcnkgcGF0aCBpcyBhblxuICAgICAgICogIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIG9yIGFycmF5IGluZGV4ZXMgdGhhdCBsb2NhdGUgYSBwcm9wZXJ0eVxuICAgICAgICogIGluc2lkZSB0aGUgX2RhdGFbcmVtb3ZlX3RyYWNlXSBvYmplY3RcbiAgICAgICAqL1xuICAgICAgX3B5MmpzX3JlbW92ZVRyYWNlUHJvcHM6IG51bGwsXG5cbiAgICAgIC8vIEpTIC0+IFB5dGhvbiBtZXNzYWdlc1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBNZXNzYWdlcyBhcmUgc2VudCBieSB0aGUgSmF2YVNjcmlwdCBzaWRlIGJ5IGFzc2lnbmluZyB0aGVcbiAgICAgIC8vIG1lc3NhZ2UgY29udGVudHMgdG8gdGhlIGFwcHJvcHJpYXRlIF9qczJweV8qIHByb3BlcnR5IGFuZCB0aGVuXG4gICAgICAvLyBjYWxsaW5nIHRoZSBgdG91Y2hgIG1ldGhvZCBvbiB0aGUgdmlldyB0aGF0IHRyaWdnZXJlZCB0aGVcbiAgICAgIC8vIGNoYW5nZS4gZS5nLiAod2hlcmUgdGhpcyBpcyBhIEZpZ3VyZVZpZXcpOlxuICAgICAgLy9cbiAgICAgIC8vICAgICAgdGhpcy5tb2RlbC5zZXQoJ19qczJweV9yZXN0eWxlJywgZGF0YSk7XG4gICAgICAvLyAgICAgIHRoaXMudG91Y2goKTtcbiAgICAgIC8vXG4gICAgICAvLyBUaGUgUHl0aG9uIHNpZGUgaXMgcmVzcG9uc2libGUgZm9yIHNldHRpbmcgdGhlIHByb3BlcnR5IHRvIE5vbmVcbiAgICAgIC8vIGFmdGVyIHJlY2VpdmluZyB0aGUgbWVzc2FnZS5cbiAgICAgIC8vXG4gICAgICAvLyBNZXNzYWdlIHRyaWdnZXIgbG9naWMgaXMgZGVzY3JpYmVkIGluIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAvLyBoYW5kbGVfcGxvdGx5XyogbWV0aG9kcyBvZiBGaWd1cmVWaWV3XG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBKczJQeVJlc3R5bGVNc2dcbiAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzdHlsZV9kYXRhXG4gICAgICAgKiAgU3R5bGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgdG8gUGxvdGx5LnJlc3R5bGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPE51bWJlcj59IHN0eWxlX3RyYWNlc1xuICAgICAgICogIEFycmF5IG9mIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyB0aGF0IHRoZSByZXN0eWxlIG9wZXJhdGlvblxuICAgICAgICogIHdhcyBhcHBsaWVkIHRvLCBvciBudWxsIGlmIGFwcGxpZWQgdG8gYWxsIHRyYWNlc1xuICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHNvdXJjZV92aWV3X2lkXG4gICAgICAgKiAgdmlld19pZCBvZiB0aGUgRmlndXJlVmlldyB0aGF0IHRyaWdnZXJlZCB0aGUgb3JpZ2luYWwgcmVzdHlsZVxuICAgICAgICogIGV2ZW50IChlLmcuIGJ5IGNsaWNraW5nIHRoZSBsZWdlbmQpXG4gICAgICAgKi9cbiAgICAgIF9qczJweV9yZXN0eWxlOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlSZWxheW91dE1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IHJlbGF5b3V0X2RhdGFcbiAgICAgICAqICBSZWxheW91dCBkYXRhIHRoYXQgd2FzIHBhc3NlZCB0byBQbG90bHkucmVsYXlvdXRcbiAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzb3VyY2Vfdmlld19pZFxuICAgICAgICogIHZpZXdfaWQgb2YgdGhlIEZpZ3VyZVZpZXcgdGhhdCB0cmlnZ2VyZWQgdGhlIG9yaWdpbmFsIHJlbGF5b3V0XG4gICAgICAgKiAgZXZlbnQgKGUuZy4gYnkgY2xpY2tpbmcgdGhlIHpvb20gYnV0dG9uKVxuICAgICAgICovXG4gICAgICBfanMycHlfcmVsYXlvdXQ6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBKczJQeVVwZGF0ZU1zZ1xuICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IHN0eWxlX2RhdGFcbiAgICAgICAqICBTdHlsZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCB0byBQbG90bHkudXBkYXRlXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbGF5b3V0X2RhdGFcbiAgICAgICAqICBMYXlvdXQgZGF0YSB0aGF0IHdhcyBwYXNzZWQgdG8gUGxvdGx5LnVwZGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0gc3R5bGVfdHJhY2VzXG4gICAgICAgKiAgQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgdHJhY2VzIHRoYXQgdGhlIHVwZGF0ZSBvcGVyYXRpb24gYXBwbGllZFxuICAgICAgICogIHRvLCBvciBudWxsIGlmIGFwcGxpZWQgdG8gYWxsIHRyYWNlc1xuICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHNvdXJjZV92aWV3X2lkXG4gICAgICAgKiAgdmlld19pZCBvZiB0aGUgRmlndXJlVmlldyB0aGF0IHRyaWdnZXJlZCB0aGUgb3JpZ2luYWwgcmVsYXlvdXRcbiAgICAgICAqICBldmVudCAoZS5nLiBieSBjbGlja2luZyB0aGUgem9vbSBidXR0b24pXG4gICAgICAgKi9cbiAgICAgIF9qczJweV91cGRhdGU6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBKczJQeUxheW91dERlbHRhTXNnXG4gICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbGF5b3V0X2RlbHRhXG4gICAgICAgKiAgVGhlIGxheW91dCBkZWx0YSBvYmplY3QgdGhhdCBjb250YWlucyBhbGwgb2YgdGhlIHByb3BlcnRpZXMgb2ZcbiAgICAgICAqICBfZnVsbExheW91dCB0aGF0IGFyZSBub3QgaWRlbnRpY2FsIHRvIHRob3NlIGluIHRoZVxuICAgICAgICogIEZpZ3VyZU1vZGVsJ3MgX2xheW91dCBwcm9wZXJ0eVxuICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxheW91dF9lZGl0X2lkXG4gICAgICAgKiAgRWRpdCBJRCBvZiBtZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjcmVhdGlvbiBvZiBsYXlvdXQgZGVsdGFcbiAgICAgICAqL1xuICAgICAgX2pzMnB5X2xheW91dERlbHRhOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHtudWxsfE9iamVjdH0gSnMyUHlUcmFjZURlbHRhc01zZ1xuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48T2JqZWN0Pn0gdHJhY2VfZGVsdGFzXG4gICAgICAgKiAgQXJyYXkgb2YgdHJhY2UgZGVsdGEgb2JqZWN0cy4gRWFjaCB0cmFjZSBkZWx0YSBjb250YWlucyB0aGVcbiAgICAgICAqICB0cmFjZSdzIHVpZCBhbG9uZyB3aXRoIGFsbCBvZiB0aGUgcHJvcGVydGllcyBvZiBfZnVsbERhdGEgdGhhdFxuICAgICAgICogIGFyZSBub3QgaWRlbnRpY2FsIHRvIHRob3NlIGluIHRoZSBGaWd1cmVNb2RlbCdzIF9kYXRhIHByb3BlcnR5XG4gICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdHJhY2VfZWRpdF9pZFxuICAgICAgICogIEVkaXQgSUQgb2YgbWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY3JlYXRpb24gb2YgdHJhY2UgZGVsdGFzXG4gICAgICAgKi9cbiAgICAgIF9qczJweV90cmFjZURlbHRhczogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBPYmplY3QgcmVwcmVzZW50aW5nIGEgY29sbGVjdGlvbiBvZiBwb2ludHMgZm9yIHVzZSBpbiBjbGljaywgaG92ZXIsXG4gICAgICAgKiBhbmQgc2VsZWN0aW9uIGV2ZW50c1xuICAgICAgICogQHR5cGVkZWYge09iamVjdH0gUG9pbnRzXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSB0cmFjZV9pbmRleGVzXG4gICAgICAgKiAgQXJyYXkgb2YgdGhlIHRyYWNlIGluZGV4IGZvciBlYWNoIHBvaW50XG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSBwb2ludF9pbmRleGVzXG4gICAgICAgKiAgQXJyYXkgb2YgdGhlIGluZGV4IG9mIGVhY2ggcG9pbnQgaW4gaXRzIG93biB0cmFjZVxuICAgICAgICogQHByb3BlcnR5IHtudWxsfEFycmF5LjxOdW1iZXI+fSB4c1xuICAgICAgICogIEFycmF5IG9mIHRoZSB4IGNvb3JkaW5hdGUgb2YgZWFjaCBwb2ludCAoZm9yIGNhcnRlc2lhbiB0cmFjZSB0eXBlcylcbiAgICAgICAqICBvciBudWxsIChmb3Igbm9uLWNhcnRlc2lhbiB0cmFjZSB0eXBlcylcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxBcnJheS48TnVtYmVyPn0geXNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgeSBjb29yZGluYXRlIG9mIGVhY2ggcG9pbnQgKGZvciBjYXJ0ZXNpYW4gdHJhY2UgdHlwZXMpXG4gICAgICAgKiAgb3IgbnVsbCAoZm9yIG5vbi1jYXJ0ZXNpYW4gdHJhY2UgdHlwZXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxBcnJheS48TnVtYmVyPn0genNcbiAgICAgICAqICBBcnJheSBvZiB0aGUgeiBjb29yZGluYXRlIG9mIGVhY2ggcG9pbnQgKGZvciAzRCBjYXJ0ZXNpYW5cbiAgICAgICAqICB0cmFjZSB0eXBlcylcbiAgICAgICAqICBvciBudWxsIChmb3Igbm9uLTNELWNhcnRlc2lhbiB0cmFjZSB0eXBlcylcbiAgICAgICAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mIHRoZSBpbnB1dCBkZXZpY2VzIGR1cmluZyBhXG4gICAgICAgKiBwbG90bHkgZXZlbnRcbiAgICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IElucHV0RGV2aWNlU3RhdGVcbiAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYWx0IC0gdHJ1ZSBpZiBhbHQga2V5IHByZXNzZWQsXG4gICAgICAgKiBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY3RybCAtIHRydWUgaWYgY3RybCBrZXkgcHJlc3NlZCxcbiAgICAgICAqIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICogQHByb3BlcnR5IHtib29sZWFufSBtZXRhIC0gdHJ1ZSBpZiBtZXRhIGtleSBwcmVzc2VkLFxuICAgICAgICogZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IHNoaWZ0IC0gdHJ1ZSBpZiBzaGlmdCBrZXkgcHJlc3NlZCxcbiAgICAgICAqIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICpcbiAgICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYnV0dG9uXG4gICAgICAgKiAgSW5kaWNhdGVzIHdoaWNoIGJ1dHRvbiB3YXMgcHJlc3NlZCBvbiB0aGUgbW91c2UgdG8gdHJpZ2dlciB0aGVcbiAgICAgICAqICBldmVudC5cbiAgICAgICAqICAgIDA6IE1haW4gYnV0dG9uIHByZXNzZWQsIHVzdWFsbHkgdGhlIGxlZnQgYnV0dG9uIG9yIHRoZVxuICAgICAgICogICAgICAgdW4taW5pdGlhbGl6ZWQgc3RhdGVcbiAgICAgICAqICAgIDE6IEF1eGlsaWFyeSBidXR0b24gcHJlc3NlZCwgdXN1YWxseSB0aGUgd2hlZWwgYnV0dG9uIG9yXG4gICAgICAgKiAgICAgICB0aGUgbWlkZGxlIGJ1dHRvbiAoaWYgcHJlc2VudClcbiAgICAgICAqICAgIDI6IFNlY29uZGFyeSBidXR0b24gcHJlc3NlZCwgdXN1YWxseSB0aGUgcmlnaHQgYnV0dG9uXG4gICAgICAgKiAgICAzOiBGb3VydGggYnV0dG9uLCB0eXBpY2FsbHkgdGhlIEJyb3dzZXIgQmFjayBidXR0b25cbiAgICAgICAqICAgIDQ6IEZpZnRoIGJ1dHRvbiwgdHlwaWNhbGx5IHRoZSBCcm93c2VyIEZvcndhcmQgYnV0dG9uXG4gICAgICAgKlxuICAgICAgICogQHByb3BlcnR5IHtib29sZWFufSBidXR0b25zXG4gICAgICAgKiAgSW5kaWNhdGVzIHdoaWNoIGJ1dHRvbnMgd2VyZSBwcmVzc2VkIG9uIHRoZSBtb3VzZSB3aGVuIHRoZSBldmVudFxuICAgICAgICogIGlzIHRyaWdnZXJlZC5cbiAgICAgICAqICAgIDAgIDogTm8gYnV0dG9uIG9yIHVuLWluaXRpYWxpemVkXG4gICAgICAgKiAgICAxICA6IFByaW1hcnkgYnV0dG9uICh1c3VhbGx5IGxlZnQpXG4gICAgICAgKiAgICAyICA6IFNlY29uZGFyeSBidXR0b24gKHVzdWFsbHkgcmlnaHQpXG4gICAgICAgKiAgICA0ICA6IEF1eGlsYXJ5IGJ1dHRvbiAodXN1YWxseSBtaWRkbGUgb3IgbW91c2Ugd2hlZWwgYnV0dG9uKVxuICAgICAgICogICAgOCAgOiA0dGggYnV0dG9uICh0eXBpY2FsbHkgdGhlIFwiQnJvd3NlciBCYWNrXCIgYnV0dG9uKVxuICAgICAgICogICAgMTYgOiA1dGggYnV0dG9uICh0eXBpY2FsbHkgdGhlIFwiQnJvd3NlciBGb3J3YXJkXCIgYnV0dG9uKVxuICAgICAgICpcbiAgICAgICAqICBDb21iaW5hdGlvbnMgb2YgYnV0dG9ucyBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIHN1bSBvZiB0aGUgY29kZXNcbiAgICAgICAqICBhYm92ZS4gZS5nLiBhIHZhbHVlIG9mIDcgaW5kaWNhdGVzIGJ1dHRvbnMgMSAocHJpbWFyeSksXG4gICAgICAgKiAgMiAoc2Vjb25kYXJ5KSwgYW5kIDQgKGF1eGlsYXJ5KSB3ZXJlIHByZXNzZWQgZHVyaW5nIHRoZSBldmVudFxuICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge09iamVjdH0gQm94U2VsZWN0b3JTdGF0ZVxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0geHJhbmdlXG4gICAgICAgKiAgVHdvIGVsZW1lbnQgYXJyYXkgY29udGFpbmluZyB0aGUgeC1yYW5nZSBvZiB0aGUgYm94IHNlbGVjdGlvblxuICAgICAgICogQHByb3BlcnR5IHtBcnJheS48TnVtYmVyPn0geXJhbmdlXG4gICAgICAgKiAgVHdvIGVsZW1lbnQgYXJyYXkgY29udGFpbmluZyB0aGUgeS1yYW5nZSBvZiB0aGUgYm94IHNlbGVjdGlvblxuICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge09iamVjdH0gTGFzc29TZWxlY3RvclN0YXRlXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSB4c1xuICAgICAgICogIEFycmF5IG9mIHRoZSB4LWNvb3JkaW5hdGVzIG9mIHRoZSBsYXNzbyBzZWxlY3Rpb24gcmVnaW9uXG4gICAgICAgKiBAcHJvcGVydHkge0FycmF5LjxOdW1iZXI+fSB5c1xuICAgICAgICogIEFycmF5IG9mIHRoZSB5LWNvb3JkaW5hdGVzIG9mIHRoZSBsYXNzbyBzZWxlY3Rpb24gcmVnaW9uXG4gICAgICAgKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGF0ZSBvZiB0aGUgc2VsZWN0aW9uIHRvb2wgZHVyaW5nIGFcbiAgICAgICAqIHBsb3RseV9zZWxlY3QgZXZlbnRcbiAgICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IFNlbGVjdG9yXG4gICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZVxuICAgICAgICogIFNlbGVjdGlvbiB0eXBlLiBPbmUgb2Y6ICdib3gnLCBvciAnbGFzc28nXG4gICAgICAgKiBAcHJvcGVydHkge0JveFNlbGVjdG9yU3RhdGV8TGFzc29TZWxlY3RvclN0YXRlfSBzZWxlY3Rvcl9zdGF0ZVxuICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGVkZWYge251bGx8T2JqZWN0fSBKczJQeVBvaW50c0NhbGxiYWNrTXNnXG4gICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZXZlbnRfdHlwZVxuICAgICAgICogIE5hbWUgb2YgdGhlIHRyaWdnZXJpbmcgZXZlbnQuIE9uZSBvZiAncGxvdGx5X2NsaWNrJyxcbiAgICAgICAqICAncGxvdGx5X2hvdmVyJywgJ3Bsb3RseV91bmhvdmVyJywgb3IgJ3Bsb3RseV9zZWxlY3RlZCdcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVsbHxQb2ludHN9IHBvaW50c1xuICAgICAgICogIFBvaW50cyBvYmplY3QgZm9yIGV2ZW50XG4gICAgICAgKiBAcHJvcGVydHkge251bGx8SW5wdXREZXZpY2VTdGF0ZX0gZGV2aWNlX3N0YXRlXG4gICAgICAgKiAgSW5wdXREZXZpY2VTdGF0ZSBvYmplY3QgZm9yIGV2ZW50XG4gICAgICAgKiBAcHJvcGVydHkge251bGx8U2VsZWN0b3J9IHNlbGVjdG9yXG4gICAgICAgKiAgU3RhdGUgb2YgdGhlIHNlbGVjdGlvbiB0b29sIGZvciAncGxvdGx5X3NlbGVjdGVkJyBldmVudHMsIG51bGxcbiAgICAgICAqICBmb3Igb3RoZXIgZXZlbnQgdHlwZXNcbiAgICAgICAqL1xuICAgICAgX2pzMnB5X3BvaW50c0NhbGxiYWNrOiBudWxsLFxuXG4gICAgICAvLyBNZXNzYWdlIHRyYWNraW5nXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgKiBsYXlvdXRfZWRpdF9pZCBvZiB0aGUgbGFzdCBsYXlvdXQgbW9kaWZpY2F0aW9uIG9wZXJhdGlvblxuICAgICAgICogcmVxdWVzdGVkIGJ5IHRoZSBQeXRob24gc2lkZVxuICAgICAgICovXG4gICAgICBfbGFzdF9sYXlvdXRfZWRpdF9pZDogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICogdHJhY2VfZWRpdF9pZCBvZiB0aGUgbGFzdCB0cmFjZSBtb2RpZmljYXRpb24gb3BlcmF0aW9uXG4gICAgICAgKiByZXF1ZXN0ZWQgYnkgdGhlIFB5dGhvbiBzaWRlXG4gICAgICAgKi9cbiAgICAgIF9sYXN0X3RyYWNlX2VkaXRfaWQ6IDAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIEZpZ3VyZU1vZGVsLiBDYWxsZWQgd2hlbiB0aGUgUHl0aG9uIEZpZ3VyZVdpZGdldCBpcyBmaXJzdFxuICAgKiBjb25zdHJ1Y3RlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9kYXRhXCIsICgpID0+IHRoaXMuZG9fZGF0YSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9sYXlvdXRcIiwgKCkgPT4gdGhpcy5kb19sYXlvdXQoKSk7XG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfYWRkVHJhY2VzXCIsICgpID0+IHRoaXMuZG9fYWRkVHJhY2VzKCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX2RlbGV0ZVRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX2RlbGV0ZVRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19tb3ZlVHJhY2VzXCIsICgpID0+IHRoaXMuZG9fbW92ZVRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZXN0eWxlXCIsICgpID0+IHRoaXMuZG9fcmVzdHlsZSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZWxheW91dFwiLCAoKSA9PiB0aGlzLmRvX3JlbGF5b3V0KCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX3VwZGF0ZVwiLCAoKSA9PiB0aGlzLmRvX3VwZGF0ZSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19hbmltYXRlXCIsICgpID0+IHRoaXMuZG9fYW5pbWF0ZSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZW1vdmVMYXlvdXRQcm9wc1wiLCAoKSA9PiB0aGlzLmRvX3JlbW92ZUxheW91dFByb3BzKCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX3JlbW92ZVRyYWNlUHJvcHNcIiwgKCkgPT4gdGhpcy5kb19yZW1vdmVUcmFjZVByb3BzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIElucHV0IGEgdHJhY2UgaW5kZXggc3BlY2lmaWNhdGlvbiBhbmQgcmV0dXJuIGFuIEFycmF5IG9mIHRyYWNlXG4gICAqIGluZGV4ZXMgd2hlcmU6XG4gICAqXG4gICAqICAtIG51bGx8dW5kZWZpbmVkIC0+IEFycmF5IG9mIGFsbCB0cmFjZXNcbiAgICogIC0gVHJhY2UgaW5kZXggYXMgTnVtYmVyIC0+IFNpbmdsZSBlbGVtZW50IGFycmF5IG9mIGlucHV0IGluZGV4XG4gICAqICAtIEFycmF5IG9mIHRyYWNlIGluZGV4ZXMgLT4gSW5wdXQgYXJyYXkgdW5jaGFuZ2VkXG4gICAqXG4gICAqIEBwYXJhbSB7dW5kZWZpbmVkfG51bGx8TnVtYmVyfEFycmF5LjxOdW1iZXI+fSB0cmFjZV9pbmRleGVzXG4gICAqIEByZXR1cm5zIHtBcnJheS48TnVtYmVyPn1cbiAgICogIEFycmF5IG9mIHRyYWNlIGluZGV4ZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ub3JtYWxpemVfdHJhY2VfaW5kZXhlcyh0cmFjZV9pbmRleGVzPzogbnVsbCB8IG51bWJlciB8IG51bWJlcltdKTogbnVtYmVyW10ge1xuICAgIGlmICh0cmFjZV9pbmRleGVzID09PSBudWxsIHx8IHRyYWNlX2luZGV4ZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIG51bVRyYWNlcyA9IHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIikubGVuZ3RoO1xuICAgICAgdHJhY2VfaW5kZXhlcyA9IF8ucmFuZ2UobnVtVHJhY2VzKTtcbiAgICB9XG4gICAgaWYgKHRyYWNlX2luZGV4ZXMgIT09IHVuZGVmaW5lZCAmJiB0cmFjZV9pbmRleGVzICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KHRyYWNlX2luZGV4ZXMpKSB7XG4gICAgICAvLyBNYWtlIHN1cmUgaWR4IGlzIGFuIGFycmF5XG4gICAgICB0cmFjZV9pbmRleGVzID0gW3RyYWNlX2luZGV4ZXNdO1xuICAgIH1cbiAgICByZXR1cm4gdHJhY2VfaW5kZXhlcyA/PyBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2cgY2hhbmdlcyB0byB0aGUgX2RhdGEgdHJhaXRcbiAgICpcbiAgICogVGhpcyBzaG91bGQgb25seSBoYXBwZWQgb24gRmlndXJlTW9kZWwgaW5pdGlhbGl6YXRpb25cbiAgICovXG4gIGRvX2RhdGEoKSB7fVxuXG4gIC8qKlxuICAgKiBMb2cgY2hhbmdlcyB0byB0aGUgX2xheW91dCB0cmFpdFxuICAgKlxuICAgKiBUaGlzIHNob3VsZCBvbmx5IGhhcHBlZCBvbiBGaWd1cmVNb2RlbCBpbml0aWFsaXphdGlvblxuICAgKi9cbiAgZG9fbGF5b3V0KCkge31cblxuICAvKipcbiAgICogSGFuZGxlIGFkZFRyYWNlcyBtZXNzYWdlXG4gICAqL1xuICBkb19hZGRUcmFjZXMoKSB7XG4gICAgLy8gYWRkIHRyYWNlIHRvIHBsb3RcbiAgICAvKiogQHR5cGUge1B5MkpzQWRkVHJhY2VzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc0FkZFRyYWNlc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2FkZFRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgY3VycmVudFRyYWNlcyA9IHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIik7XG4gICAgICB2YXIgbmV3VHJhY2VzID0gbXNnRGF0YS50cmFjZV9kYXRhO1xuICAgICAgXy5mb3JFYWNoKG5ld1RyYWNlcywgZnVuY3Rpb24gKG5ld1RyYWNlOiBhbnkpIHtcbiAgICAgICAgY3VycmVudFRyYWNlcy5wdXNoKG5ld1RyYWNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZGVsZXRlVHJhY2VzIG1lc3NhZ2VcbiAgICovXG4gIGRvX2RlbGV0ZVRyYWNlcygpIHtcbiAgICAvLyByZW1vdmUgdHJhY2VzIGZyb20gcGxvdFxuXG4gICAgLyoqIEB0eXBlIHtQeTJKc0RlbGV0ZVRyYWNlc01zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNEZWxldGVUcmFjZXNNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19kZWxldGVUcmFjZXNcIik7XG5cbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgdmFyIGRlbGV0ZV9pbmRzID0gbXNnRGF0YS5kZWxldGVfaW5kcztcbiAgICAgIHZhciB0cmFjZXNEYXRhID0gdGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKTtcblxuICAgICAgLy8gUmVtb3ZlIGRlbCBpbmRzIGluIHJldmVyc2Ugb3JkZXIgc28gaW5kZXhlcyByZW1haW4gdmFsaWRcbiAgICAgIC8vIHRocm91Z2hvdXQgbG9vcFxuICAgICAgZGVsZXRlX2luZHNcbiAgICAgICAgLnNsaWNlKClcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZGVsX2luZCkge1xuICAgICAgICAgIHRyYWNlc0RhdGEuc3BsaWNlKGRlbF9pbmQsIDEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIG1vdmVUcmFjZXMgbWVzc2FnZVxuICAgKi9cbiAgZG9fbW92ZVRyYWNlcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzTW92ZVRyYWNlc01zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNNb3ZlVHJhY2VzTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfbW92ZVRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgdHJhY2VzRGF0YSA9IHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIik7XG4gICAgICB2YXIgY3VycmVudEluZHMgPSBtc2dEYXRhLmN1cnJlbnRfdHJhY2VfaW5kcztcbiAgICAgIHZhciBuZXdJbmRzID0gbXNnRGF0YS5uZXdfdHJhY2VfaW5kcztcblxuICAgICAgcGVyZm9ybU1vdmVUcmFjZXNMaWtlKHRyYWNlc0RhdGEsIGN1cnJlbnRJbmRzLCBuZXdJbmRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHJlc3R5bGUgbWVzc2FnZVxuICAgKi9cbiAgZG9fcmVzdHlsZSgpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzUmVzdHlsZU1zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNSZXN0eWxlTXNnID0gdGhpcy5tb2RlbC5nZXQoXCJfcHkyanNfcmVzdHlsZVwiKTtcbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHJlc3R5bGVEYXRhID0gbXNnRGF0YS5yZXN0eWxlX2RhdGE7XG4gICAgICB2YXIgcmVzdHlsZVRyYWNlcyA9IHRoaXMuX25vcm1hbGl6ZV90cmFjZV9pbmRleGVzKG1zZ0RhdGEucmVzdHlsZV90cmFjZXMpO1xuICAgICAgcGVyZm9ybVJlc3R5bGVMaWtlKHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIiksIHJlc3R5bGVEYXRhLCByZXN0eWxlVHJhY2VzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHJlbGF5b3V0IG1lc3NhZ2VcbiAgICovXG4gIGRvX3JlbGF5b3V0KCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNSZWxheW91dE1zZ30gKi9cbiAgICB2YXIgbXNnRGF0YTogUHkySnNSZWxheW91dE1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3JlbGF5b3V0XCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHBlcmZvcm1SZWxheW91dExpa2UodGhpcy5tb2RlbC5nZXQoXCJfbGF5b3V0XCIpLCBtc2dEYXRhLnJlbGF5b3V0X2RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdXBkYXRlIG1lc3NhZ2VcbiAgICovXG4gIGRvX3VwZGF0ZSgpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzVXBkYXRlTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1VwZGF0ZU1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3VwZGF0ZVwiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgc3R5bGUgPSBtc2dEYXRhLnN0eWxlX2RhdGE7XG4gICAgICB2YXIgbGF5b3V0ID0gbXNnRGF0YS5sYXlvdXRfZGF0YTtcbiAgICAgIHZhciBzdHlsZVRyYWNlcyA9IHRoaXMuX25vcm1hbGl6ZV90cmFjZV9pbmRleGVzKG1zZ0RhdGEuc3R5bGVfdHJhY2VzKTtcbiAgICAgIHBlcmZvcm1SZXN0eWxlTGlrZSh0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpLCBzdHlsZSwgc3R5bGVUcmFjZXMpO1xuICAgICAgcGVyZm9ybVJlbGF5b3V0TGlrZSh0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIiksIGxheW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhbmltYXRlIG1lc3NhZ2VcbiAgICovXG4gIGRvX2FuaW1hdGUoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc0FuaW1hdGVNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzQW5pbWF0ZU1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2FuaW1hdGVcIik7XG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBzdHlsZXMgPSBtc2dEYXRhLnN0eWxlX2RhdGE7XG4gICAgICB2YXIgbGF5b3V0ID0gbXNnRGF0YS5sYXlvdXRfZGF0YTtcbiAgICAgIHZhciB0cmFjZV9pbmRleGVzID0gdGhpcy5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMobXNnRGF0YS5zdHlsZV90cmFjZXMpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZXNbaV07XG4gICAgICAgIHZhciB0cmFjZV9pbmRleCA9IHRyYWNlX2luZGV4ZXNbaV07XG4gICAgICAgIHZhciB0cmFjZSA9IHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIilbdHJhY2VfaW5kZXhdO1xuICAgICAgICBwZXJmb3JtUmVsYXlvdXRMaWtlKHRyYWNlLCBzdHlsZSk7XG4gICAgICB9XG5cbiAgICAgIHBlcmZvcm1SZWxheW91dExpa2UodGhpcy5tb2RlbC5nZXQoXCJfbGF5b3V0XCIpLCBsYXlvdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcmVtb3ZlTGF5b3V0UHJvcHMgbWVzc2FnZVxuICAgKi9cbiAgZG9fcmVtb3ZlTGF5b3V0UHJvcHMoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc1JlbW92ZUxheW91dFByb3BzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1JlbW92ZUxheW91dFByb3BzTXNnID0gdGhpcy5tb2RlbC5nZXQoXG4gICAgICBcIl9weTJqc19yZW1vdmVMYXlvdXRQcm9wc1wiXG4gICAgKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIga2V5UGF0aHMgPSBtc2dEYXRhLnJlbW92ZV9wcm9wcztcbiAgICAgIHZhciBsYXlvdXQgPSB0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIik7XG4gICAgICBwZXJmb3JtUmVtb3ZlUHJvcHMobGF5b3V0LCBrZXlQYXRocyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSByZW1vdmVUcmFjZVByb3BzIG1lc3NhZ2VcbiAgICovXG4gIGRvX3JlbW92ZVRyYWNlUHJvcHMoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc1JlbW92ZVRyYWNlUHJvcHNNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzUmVtb3ZlVHJhY2VQcm9wc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3JlbW92ZVRyYWNlUHJvcHNcIik7XG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIHZhciBrZXlQYXRocyA9IG1zZ0RhdGEucmVtb3ZlX3Byb3BzO1xuICAgICAgdmFyIHRyYWNlSW5kZXggPSBtc2dEYXRhLnJlbW92ZV90cmFjZTtcbiAgICAgIHZhciB0cmFjZSA9IHRoaXMubW9kZWwuZ2V0KFwiX2RhdGFcIilbdHJhY2VJbmRleF07XG5cbiAgICAgIHBlcmZvcm1SZW1vdmVQcm9wcyh0cmFjZSwga2V5UGF0aHMpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBzZXJpYWxpemVyczogUmVjb3JkPHN0cmluZywgU2VyaWFsaXplcj4gPSB7XG4gIF9kYXRhOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9sYXlvdXQ6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX3B5MmpzX2FkZFRyYWNlczoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfcHkyanNfZGVsZXRlVHJhY2VzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19tb3ZlVHJhY2VzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19yZXN0eWxlOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19yZWxheW91dDoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfcHkyanNfdXBkYXRlOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19hbmltYXRlOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9weTJqc19yZW1vdmVMYXlvdXRQcm9wczoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfcHkyanNfcmVtb3ZlVHJhY2VQcm9wczoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfanMycHlfcmVzdHlsZToge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfanMycHlfcmVsYXlvdXQ6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX2pzMnB5X3VwZGF0ZToge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxuICBfanMycHlfbGF5b3V0RGVsdGE6IHtcbiAgICBkZXNlcmlhbGl6ZTogcHkyanNfZGVzZXJpYWxpemVyLFxuICAgIHNlcmlhbGl6ZToganMycHlfc2VyaWFsaXplcixcbiAgfSxcbiAgX2pzMnB5X3RyYWNlRGVsdGFzOiB7XG4gICAgZGVzZXJpYWxpemU6IHB5MmpzX2Rlc2VyaWFsaXplcixcbiAgICBzZXJpYWxpemU6IGpzMnB5X3NlcmlhbGl6ZXIsXG4gIH0sXG4gIF9qczJweV9wb2ludHNDYWxsYmFjazoge1xuICAgIGRlc2VyaWFsaXplOiBweTJqc19kZXNlcmlhbGl6ZXIsXG4gICAgc2VyaWFsaXplOiBqczJweV9zZXJpYWxpemVyLFxuICB9LFxufTtcblxuLy8gVmlld1xuLy8gPT09PVxuLyoqXG4gKiBBIEZpZ3VyZVZpZXcgbWFuYWdlcyB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBQbG90bHkuanNcbiAqIGZpZ3VyZSBmb3IgYSBzaW5nbGUgbm90ZWJvb2sgb3V0cHV0IGNlbGwuIEVhY2ggRmlndXJlVmlldyBoYXMgYVxuICogcmVmZXJlbmNlIHRvIEZpZ3VyZU1vZGVsLiAgTXVsdGlwbGUgdmlld3MgbWF5IHNoYXJlIGEgc2luZ2xlIG1vZGVsXG4gKiBpbnN0YW5jZSwgYXMgaXMgdGhlIGNhc2Ugd2hlbiBhIFB5dGhvbiBGaWd1cmVXaWRnZXQgaXMgZGlzcGxheWVkIGluXG4gKiBtdWx0aXBsZSBub3RlYm9vayBvdXRwdXQgY2VsbHMuXG4gKlxuICogQHR5cGUge3dpZGdldHMuRE9NV2lkZ2V0Vmlld31cbiAqL1xuZXhwb3J0IGNsYXNzIEZpZ3VyZVZpZXcge1xuICB2aWV3SUQ6IHN0cmluZyA9ICcnO1xuICByZXNpemVFdmVudExpc3RlbmVyOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgbW9kZWw6IEZpZ3VyZU1vZGVsO1xuICBlbDogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IEZpZ3VyZU1vZGVsLCBlbDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5lbCA9IGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwZXJmb3JtX3JlbmRlciBtZXRob2QgaXMgY2FsbGVkIGJ5IHByb2Nlc3NMdW1pbm9NZXNzYWdlXG4gICAqIGFmdGVyIHRoZSB3aWRnZXQncyBET00gZWxlbWVudCBoYXMgYmVlbiBhdHRhY2hlZCB0byB0aGUgbm90ZWJvb2tcbiAgICogb3V0cHV0IGNlbGwuIFRoaXMgaGFwcGVucyBhZnRlciB0aGUgaW5pdGlhbGl6ZSBvZiB0aGVcbiAgICogRmlndXJlTW9kZWwsIGFuZCBpdCB3b24ndCBoYXBwZW4gYXQgYWxsIGlmIHRoZSBQeXRob24gRmlndXJlV2lkZ2V0XG4gICAqIGlzIG5ldmVyIGRpc3BsYXllZCBpbiBhIG5vdGVib29rIG91dHB1dCBjZWxsXG4gICAqL1xuICBwZXJmb3JtX3JlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAvLyBXaXJlIHVwIG1lc3NhZ2UgcHJvcGVydHkgY2FsbGJhY2tzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFB5dGhvbiAtPiBKUyBldmVudCBwcm9wZXJ0aWVzXG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpfcHkyanNfYWRkVHJhY2VzXCIsICgpID0+IHRoaXMuZG9fYWRkVHJhY2VzKCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX2RlbGV0ZVRyYWNlc1wiLCAoKSA9PiB0aGlzLmRvX2RlbGV0ZVRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19tb3ZlVHJhY2VzXCIsICgpID0+IHRoaXMuZG9fbW92ZVRyYWNlcygpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZXN0eWxlXCIsICgpID0+IHRoaXMuZG9fcmVzdHlsZSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19yZWxheW91dFwiLCAoKSA9PiB0aGlzLmRvX3JlbGF5b3V0KCkpO1xuICAgIHRoaXMubW9kZWwub24oXCJjaGFuZ2U6X3B5MmpzX3VwZGF0ZVwiLCAoKSA9PiB0aGlzLmRvX3VwZGF0ZSgpKTtcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOl9weTJqc19hbmltYXRlXCIsICgpID0+IHRoaXMuZG9fYW5pbWF0ZSgpKTtcblxuICAgIC8vIE1hdGhKYXggdjIgY29uZmlndXJhdGlvblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICh3aW5kb3cgYXMgYW55KT8uTWF0aEpheD8uSHViPy5Db25maWc/Lih7IFNWRzogeyBmb250OiBcIlNUSVgtV2ViXCIgfSB9KTtcblxuICAgIC8vIEdldCBtZXNzYWdlIGlkc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHZhciBsYXlvdXRfZWRpdF9pZCA9IHRoaXMubW9kZWwuZ2V0KFwiX2xhc3RfbGF5b3V0X2VkaXRfaWRcIik7XG4gICAgdmFyIHRyYWNlX2VkaXRfaWQgPSB0aGlzLm1vZGVsLmdldChcIl9sYXN0X3RyYWNlX2VkaXRfaWRcIik7XG5cbiAgICAvLyBTZXQgdmlldyBVSURcbiAgICAvLyAtLS0tLS0tLS0tLS1cbiAgICB0aGlzLnZpZXdJRCA9IHJhbmRzdHIoKTtcblxuICAgIC8vIEluaXRpYWxpemUgUGxvdGx5LmpzIGZpZ3VyZVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFdlIG11c3QgY2xvbmUgdGhlIG1vZGVsJ3MgZGF0YSBhbmQgbGF5b3V0IHByb3BlcnRpZXMgc28gdGhhdFxuICAgIC8vIHRoZSBtb2RlbCBpcyBub3QgZGlyZWN0bHkgbXV0YXRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnkuXG4gICAgdmFyIGluaXRpYWxUcmFjZXMgPSBfLmNsb25lRGVlcCh0aGlzLm1vZGVsLmdldChcIl9kYXRhXCIpKTtcbiAgICB2YXIgaW5pdGlhbExheW91dCA9IF8uY2xvbmVEZWVwKHRoaXMubW9kZWwuZ2V0KFwiX2xheW91dFwiKSk7XG4gICAgaWYgKCFpbml0aWFsTGF5b3V0LmhlaWdodCkge1xuICAgICAgaW5pdGlhbExheW91dC5oZWlnaHQgPSAzNjA7XG4gICAgfVxuICAgIHZhciBjb25maWcgPSB0aGlzLm1vZGVsLmdldChcIl9jb25maWdcIik7XG4gICAgY29uZmlnLmVkaXRTZWxlY3Rpb24gPSBmYWxzZTtcblxuICAgIFBsb3RseS5uZXdQbG90KHRoYXQuZWwsIGluaXRpYWxUcmFjZXMsIGluaXRpYWxMYXlvdXQsIGNvbmZpZykudGhlbihcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgICAvLyBXZSBjcmVhdGUgYW4gYXJyYXkgb2YgZGVsdGFzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG5ld1xuICAgICAgICAvLyB0cmFjZXMuXG4gICAgICAgIHRoYXQuX3NlbmRUcmFjZURlbHRhcyh0cmFjZV9lZGl0X2lkKTtcblxuICAgICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICAgIHRoYXQuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG5cbiAgICAgICAgLy8gV2lyZSB1cCBwbG90bHkgZXZlbnQgY2FsbGJhY2tzXG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X3Jlc3R5bGVcIiwgZnVuY3Rpb24gKHVwZGF0ZTogYW55KSB7XG4gICAgICAgICAgdGhhdC5oYW5kbGVfcGxvdGx5X3Jlc3R5bGUodXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X3JlbGF5b3V0XCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV9yZWxheW91dCh1cGRhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhhdC5lbCkub24oXCJwbG90bHlfdXBkYXRlXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAvLyAgIHRoYXQuaGFuZGxlX3Bsb3RseV91cGRhdGUodXBkYXRlKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X2NsaWNrXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV9jbGljayh1cGRhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhhdC5lbCkub24oXCJwbG90bHlfaG92ZXJcIiwgZnVuY3Rpb24gKHVwZGF0ZTogYW55KSB7XG4gICAgICAgICAgdGhhdC5oYW5kbGVfcGxvdGx5X2hvdmVyKHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV91bmhvdmVyXCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlX3Bsb3RseV91bmhvdmVyKHVwZGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGF0LmVsKS5vbihcInBsb3RseV9zZWxlY3RlZFwiLCBmdW5jdGlvbiAodXBkYXRlOiBhbnkpIHtcbiAgICAgICAgICB0aGF0LmhhbmRsZV9wbG90bHlfc2VsZWN0ZWQodXBkYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoYXQuZWwpLm9uKFwicGxvdGx5X2Rlc2VsZWN0XCIsIGZ1bmN0aW9uICh1cGRhdGU6IGFueSkge1xuICAgICAgICAvLyAgIHRoYXQuaGFuZGxlX3Bsb3RseV9kZXNlbGVjdCh1cGRhdGUpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhhdC5lbCkub24oXCJwbG90bHlfZG91YmxlY2xpY2tcIiwgZnVuY3Rpb24gKHVwZGF0ZTogYW55KSB7XG4gICAgICAgIC8vICAgdGhhdC5oYW5kbGVfcGxvdGx5X2RvdWJsZWNsaWNrKHVwZGF0ZSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIC8vIEVtaXQgZXZlbnQgaW5kaWNhdGluZyB0aGF0IHRoZSB3aWRnZXQgaGFzIGZpbmlzaGVkXG4gICAgICAgIC8vIHJlbmRlcmluZ1xuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwbG90bHl3aWRnZXQtYWZ0ZXItcmVuZGVyXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgZWxlbWVudDogdGhhdC5lbCwgdmlld0lEOiB0aGF0LnZpZXdJRCB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEaXNwYXRjaC9UcmlnZ2VyL0ZpcmUgdGhlIGV2ZW50XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVzcG9uZCB0byBMdW1pbm8gZXZlbnRzXG4gICAqL1xuICBfcHJvY2Vzc0x1bWlub01lc3NhZ2UobXNnOiBhbnksIF9zdXBlcjogYW55KSB7XG4gICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJiZWZvcmUtYXR0YWNoXCI6XG4gICAgICAgIC8vIFJlbmRlciBhbiBpbml0aWFsIGVtcHR5IGZpZ3VyZS4gVGhpcyBlc3RhYmxpc2hlcyB3aXRoXG4gICAgICAgIC8vIHRoZSBwYWdlIHRoYXQgdGhlIGVsZW1lbnQgd2lsbCBub3QgYmUgZW1wdHksIGF2b2lkaW5nXG4gICAgICAgIC8vIHNvbWUgb2NjYXNpb25zIHdoZXJlIHRoZSBkeW5hbWljIHNpemluZyBiZWhhdmlvciBsZWFkc1xuICAgICAgICAvLyB0byBjb2xsYXBzZWQgZmlndXJlIGRpbWVuc2lvbnMuXG4gICAgICAgIHZhciBheGlzSGlkZGVuID0ge1xuICAgICAgICAgIHNob3dncmlkOiBmYWxzZSxcbiAgICAgICAgICBzaG93bGluZTogZmFsc2UsXG4gICAgICAgICAgdGlja3ZhbHM6IFtdIGFzIGFueVtdLFxuICAgICAgICB9O1xuXG4gICAgICAgIFBsb3RseS5uZXdQbG90KHRoYXQuZWwsIFtdLCB7XG4gICAgICAgICAgeGF4aXM6IGF4aXNIaWRkZW4sXG4gICAgICAgICAgeWF4aXM6IGF4aXNIaWRkZW4sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc2l6ZUV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hdXRvc2l6ZUZpZ3VyZSgpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMucmVzaXplRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImFmdGVyLWF0dGFjaFwiOlxuICAgICAgICAvLyBSZW5kZXJpbmcgYWN0dWFsIGZpZ3VyZSBpbiB0aGUgYWZ0ZXItYXR0YWNoIGV2ZW50IGFsbG93c1xuICAgICAgICAvLyBQbG90bHkuanMgdG8gc2l6ZSB0aGUgZmlndXJlIHRvIGZpbGwgdGhlIGF2YWlsYWJsZSBlbGVtZW50XG4gICAgICAgIHRoaXMucGVyZm9ybV9yZW5kZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYWZ0ZXItc2hvd1wiOlxuICAgICAgY2FzZSBcInJlc2l6ZVwiOlxuICAgICAgICB0aGlzLmF1dG9zaXplRmlndXJlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb2Nlc3NQaG9zcGhvck1lc3NhZ2UobXNnOiBhbnkpIHtcbiAgLy8gICB0aGlzLl9wcm9jZXNzTHVtaW5vTWVzc2FnZShtc2csIHN1cGVyW1wicHJvY2Vzc1Bob3NwaG9yTWVzc2FnZVwiXSk7XG4gIC8vIH1cblxuICAvLyBwcm9jZXNzTHVtaW5vTWVzc2FnZShtc2c6IGFueSkge1xuICAvLyAgIHRoaXMuX3Byb2Nlc3NMdW1pbm9NZXNzYWdlKG1zZywgc3VwZXJbXCJwcm9jZXNzTHVtaW5vTWVzc2FnZVwiXSk7XG4gIC8vIH1cblxuICBhdXRvc2l6ZUZpZ3VyZSgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGxheW91dCA9IHRoYXQubW9kZWwuZ2V0KFwiX2xheW91dFwiKTtcbiAgICBpZiAoXy5pc05pbChsYXlvdXQpIHx8IF8uaXNOaWwobGF5b3V0LndpZHRoKSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgUGxvdGx5LlBsb3RzLnJlc2l6ZSh0aGF0LmVsKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxheW91dF9lZGl0X2lkID0gdGhhdC5tb2RlbC5nZXQoXCJfbGFzdF9sYXlvdXRfZWRpdF9pZFwiKTtcbiAgICAgICAgdGhhdC5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXJnZSBQbG90bHkuanMgZGF0YSBzdHJ1Y3R1cmVzIGZyb20gdGhlIG5vdGVib29rIG91dHB1dCBkaXNwbGF5XG4gICAqIGVsZW1lbnQgd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWRcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICBQbG90bHkucHVyZ2UodGhpcy5lbCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5yZXNpemVFdmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZpZ3VyZSdzIF9mdWxsRGF0YSBhcnJheSBtZXJnZWQgd2l0aCBpdHMgZGF0YSBhcnJheVxuICAgKlxuICAgKiBUaGUgbWVyZ2UgZW5zdXJlcyB0aGF0IGZvciBhbnkgcHJvcGVydGllcyB0aGF0IGVsLl9mdWxsRGF0YSBhbmRcbiAgICogZWwuZGF0YSBoYXZlIGluIGNvbW1vbiwgd2UgcmV0dXJuIHRoZSB2ZXJzaW9uIGZyb20gZWwuZGF0YVxuICAgKlxuICAgKiBOYW1lZCBjb2xvcnNjYWxlcyBhcmUgb25lIGV4YW1wbGUgb2Ygd2h5IHRoaXMgaXMgbmVlZGVkLiBUaGUgZWwuZGF0YVxuICAgKiBhcnJheSB3aWxsIGhvbGQgbmFtZWQgY29sb3JzY2FsZSBzdHJpbmdzIChlLmcuICdWaXJpZGlzJyksIHdoaWxlIHRoZVxuICAgKiBlbC5fZnVsbERhdGEgYXJyYXkgd2lsbCBob2xkIHRoZSBhY3R1YWwgY29sb3JzY2FsZSBhcnJheS4gZS5nLlxuICAgKlxuICAgKiAgICAgIGVsLmRhdGFbMF0ubWFya2VyLmNvbG9yc2NhbGUgPT0gJ1ZpcmlkaXMnIGJ1dFxuICAgKiAgICAgIGVsLl9mdWxsRGF0YVswXS5tYXJrZXIuY29sb3JzY2FsZSA9IFtbLi4uLCAuLi5dLCAuLi5dXG4gICAqXG4gICAqIFBlcmZvcm1pbmcgdGhlIG1lcmdlIGFsbG93cyBvdXIgRmlndXJlTW9kZWwgdG8gcmV0YWluIHRoZSAnVmlyaWRpcydcbiAgICogc3RyaW5nLCByYXRoZXIgdGhhbiBoYXZpbmcgaXQgb3ZlcnJpZGRlZCBieSB0aGUgY29sb3JzY2FsZSBhcnJheS5cbiAgICpcbiAgICovXG4gIGdldEZ1bGxEYXRhKCkge1xuICAgIHJldHVybiAoPFBsb3RseS5QbG90bHlIVE1MRWxlbWVudD50aGlzLmVsKS5kYXRhc2V0O1xuICAgIC8vIHJldHVybiBfLm1lcmdlV2l0aChcbiAgICAvLyAgIHt9LFxuICAgIC8vICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhpcy5lbCkuX2Z1bGxEYXRhLFxuICAgIC8vICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhpcy5lbCkuZGF0YSxcbiAgICAvLyAgIGZ1bGxNZXJnZUN1c3RvbWl6ZXJcbiAgICAvLyApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZmlndXJlJ3MgX2Z1bGxMYXlvdXQgb2JqZWN0IG1lcmdlZCB3aXRoIGl0cyBsYXlvdXQgb2JqZWN0XG4gICAqXG4gICAqIFNlZSBnZXRGdWxsRGF0YSBkb2N1bWVudGF0aW9uIGZvciBkaXNjdXNzaW9uIG9mIHdoeSB0aGUgbWVyZ2UgaXNcbiAgICogbmVjZXNzYXJ5XG4gICAqL1xuICBnZXRGdWxsTGF5b3V0KCkge1xuICAgIHJldHVybiB7fTtcbiAgICAvLyByZXR1cm4gXy5tZXJnZVdpdGgoXG4gICAgLy8gICB7fSxcbiAgICAvLyAgICg8UGxvdGx5LlBsb3RseUhUTUxFbGVtZW50PnRoaXMuZWwpLl9mdWxsTGF5b3V0LFxuICAgIC8vICAgKDxQbG90bHkuUGxvdGx5SFRNTEVsZW1lbnQ+dGhpcy5lbCkubGF5LFxuICAgIC8vICAgZnVsbE1lcmdlQ3VzdG9taXplclxuICAgIC8vICk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgUG9pbnRzIGRhdGEgc3RydWN0dXJlIGZyb20gZGF0YSBzdXBwbGllZCBieSB0aGUgcGxvdGx5X2NsaWNrLFxuICAgKiBwbG90bHlfaG92ZXIsIG9yIHBsb3RseV9zZWxlY3QgZXZlbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm5zIHtudWxsfFBvaW50c31cbiAgICovXG4gIGJ1aWxkUG9pbnRzT2JqZWN0KGRhdGE6IGFueSk6IG51bGwgfCBQb2ludHMge1xuICAgIHZhciBwb2ludHNPYmplY3Q6IFBvaW50cztcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInBvaW50c1wiKSkge1xuICAgICAgLy8gTW9zdCBjYXJ0ZXNpYW4gcGxvdHNcbiAgICAgIHZhciBwb2ludE9iamVjdHMgPSBkYXRhW1wicG9pbnRzXCJdO1xuICAgICAgdmFyIG51bVBvaW50cyA9IHBvaW50T2JqZWN0cy5sZW5ndGg7XG5cbiAgICAgIHZhciBoYXNOZXN0ZWRQb2ludE9iamVjdHMgPSB0cnVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuICAgICAgICBoYXNOZXN0ZWRQb2ludE9iamVjdHMgPVxuICAgICAgICAgIGhhc05lc3RlZFBvaW50T2JqZWN0cyAmJlxuICAgICAgICAgIHBvaW50T2JqZWN0c1tpXS5oYXNPd25Qcm9wZXJ0eShcInBvaW50TnVtYmVyc1wiKTtcbiAgICAgICAgaWYgKCFoYXNOZXN0ZWRQb2ludE9iamVjdHMpIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIG51bVBvaW50TnVtYmVycyA9IG51bVBvaW50cztcbiAgICAgIGlmIChoYXNOZXN0ZWRQb2ludE9iamVjdHMpIHtcbiAgICAgICAgbnVtUG9pbnROdW1iZXJzID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuICAgICAgICAgIG51bVBvaW50TnVtYmVycyArPSBwb2ludE9iamVjdHNbaV1bXCJwb2ludE51bWJlcnNcIl0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludHNPYmplY3QgPSB7XG4gICAgICAgIHRyYWNlX2luZGV4ZXM6IG5ldyBBcnJheShudW1Qb2ludE51bWJlcnMpLFxuICAgICAgICBwb2ludF9pbmRleGVzOiBuZXcgQXJyYXkobnVtUG9pbnROdW1iZXJzKSxcbiAgICAgICAgeHM6IG5ldyBBcnJheShudW1Qb2ludE51bWJlcnMpLFxuICAgICAgICB5czogbmV3IEFycmF5KG51bVBvaW50TnVtYmVycyksXG4gICAgICB9O1xuXG4gICAgICBpZiAoaGFzTmVzdGVkUG9pbnRPYmplY3RzKSB7XG4gICAgICAgIHZhciBmbGF0UG9pbnRJbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtUG9pbnRzOyBwKyspIHtcbiAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgaSA8IHBvaW50T2JqZWN0c1twXVtcInBvaW50TnVtYmVyc1wiXS5sZW5ndGg7XG4gICAgICAgICAgICBpKyssIGZsYXRQb2ludEluZGV4KytcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBvaW50c09iamVjdFtcInBvaW50X2luZGV4ZXNcIl1bZmxhdFBvaW50SW5kZXhdID1cbiAgICAgICAgICAgICAgcG9pbnRPYmplY3RzW3BdW1wicG9pbnROdW1iZXJzXCJdW2ldO1xuICAgICAgICAgICAgLy8gYWxzbyBhZGQgeHMsIHlzIGFuZCB0cmFjZXMgc28gdGhhdCB0aGUgYXJyYXkgZG9lc24ndCBnZXQgdHJ1bmNhdGVkIGxhdGVyXG4gICAgICAgICAgICBwb2ludHNPYmplY3RbXCJ4c1wiXVtmbGF0UG9pbnRJbmRleF0gPSBwb2ludE9iamVjdHNbcF1bXCJ4XCJdO1xuICAgICAgICAgICAgcG9pbnRzT2JqZWN0W1wieXNcIl1bZmxhdFBvaW50SW5kZXhdID0gcG9pbnRPYmplY3RzW3BdW1wieVwiXTtcbiAgICAgICAgICAgIHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1bZmxhdFBvaW50SW5kZXhdID1cbiAgICAgICAgICAgICAgcG9pbnRPYmplY3RzW3BdW1wiY3VydmVOdW1iZXJcIl07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNpbmdsZV90cmFjZSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnVtUG9pbnROdW1iZXJzOyBpKyspIHtcbiAgICAgICAgICBzaW5nbGVfdHJhY2UgPSBzaW5nbGVfdHJhY2UgJiYgKHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1baSAtIDFdID09PSBwb2ludHNPYmplY3RbXCJ0cmFjZV9pbmRleGVzXCJdW2ldKVxuICAgICAgICAgIGlmICghc2luZ2xlX3RyYWNlKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2luZ2xlX3RyYWNlKSB7XG4gICAgICAgICAgcG9pbnRzT2JqZWN0W1wicG9pbnRfaW5kZXhlc1wiXS5zb3J0KChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBudW1Qb2ludHM7IHArKykge1xuICAgICAgICAgIHBvaW50c09iamVjdFtcInRyYWNlX2luZGV4ZXNcIl1bcF0gPSBwb2ludE9iamVjdHNbcF1bXCJjdXJ2ZU51bWJlclwiXTtcbiAgICAgICAgICBwb2ludHNPYmplY3RbXCJwb2ludF9pbmRleGVzXCJdW3BdID0gcG9pbnRPYmplY3RzW3BdW1wicG9pbnROdW1iZXJcIl07XG4gICAgICAgICAgcG9pbnRzT2JqZWN0W1wieHNcIl1bcF0gPSBwb2ludE9iamVjdHNbcF1bXCJ4XCJdO1xuICAgICAgICAgIHBvaW50c09iamVjdFtcInlzXCJdW3BdID0gcG9pbnRPYmplY3RzW3BdW1wieVwiXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZGQgeiBpZiBwcmVzZW50XG4gICAgICB2YXIgaGFzWiA9XG4gICAgICAgIHBvaW50T2JqZWN0c1swXSAhPT0gdW5kZWZpbmVkICYmIHBvaW50T2JqZWN0c1swXS5oYXNPd25Qcm9wZXJ0eShcInpcIik7XG4gICAgICBpZiAoaGFzWikge1xuICAgICAgICBwb2ludHNPYmplY3RbXCJ6c1wiXSA9IG5ldyBBcnJheShudW1Qb2ludHMpO1xuICAgICAgICBmb3IgKHAgPSAwOyBwIDwgbnVtUG9pbnRzOyBwKyspIHtcbiAgICAgICAgICBwb2ludHNPYmplY3RbXCJ6c1wiXVtwXSA9IHBvaW50T2JqZWN0c1twXVtcInpcIl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvaW50c09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIElucHV0RGV2aWNlU3RhdGUgZGF0YSBzdHJ1Y3R1cmUgZnJvbSBkYXRhIHN1cHBsaWVkIGJ5IHRoZVxuICAgKiBwbG90bHlfY2xpY2ssIHBsb3RseV9ob3Zlciwgb3IgcGxvdGx5X3NlbGVjdCBldmVudHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybnMge251bGx8SW5wdXREZXZpY2VTdGF0ZX1cbiAgICovXG4gIGJ1aWxkSW5wdXREZXZpY2VTdGF0ZU9iamVjdChkYXRhOiBhbnkpOiBudWxsIHwgSW5wdXREZXZpY2VTdGF0ZSB7XG4gICAgdmFyIGV2ZW50ID0gZGF0YVtcImV2ZW50XCJdO1xuICAgIGlmIChldmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLyoqIEB0eXBlIHtJbnB1dERldmljZVN0YXRlfSAqL1xuICAgICAgdmFyIGlucHV0RGV2aWNlU3RhdGU6IElucHV0RGV2aWNlU3RhdGUgPSB7XG4gICAgICAgIC8vIEtleWJvYXJkIG1vZGlmaWVyc1xuICAgICAgICBhbHQ6IGV2ZW50W1wiYWx0S2V5XCJdLFxuICAgICAgICBjdHJsOiBldmVudFtcImN0cmxLZXlcIl0sXG4gICAgICAgIG1ldGE6IGV2ZW50W1wibWV0YUtleVwiXSxcbiAgICAgICAgc2hpZnQ6IGV2ZW50W1wic2hpZnRLZXlcIl0sXG5cbiAgICAgICAgLy8gTW91c2UgYnV0dG9uc1xuICAgICAgICBidXR0b246IGV2ZW50W1wiYnV0dG9uXCJdLFxuICAgICAgICBidXR0b25zOiBldmVudFtcImJ1dHRvbnNcIl0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGlucHV0RGV2aWNlU3RhdGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIFNlbGVjdG9yIGRhdGEgc3RydWN0dXJlIGZyb20gZGF0YSBzdXBwbGllZCBieSB0aGVcbiAgICogcGxvdGx5X3NlbGVjdCBldmVudFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7bnVsbHxTZWxlY3Rvcn1cbiAgICovXG4gIGJ1aWxkU2VsZWN0b3JPYmplY3QoZGF0YTogYW55KTogbnVsbCB8IFNlbGVjdG9yIHtcbiAgICB2YXIgc2VsZWN0b3JPYmplY3Q6IFNlbGVjdG9yIHwgbnVsbDtcblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwicmFuZ2VcIikpIHtcbiAgICAgIC8vIEJveCBzZWxlY3Rpb25cbiAgICAgIHNlbGVjdG9yT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBcImJveFwiLFxuICAgICAgICBzZWxlY3Rvcl9zdGF0ZToge1xuICAgICAgICAgIHhyYW5nZTogZGF0YVtcInJhbmdlXCJdW1wieFwiXSxcbiAgICAgICAgICB5cmFuZ2U6IGRhdGFbXCJyYW5nZVwiXVtcInlcIl0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImxhc3NvUG9pbnRzXCIpKSB7XG4gICAgICAvLyBMYXNzbyBzZWxlY3Rpb25cbiAgICAgIHNlbGVjdG9yT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBcImxhc3NvXCIsXG4gICAgICAgIHNlbGVjdG9yX3N0YXRlOiB7XG4gICAgICAgICAgeHM6IGRhdGFbXCJsYXNzb1BvaW50c1wiXVtcInhcIl0sXG4gICAgICAgICAgeXM6IGRhdGFbXCJsYXNzb1BvaW50c1wiXVtcInlcIl0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvck9iamVjdCA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvck9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdHlfcmVzdHlsZSBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfcmVzdHlsZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIGRhdGEgdG8gcmVwb3J0IHRvIHRoZSBQeXRob24gc2lkZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhWzBdICYmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoXCJfZG9Ob3RSZXBvcnRUb1B5XCIpKSB7XG4gICAgICAvLyBSZXN0eWxlIG9yaWdpbmF0ZWQgb24gdGhlIFB5dGhvbiBzaWRlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVW5wYWNrIGRhdGFcbiAgICB2YXIgc3R5bGVEYXRhID0gZGF0YVswXTtcbiAgICB2YXIgc3R5bGVUcmFjZXMgPSBkYXRhWzFdO1xuXG4gICAgLy8gQ29uc3RydWN0IHJlc3R5bGUgbWVzc2FnZSB0byBzZW5kIHRvIHRoZSBQeXRob24gc2lkZVxuICAgIC8qKiBAdHlwZSB7SnMyUHlSZXN0eWxlTXNnfSAqL1xuICAgIHZhciByZXN0eWxlTXNnOiBKczJQeVJlc3R5bGVNc2cgPSB7XG4gICAgICBzdHlsZV9kYXRhOiBzdHlsZURhdGEsXG4gICAgICBzdHlsZV90cmFjZXM6IHN0eWxlVHJhY2VzLFxuICAgICAgc291cmNlX3ZpZXdfaWQ6IHRoaXMudmlld0lELFxuICAgIH07XG5cbiAgICB0aGlzLm1vZGVsLnNldChcIl9qczJweV9yZXN0eWxlXCIsIHJlc3R5bGVNc2cpO1xuICAgIHRoaXMudG91Y2goKTtcbiAgfVxuXG4gIHRvdWNoKCkge1xuICAgIHRoaXMubW9kZWwuc2F2ZV9jaGFuZ2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHBsb3RseV9yZWxheW91dCBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfcmVsYXlvdXQoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyBkYXRhIHRvIHJlcG9ydCB0byB0aGUgUHl0aG9uIHNpZGVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcIl9kb05vdFJlcG9ydFRvUHlcIikpIHtcbiAgICAgIC8vIFJlbGF5b3V0IG9yaWdpbmF0ZWQgb24gdGhlIFB5dGhvbiBzaWRlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtKczJQeVJlbGF5b3V0TXNnfSAqL1xuICAgIHZhciByZWxheW91dE1zZzogSnMyUHlSZWxheW91dE1zZyA9IHtcbiAgICAgIHJlbGF5b3V0X2RhdGE6IGRhdGEsXG4gICAgICBzb3VyY2Vfdmlld19pZDogdGhpcy52aWV3SUQsXG4gICAgfTtcblxuICAgIHRoaXMubW9kZWwuc2V0KFwiX2pzMnB5X3JlbGF5b3V0XCIsIHJlbGF5b3V0TXNnKTtcbiAgICB0aGlzLnRvdWNoKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHBsb3RseV91cGRhdGUgZXZlbnRzIGVtaXR0ZWQgYnkgdGhlIFBsb3RseS5qcyBsaWJyYXJ5XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBoYW5kbGVfcGxvdGx5X3VwZGF0ZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIGRhdGEgdG8gcmVwb3J0IHRvIHRoZSBQeXRob24gc2lkZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhW1wiZGF0YVwiXSAmJiBkYXRhW1wiZGF0YVwiXVswXS5oYXNPd25Qcm9wZXJ0eShcIl9kb05vdFJlcG9ydFRvUHlcIikpIHtcbiAgICAgIC8vIFVwZGF0ZSBvcmlnaW5hdGVkIG9uIHRoZSBQeXRob24gc2lkZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7SnMyUHlVcGRhdGVNc2d9ICovXG4gICAgdmFyIHVwZGF0ZU1zZzogSnMyUHlVcGRhdGVNc2cgPSB7XG4gICAgICBzdHlsZV9kYXRhOiBkYXRhW1wiZGF0YVwiXVswXSxcbiAgICAgIHN0eWxlX3RyYWNlczogZGF0YVtcImRhdGFcIl1bMV0sXG4gICAgICBsYXlvdXRfZGF0YTogZGF0YVtcImxheW91dFwiXSxcbiAgICAgIHNvdXJjZV92aWV3X2lkOiB0aGlzLnZpZXdJRCxcbiAgICB9O1xuXG4gICAgLy8gTG9nIG1lc3NhZ2VcbiAgICB0aGlzLm1vZGVsLnNldChcIl9qczJweV91cGRhdGVcIiwgdXBkYXRlTXNnKTtcbiAgICB0aGlzLnRvdWNoKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHBsb3RseV9jbGljayBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfY2xpY2soZGF0YTogYW55KSB7XG4gICAgdGhpcy5fc2VuZF9wb2ludHNfY2FsbGJhY2tfbWVzc2FnZShkYXRhLCBcInBsb3RseV9jbGlja1wiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X2hvdmVyIGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9ob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLl9zZW5kX3BvaW50c19jYWxsYmFja19tZXNzYWdlKGRhdGEsIFwicGxvdGx5X2hvdmVyXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBwbG90bHlfdW5ob3ZlciBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfdW5ob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLl9zZW5kX3BvaW50c19jYWxsYmFja19tZXNzYWdlKGRhdGEsIFwicGxvdGx5X3VuaG92ZXJcIik7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHBsb3RseV9zZWxlY3RlZCBldmVudHMgZW1pdHRlZCBieSB0aGUgUGxvdGx5LmpzIGxpYnJhcnlcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZV9wbG90bHlfc2VsZWN0ZWQoZGF0YTogYW55KSB7XG4gICAgdGhpcy5fc2VuZF9wb2ludHNfY2FsbGJhY2tfbWVzc2FnZShkYXRhLCBcInBsb3RseV9zZWxlY3RlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgcGxvdGx5X2Rlc2VsZWN0IGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBQbG90bHkuanMgbGlicmFyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9kZXNlbGVjdChkYXRhOiBhbnkpIHtcbiAgICBkYXRhID0ge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICB9O1xuICAgIHRoaXMuX3NlbmRfcG9pbnRzX2NhbGxiYWNrX21lc3NhZ2UoZGF0YSwgXCJwbG90bHlfZGVzZWxlY3RcIik7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgYW5kIHNlbmQgYSBwb2ludHMgY2FsbGJhY2sgbWVzc2FnZSB0byB0aGUgUHl0aG9uIHNpZGVcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogIGRhdGEgb2JqZWN0IGFzIHByb3ZpZGVkIGJ5IHRoZSBwbG90bHlfY2xpY2ssIHBsb3RseV9ob3ZlcixcbiAgICogIHBsb3RseV91bmhvdmVyLCBvciBwbG90bHlfc2VsZWN0ZWQgZXZlbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gICAqICBOYW1lIG9mIHRoZSB0cmlnZ2VyaW5nIGV2ZW50LiBPbmUgb2YgJ3Bsb3RseV9jbGljaycsXG4gICAqICAncGxvdGx5X2hvdmVyJywgJ3Bsb3RseV91bmhvdmVyJywgb3IgJ3Bsb3RseV9zZWxlY3RlZCdcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZW5kX3BvaW50c19jYWxsYmFja19tZXNzYWdlKGRhdGE6IGFueSwgZXZlbnRfdHlwZTogc3RyaW5nKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyBkYXRhIHRvIHJlcG9ydCB0byB0aGUgUHl0aG9uIHNpZGVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge0pzMlB5UG9pbnRzQ2FsbGJhY2tNc2d9ICovXG4gICAgdmFyIHBvaW50c01zZzogSnMyUHlQb2ludHNDYWxsYmFja01zZyA9IHtcbiAgICAgIGV2ZW50X3R5cGU6IGV2ZW50X3R5cGUsXG4gICAgICBwb2ludHM6IHRoaXMuYnVpbGRQb2ludHNPYmplY3QoZGF0YSksXG4gICAgICBkZXZpY2Vfc3RhdGU6IHRoaXMuYnVpbGRJbnB1dERldmljZVN0YXRlT2JqZWN0KGRhdGEpLFxuICAgICAgc2VsZWN0b3I6IHRoaXMuYnVpbGRTZWxlY3Rvck9iamVjdChkYXRhKSxcbiAgICB9O1xuXG4gICAgaWYgKHBvaW50c01zZ1tcInBvaW50c1wiXSAhPT0gbnVsbCAmJiBwb2ludHNNc2dbXCJwb2ludHNcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5tb2RlbC5zZXQoXCJfanMycHlfcG9pbnRzQ2FsbGJhY2tcIiwgcG9pbnRzTXNnKTtcbiAgICAgIHRoaXMudG91Y2goKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3R1YiBmb3IgZnV0dXJlIGhhbmRsaW5nIG9mIHBsb3RseV9kb3VibGVjbGlja1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlX3Bsb3RseV9kb3VibGVjbGljayhkYXRhOiBhbnkpIHt9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBQbG90bHkuYWRkVHJhY2VzIHJlcXVlc3RcbiAgICovXG4gIGRvX2FkZFRyYWNlcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzQWRkVHJhY2VzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc0FkZFRyYWNlc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2FkZFRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICBQbG90bHkuYWRkVHJhY2VzKHRoaXMuZWwsIG1zZ0RhdGEudHJhY2VfZGF0YSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICMjIyBTZW5kIHRyYWNlIGRlbHRhcyAjIyNcbiAgICAgICAgdGhhdC5fc2VuZFRyYWNlRGVsdGFzKG1zZ0RhdGEudHJhY2VfZWRpdF9pZCk7XG5cbiAgICAgICAgLy8gIyMjIFNlbmQgbGF5b3V0IGRlbHRhICMjI1xuICAgICAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSBtc2dEYXRhLmxheW91dF9lZGl0X2lkO1xuICAgICAgICB0aGF0Ll9zZW5kTGF5b3V0RGVsdGEobGF5b3V0X2VkaXRfaWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBQbG90bHkuZGVsZXRlVHJhY2VzIHJlcXVlc3RcbiAgICovXG4gIGRvX2RlbGV0ZVRyYWNlcygpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzRGVsZXRlVHJhY2VzTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc0RlbGV0ZVRyYWNlc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX2RlbGV0ZVRyYWNlc1wiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgZGVsZXRlX2luZHMgPSBtc2dEYXRhLmRlbGV0ZV9pbmRzO1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgUGxvdGx5LmRlbGV0ZVRyYWNlcyh0aGlzLmVsLCBkZWxldGVfaW5kcykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICMjIyBTZW5kIHRyYWNlIGRlbHRhcyAjIyNcbiAgICAgICAgdmFyIHRyYWNlX2VkaXRfaWQgPSBtc2dEYXRhLnRyYWNlX2VkaXRfaWQ7XG4gICAgICAgIHRoYXQuX3NlbmRUcmFjZURlbHRhcyh0cmFjZV9lZGl0X2lkKTtcblxuICAgICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICAgIHZhciBsYXlvdXRfZWRpdF9pZCA9IG1zZ0RhdGEubGF5b3V0X2VkaXRfaWQ7XG4gICAgICAgIHRoYXQuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5tb3ZlVHJhY2VzIHJlcXVlc3RcbiAgICovXG4gIGRvX21vdmVUcmFjZXMoKSB7XG4gICAgLyoqIEB0eXBlIHtQeTJKc01vdmVUcmFjZXNNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzTW92ZVRyYWNlc01zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX21vdmVUcmFjZXNcIik7XG5cbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgLy8gVW5wYWNrIG1lc3NhZ2VcbiAgICAgIHZhciBjdXJyZW50SW5kcyA9IG1zZ0RhdGEuY3VycmVudF90cmFjZV9pbmRzO1xuICAgICAgdmFyIG5ld0luZHMgPSBtc2dEYXRhLm5ld190cmFjZV9pbmRzO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgbmV3IHRyYWNlIGluZGV4ZXMgYXJlIGFjdHVhbGx5IGRpZmZlcmVudCB0aGFuXG4gICAgICAvLyB0aGUgY3VycmVudCBpbmRleGVzXG4gICAgICB2YXIgaW5kc19lcXVhbCA9IF8uaXNFcXVhbChjdXJyZW50SW5kcywgbmV3SW5kcyk7XG5cbiAgICAgIGlmICghaW5kc19lcXVhbCkge1xuICAgICAgICBQbG90bHkubW92ZVRyYWNlcyh0aGlzLmVsLCBjdXJyZW50SW5kcywgbmV3SW5kcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBQbG90bHkucmVzdHlsZSByZXF1ZXN0XG4gICAqL1xuICBkb19yZXN0eWxlKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNSZXN0eWxlTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1Jlc3R5bGVNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19yZXN0eWxlXCIpO1xuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgcmVzdHlsZURhdGEgPSBtc2dEYXRhLnJlc3R5bGVfZGF0YTtcbiAgICAgIHZhciB0cmFjZUluZGV4ZXMgPSAodGhpcy5tb2RlbCBhcyBGaWd1cmVNb2RlbCkuX25vcm1hbGl6ZV90cmFjZV9pbmRleGVzKFxuICAgICAgICBtc2dEYXRhLnJlc3R5bGVfdHJhY2VzXG4gICAgICApO1xuXG4gICAgICByZXN0eWxlRGF0YVtcIl9kb05vdFJlcG9ydFRvUHlcIl0gPSB0cnVlO1xuICAgICAgUGxvdGx5LnJlc3R5bGUodGhpcy5lbCwgcmVzdHlsZURhdGEsIHRyYWNlSW5kZXhlcyk7XG5cbiAgICAgIC8vICMjIyBTZW5kIHRyYWNlIGRlbHRhcyAjIyNcbiAgICAgIC8vIFdlIGNyZWF0ZSBhbiBhcnJheSBvZiBkZWx0YXMgY29ycmVzcG9uZGluZyB0byB0aGUgcmVzdHlsZWRcbiAgICAgIC8vIHRyYWNlcy5cbiAgICAgIHRoaXMuX3NlbmRUcmFjZURlbHRhcyhtc2dEYXRhLnRyYWNlX2VkaXRfaWQpO1xuXG4gICAgICAvLyAjIyMgU2VuZCBsYXlvdXQgZGVsdGEgIyMjXG4gICAgICB2YXIgbGF5b3V0X2VkaXRfaWQgPSBtc2dEYXRhLmxheW91dF9lZGl0X2lkO1xuICAgICAgdGhpcy5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFBsb3RseS5yZWxheW91dCByZXF1ZXN0XG4gICAqL1xuICBkb19yZWxheW91dCgpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzUmVsYXlvdXRNc2d9ICovXG4gICAgdmFyIG1zZ0RhdGE6IFB5MkpzUmVsYXlvdXRNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19yZWxheW91dFwiKTtcbiAgICBpZiAobXNnRGF0YSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG1zZ0RhdGEuc291cmNlX3ZpZXdfaWQgIT09IHRoaXMudmlld0lEKSB7XG4gICAgICAgIHZhciByZWxheW91dERhdGEgPSBtc2dEYXRhLnJlbGF5b3V0X2RhdGE7XG4gICAgICAgIHJlbGF5b3V0RGF0YVtcIl9kb05vdFJlcG9ydFRvUHlcIl0gPSB0cnVlO1xuICAgICAgICBQbG90bHkucmVsYXlvdXQodGhpcy5lbCwgbXNnRGF0YS5yZWxheW91dF9kYXRhKTtcbiAgICAgIH1cblxuICAgICAgLy8gIyMjIFNlbmQgbGF5b3V0IGRlbHRhICMjI1xuICAgICAgdmFyIGxheW91dF9lZGl0X2lkID0gbXNnRGF0YS5sYXlvdXRfZWRpdF9pZDtcbiAgICAgIHRoaXMuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBQbG90bHkudXBkYXRlIHJlcXVlc3RcbiAgICovXG4gIGRvX3VwZGF0ZSgpIHtcbiAgICAvKiogQHR5cGUge1B5MkpzVXBkYXRlTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc1VwZGF0ZU1zZyA9IHRoaXMubW9kZWwuZ2V0KFwiX3B5MmpzX3VwZGF0ZVwiKTtcblxuICAgIGlmIChtc2dEYXRhICE9PSBudWxsKSB7XG4gICAgICB2YXIgc3R5bGUgPSBtc2dEYXRhLnN0eWxlX2RhdGEgfHwge307XG4gICAgICB2YXIgbGF5b3V0ID0gbXNnRGF0YS5sYXlvdXRfZGF0YSB8fCB7fTtcbiAgICAgIHZhciB0cmFjZUluZGV4ZXMgPSAodGhpcy5tb2RlbCBhcyBGaWd1cmVNb2RlbCkuX25vcm1hbGl6ZV90cmFjZV9pbmRleGVzKFxuICAgICAgICBtc2dEYXRhLnN0eWxlX3RyYWNlc1xuICAgICAgKTtcblxuICAgICAgc3R5bGVbXCJfZG9Ob3RSZXBvcnRUb1B5XCJdID0gdHJ1ZTtcbiAgICAgIFBsb3RseS51cGRhdGUodGhpcy5lbCwgc3R5bGUsIGxheW91dCwgdHJhY2VJbmRleGVzKTtcblxuICAgICAgLy8gIyMjIFNlbmQgdHJhY2UgZGVsdGFzICMjI1xuICAgICAgLy8gV2UgY3JlYXRlIGFuIGFycmF5IG9mIGRlbHRhcyBjb3JyZXNwb25kaW5nIHRvIHRoZSB1cGRhdGVkXG4gICAgICAvLyB0cmFjZXMuXG4gICAgICB0aGlzLl9zZW5kVHJhY2VEZWx0YXMobXNnRGF0YS50cmFjZV9lZGl0X2lkKTtcblxuICAgICAgLy8gIyMjIFNlbmQgbGF5b3V0IGRlbHRhICMjI1xuICAgICAgdmFyIGxheW91dF9lZGl0X2lkID0gbXNnRGF0YS5sYXlvdXRfZWRpdF9pZDtcbiAgICAgIHRoaXMuX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBQbG90bHkuYW5pbWF0ZSByZXF1ZXN0XG4gICAqL1xuICBkb19hbmltYXRlKCkge1xuICAgIC8qKiBAdHlwZSB7UHkySnNBbmltYXRlTXNnfSAqL1xuICAgIHZhciBtc2dEYXRhOiBQeTJKc0FuaW1hdGVNc2cgPSB0aGlzLm1vZGVsLmdldChcIl9weTJqc19hbmltYXRlXCIpO1xuXG4gICAgaWYgKG1zZ0RhdGEgIT09IG51bGwpIHtcbiAgICAgIC8vIFVucGFjayBwYXJhbXNcbiAgICAgIC8vIHZhciBhbmltYXRpb25EYXRhID0gbXNnRGF0YVswXTtcbiAgICAgIHZhciBhbmltYXRpb25PcHRzID0gbXNnRGF0YS5hbmltYXRpb25fb3B0cztcblxuICAgICAgdmFyIHN0eWxlcyA9IG1zZ0RhdGEuc3R5bGVfZGF0YTtcbiAgICAgIHZhciBsYXlvdXQgPSBtc2dEYXRhLmxheW91dF9kYXRhO1xuICAgICAgdmFyIHRyYWNlSW5kZXhlcyA9ICh0aGlzLm1vZGVsIGFzIEZpZ3VyZU1vZGVsKS5fbm9ybWFsaXplX3RyYWNlX2luZGV4ZXMoXG4gICAgICAgIG1zZ0RhdGEuc3R5bGVfdHJhY2VzXG4gICAgICApO1xuXG4gICAgICB2YXIgYW5pbWF0aW9uRGF0YTogYW55ID0ge1xuICAgICAgICBkYXRhOiBzdHlsZXMsXG4gICAgICAgIGxheW91dDogbGF5b3V0LFxuICAgICAgICB0cmFjZXM6IHRyYWNlSW5kZXhlcyxcbiAgICAgIH07XG5cbiAgICAgIGFuaW1hdGlvbkRhdGFbXCJfZG9Ob3RSZXBvcnRUb1B5XCJdID0gdHJ1ZTtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgUGxvdGx5LmFuaW1hdGUodGhpcy5lbCwgYW5pbWF0aW9uRGF0YSwgYW5pbWF0aW9uT3B0cykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICMjIyBTZW5kIHRyYWNlIGRlbHRhcyAjIyNcbiAgICAgICAgLy8gV2UgY3JlYXRlIGFuIGFycmF5IG9mIGRlbHRhcyBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICAgICAgICAvLyBhbmltYXRlZCB0cmFjZXMuXG4gICAgICAgIHRoYXQuX3NlbmRUcmFjZURlbHRhcyhtc2dEYXRhLnRyYWNlX2VkaXRfaWQpO1xuXG4gICAgICAgIC8vICMjIyBTZW5kIGxheW91dCBkZWx0YSAjIyNcbiAgICAgICAgdmFyIGxheW91dF9lZGl0X2lkID0gbXNnRGF0YS5sYXlvdXRfZWRpdF9pZDtcbiAgICAgICAgdGhhdC5fc2VuZExheW91dERlbHRhKGxheW91dF9lZGl0X2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgbGF5b3V0IGRlbHRhIG9iamVjdCBhbmQgc2VuZCBsYXlvdXREZWx0YSBtZXNzYWdlIHRvIHRoZVxuICAgKiBQeXRob24gc2lkZVxuICAgKlxuICAgKiBAcGFyYW0gbGF5b3V0X2VkaXRfaWRcbiAgICogIEVkaXQgSUQgb2YgbWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY3JlYXRpb24gb2YgdGhlIGxheW91dCBkZWx0YVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NlbmRMYXlvdXREZWx0YShsYXlvdXRfZWRpdF9pZDogYW55KSB7XG4gICAgLy8gIyMjIEhhbmRsZSBsYXlvdXQgZGVsdGEgIyMjXG4gICAgdmFyIGxheW91dF9kZWx0YSA9IGNyZWF0ZURlbHRhT2JqZWN0KFxuICAgICAgdGhpcy5nZXRGdWxsTGF5b3V0KCksXG4gICAgICB0aGlzLm1vZGVsLmdldChcIl9sYXlvdXRcIilcbiAgICApO1xuXG4gICAgLyoqIEB0eXBle0pzMlB5TGF5b3V0RGVsdGFNc2d9ICovXG4gICAgdmFyIGxheW91dERlbHRhTXNnOiBKczJQeUxheW91dERlbHRhTXNnID0ge1xuICAgICAgbGF5b3V0X2RlbHRhOiBsYXlvdXRfZGVsdGEsXG4gICAgICBsYXlvdXRfZWRpdF9pZDogbGF5b3V0X2VkaXRfaWQsXG4gICAgfTtcblxuICAgIHRoaXMubW9kZWwuc2V0KFwiX2pzMnB5X2xheW91dERlbHRhXCIsIGxheW91dERlbHRhTXNnKTtcbiAgICB0aGlzLnRvdWNoKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IHRyYWNlIGRlbHRhcyBhcnJheSBmb3IgdGhlIHJlcXVlc3RlZCB0cmFjZSBpbmRleGVzIGFuZFxuICAgKiBzZW5kIHRyYWNlRGVsdGFzIG1lc3NhZ2UgdG8gdGhlIFB5dGhvbiBzaWRlXG4gICAqICBBcnJheSBvZiBpbmRleGVzIG9mIHRyYWNlcyBmb3Igd2hpY2ggdG8gY29tcHV0ZSBkZWx0YXNcbiAgICogQHBhcmFtIHRyYWNlX2VkaXRfaWRcbiAgICogIEVkaXQgSUQgb2YgbWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY3JlYXRpb24gb2YgdHJhY2UgZGVsdGFzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2VuZFRyYWNlRGVsdGFzKHRyYWNlX2VkaXRfaWQ6IGFueSkge1xuICAgIHZhciB0cmFjZV9kYXRhID0gdGhpcy5tb2RlbC5nZXQoXCJfZGF0YVwiKTtcbiAgICB2YXIgdHJhY2VJbmRleGVzID0gXy5yYW5nZSh0cmFjZV9kYXRhLmxlbmd0aCk7XG4gICAgdmFyIHRyYWNlX2RlbHRhcyA9IG5ldyBBcnJheSh0cmFjZUluZGV4ZXMubGVuZ3RoKTtcblxuICAgIHZhciBmdWxsRGF0YSA9IHRoaXMuZ2V0RnVsbERhdGEoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYWNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRyYWNlSW5kID0gdHJhY2VJbmRleGVzW2ldO1xuICAgICAgdHJhY2VfZGVsdGFzW2ldID0gY3JlYXRlRGVsdGFPYmplY3QoXG4gICAgICAgIGZ1bGxEYXRhW3RyYWNlSW5kXSxcbiAgICAgICAgdHJhY2VfZGF0YVt0cmFjZUluZF1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBle0pzMlB5VHJhY2VEZWx0YXNNc2d9ICovXG4gICAgdmFyIHRyYWNlRGVsdGFzTXNnOiBKczJQeVRyYWNlRGVsdGFzTXNnID0ge1xuICAgICAgdHJhY2VfZGVsdGFzOiB0cmFjZV9kZWx0YXMsXG4gICAgICB0cmFjZV9lZGl0X2lkOiB0cmFjZV9lZGl0X2lkLFxuICAgIH07XG5cbiAgICB0aGlzLm1vZGVsLnNldChcIl9qczJweV90cmFjZURlbHRhc1wiLCB0cmFjZURlbHRhc01zZyk7XG4gICAgdGhpcy50b3VjaCgpO1xuICB9XG59XG5cbi8vIFNlcmlhbGl6YXRpb25cbi8qKlxuICogQ3JlYXRlIGEgbWFwcGluZyBmcm9tIG51bXB5IGR0eXBlIHN0cmluZ3MgdG8gY29ycmVzcG9uZGluZyB0eXBlZCBhcnJheVxuICogY29uc3RydWN0b3JzXG4gKi9cbmNvbnN0IG51bXB5X2R0eXBlX3RvX3R5cGVkYXJyYXlfdHlwZSA9IHtcbiAgaW50ODogSW50OEFycmF5LFxuICBpbnQxNjogSW50MTZBcnJheSxcbiAgaW50MzI6IEludDMyQXJyYXksXG4gIHVpbnQ4OiBVaW50OEFycmF5LFxuICB1aW50MTY6IFVpbnQxNkFycmF5LFxuICB1aW50MzI6IFVpbnQzMkFycmF5LFxuICBmbG9hdDMyOiBGbG9hdDMyQXJyYXksXG4gIGZsb2F0NjQ6IEZsb2F0NjRBcnJheSxcbn07XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVR5cGVkQXJyYXkodjogQXJyYXlDb25zdHJ1Y3Rvcikge1xuICB2YXIgbnVtcHlUeXBlO1xuICBpZiAodiBpbnN0YW5jZW9mIEludDhBcnJheSkge1xuICAgIG51bXB5VHlwZSA9IFwiaW50OFwiO1xuICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBJbnQxNkFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJpbnQxNlwiO1xuICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBJbnQzMkFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJpbnQzMlwiO1xuICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJ1aW50OFwiO1xuICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkge1xuICAgIG51bXB5VHlwZSA9IFwidWludDE2XCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJ1aW50MzJcIjtcbiAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG4gICAgbnVtcHlUeXBlID0gXCJmbG9hdDMyXCI7XG4gIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkge1xuICAgIG51bXB5VHlwZSA9IFwiZmxvYXQ2NFwiO1xuICB9IGVsc2Uge1xuICAgIC8vIERvbid0IHVuZGVyc3RhbmQgaXQsIHJldHVybiBhcyBpc1xuICAgIHJldHVybiB2O1xuICB9XG4gIHZhciByZXMgPSB7XG4gICAgZHR5cGU6IG51bXB5VHlwZSxcbiAgICBzaGFwZTogW3YubGVuZ3RoXSxcbiAgICB2YWx1ZTogdi5idWZmZXIsXG4gIH07XG4gIHJldHVybiByZXM7XG59XG5cbi8qKlxuICogaXB5d2lkZ2V0IEphdmFTY3JpcHQgLT4gUHl0aG9uIHNlcmlhbGl6ZXJcbiAqL1xuZnVuY3Rpb24ganMycHlfc2VyaWFsaXplcih2OiBhbnksIHdpZGdldE1hbmFnZXI/OiBhbnkpIHtcbiAgdmFyIHJlczogYW55O1xuXG4gIGlmIChfLmlzVHlwZWRBcnJheSh2KSkge1xuICAgIHJlcyA9IHNlcmlhbGl6ZVR5cGVkQXJyYXkodik7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBlbGVtZW50cyByZWN1cnNpdmVseVxuICAgIHJlcyA9IG5ldyBBcnJheSh2Lmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXNbaV0gPSBqczJweV9zZXJpYWxpemVyKHZbaV0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChfLmlzUGxhaW5PYmplY3QodikpIHtcbiAgICAvLyBTZXJpYWxpemUgb2JqZWN0IHByb3BlcnRpZXMgcmVjdXJzaXZlbHlcbiAgICByZXMgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHYpIHtcbiAgICAgIGlmICh2Lmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgIHJlc1twXSA9IGpzMnB5X3NlcmlhbGl6ZXIodltwXSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIFRyYW5zbGF0ZSB1bmRlZmluZWQgaW50byAnX3VuZGVmaW5lZF8nIHNlbnRpbmFsIHN0cmluZy4gVGhlXG4gICAgLy8gUHl0aG9uIF9qc190b19weSBkZXNlcmlhbGl6ZXIgd2lsbCBjb252ZXJ0IHRoaXMgaW50byBhblxuICAgIC8vIFVuZGVmaW5lZCBvYmplY3RcbiAgICByZXMgPSBcIl91bmRlZmluZWRfXCI7XG4gIH0gZWxzZSB7XG4gICAgLy8gUHJpbWl0aXZlIHZhbHVlIHRvIHRyYW5zZmVyIGRpcmVjdGx5XG4gICAgcmVzID0gdjtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIGlweXdpZGdldCBQeXRob24gLT4gSmF2YXNjcmlwdCBkZXNlcmlhbGl6ZXJcbiAqL1xuZnVuY3Rpb24gcHkyanNfZGVzZXJpYWxpemVyKHY6IGFueSwgd2lkZ2V0TWFuYWdlcj86IGFueSkge1xuICB2YXIgcmVzOiBhbnk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAvLyBEZXNlcmlhbGl6ZSBhcnJheSBlbGVtZW50cyByZWN1cnNpdmVseVxuICAgIHJlcyA9IG5ldyBBcnJheSh2Lmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXNbaV0gPSBweTJqc19kZXNlcmlhbGl6ZXIodltpXSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKF8uaXNQbGFpbk9iamVjdCh2KSkge1xuICAgIGlmIChcbiAgICAgIChfLmhhcyh2LCBcInZhbHVlXCIpIHx8IF8uaGFzKHYsIFwiYnVmZmVyXCIpKSAmJlxuICAgICAgXy5oYXModiwgXCJkdHlwZVwiKSAmJlxuICAgICAgXy5oYXModiwgXCJzaGFwZVwiKVxuICAgICkge1xuICAgICAgLy8gRGVzZXJpYWxpemUgc3BlY2lhbCBidWZmZXIvZHR5cGUvc2hhcGUgb2JqZWN0cyBpbnRvIHR5cGVkIGFycmF5c1xuICAgICAgLy8gVGhlc2Ugb2JqZWN0cyBjb3JyZXNwb25kIHRvIG51bXB5IGFycmF5cyBvbiB0aGUgUHl0aG9uIHNpZGVcbiAgICAgIC8vXG4gICAgICAvLyBOb3RlIHBsb3RseS5weTw9My4xLjEgY2FsbGVkIHRoZSBidWZmZXIgb2JqZWN0IGBidWZmZXJgXG4gICAgICAvLyBUaGlzIHdhcyByZW5hbWVkIGB2YWx1ZWAgaW4gMy4yIHRvIHdvcmsgYXJvdW5kIGEgbmFtaW5nIGNvbmZsaWN0XG4gICAgICAvLyB3aGVuIHNhdmluZyB3aWRnZXQgc3RhdGUgdG8gYSBub3RlYm9vay5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHZhciB0eXBlZGFycmF5X3R5cGUgPSBudW1weV9kdHlwZV90b190eXBlZGFycmF5X3R5cGVbdi5kdHlwZV07XG4gICAgICB2YXIgYnVmZmVyID0gXy5oYXModiwgXCJ2YWx1ZVwiKSA/IHYudmFsdWUuYnVmZmVyIDogKHYgYXMgYW55KS5idWZmZXIuYnVmZmVyO1xuICAgICAgcmVzID0gbmV3IHR5cGVkYXJyYXlfdHlwZShidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZXNlcmlhbGl6ZSBvYmplY3QgcHJvcGVydGllcyByZWN1cnNpdmVseVxuICAgICAgcmVzID0ge307XG4gICAgICBmb3IgKHZhciBwIGluICh2IGFzIGFueSkpIHtcbiAgICAgICAgaWYgKCh2IGFzIGFueSkuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICByZXNbcF0gPSBweTJqc19kZXNlcmlhbGl6ZXIodltwXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodiA9PT0gXCJfdW5kZWZpbmVkX1wiKSB7XG4gICAgLy8gQ29udmVydCB0aGUgX3VuZGVmaW5lZF8gc2VudGluYWwgaW50byB1bmRlZmluZWRcbiAgICByZXMgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWNjZXB0IHByaW1pdGl2ZSB2YWx1ZSBkaXJlY3RseVxuICAgIHJlcyA9IHY7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgaW5wdXQgdmFsdWUgaXMgYSB0eXBlZCBhcnJheVxuICogQHBhcmFtIHBvdGVudGlhbFR5cGVkQXJyYXlcbiAqICBWYWx1ZSB0byBleGFtaW5lXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuLy8gZnVuY3Rpb24gaXNUeXBlZEFycmF5KHBvdGVudGlhbFR5cGVkQXJyYXk6IGFueSk6IGJvb2xlYW4ge1xuLy8gICByZXR1cm4gKFxuLy8gICAgIEFycmF5QnVmZmVyLmlzVmlldyhwb3RlbnRpYWxUeXBlZEFycmF5KSAmJlxuLy8gICAgICEocG90ZW50aWFsVHlwZWRBcnJheSBpbnN0YW5jZW9mIERhdGFWaWV3KVxuLy8gICApO1xuLy8gfVxuXG4vKipcbiAqIEN1c3RvbWl6ZXIgZm9yIHVzZSB3aXRoIGxvZGFzaCdzIG1lcmdlV2l0aCBmdW5jdGlvblxuICpcbiAqIFRoZSBjdXN0b21pemVyIGVuc3VyZXMgdGhhdCB0eXBlZCBhcnJheXMgYXJlIG5vdCBjb252ZXJ0ZWQgaW50byBzdGFuZGFyZFxuICogYXJyYXlzIGR1cmluZyB0aGUgcmVjdXJzaXZlIG1lcmdlXG4gKlxuICogU2VlOiBodHRwczovL2xvZGFzaC5jb20vZG9jcy9sYXRlc3QjbWVyZ2VXaXRoXG4gKi9cbi8vIGZ1bmN0aW9uIGZ1bGxNZXJnZUN1c3RvbWl6ZXIob2JqVmFsdWU6IGFueSwgc3JjVmFsdWU6IGFueSwga2V5OiBzdHJpbmcpIHtcbi8vICAgaWYgKGtleVswXSA9PT0gXCJfXCIpIHtcbi8vICAgICAvLyBEb24ndCByZWN1cnNlIGludG8gcHJpdmF0ZSBwcm9wZXJ0aWVzXG4vLyAgICAgcmV0dXJuIG51bGw7XG4vLyAgIH0gZWxzZSBpZiAoaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkge1xuLy8gICAgIC8vIFJldHVybiB0eXBlZCBhcnJheXMgZGlyZWN0bHksIGRvbid0IHJlY3Vyc2UgaW5zaWRlXG4vLyAgICAgcmV0dXJuIHNyY1ZhbHVlO1xuLy8gICB9XG4vLyB9XG5cbi8qKlxuICogUmVmb3JtIGEgUGxvdGx5LnJlbGF5b3V0IGxpa2Ugb3BlcmF0aW9uIG9uIGFuIGlucHV0IG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRPYmpcbiAqICBUaGUgb2JqZWN0IHRoYXQgdGhlIHJlbGF5b3V0IG9wZXJhdGlvbiBzaG91bGQgYmUgYXBwbGllZCB0b1xuICogQHBhcmFtIHtPYmplY3R9IHJlbGF5b3V0RGF0YVxuICogIEFuIHJlbGF5b3V0IG9iamVjdCBhcyBhY2NlcHRlZCBieSBQbG90bHkucmVsYXlvdXRcbiAqXG4gKiAgRXhhbXBsZXM6XG4gKiAgICAgIHZhciBkID0ge2ZvbyB7YmFyIFs1LCAxMF19fTtcbiAqICAgICAgcGVyZm9ybVJlbGF5b3V0TGlrZShkLCB7J2Zvby5iYXInOiBbMCwgMV19KTtcbiAqICAgICAgZCAtPiB7Zm9vOiB7YmFyOiBbMCwgMV19fVxuICpcbiAqICAgICAgdmFyIGQgPSB7Zm9vIHtiYXIgWzUsIDEwXX19O1xuICogICAgICBwZXJmb3JtUmVsYXlvdXRMaWtlKGQsIHsnYmF6JzogMzR9KTtcbiAqICAgICAgZCAtPiB7Zm9vOiB7YmFyOiBbNSwgMTBdfSwgYmF6OiAzNH1cbiAqXG4gKiAgICAgIHZhciBkID0ge2Zvbzoge2JhcjogWzUsIDEwXX07XG4gKiAgICAgIHBlcmZvcm1SZWxheW91dExpa2UoZCwgeydmb28uYmF6WzFdJzogMTd9KTtcbiAqICAgICAgZCAtPiB7Zm9vOiB7YmFyOiBbNSwgMTddfX1cbiAqXG4gKi9cbmZ1bmN0aW9uIHBlcmZvcm1SZWxheW91dExpa2UocGFyZW50T2JqOiBhbnksIHJlbGF5b3V0RGF0YTogYW55KSB7XG4gIC8vIFBlcmZvcm0gYSByZWxheW91dCBzdHlsZSBvcGVyYXRpb24gb24gYSBnaXZlbiBwYXJlbnQgb2JqZWN0XG4gIGZvciAodmFyIHJhd0tleSBpbiByZWxheW91dERhdGEpIHtcbiAgICBpZiAoIXJlbGF5b3V0RGF0YS5oYXNPd25Qcm9wZXJ0eShyYXdLZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IHZhbHVlIGZvciB0aGlzIGtleVxuICAgIHZhciByZWxheW91dFZhbCA9IHJlbGF5b3V0RGF0YVtyYXdLZXldO1xuXG4gICAgLy8gU2V0IHByb3BlcnR5IHZhbHVlXG4gICAgaWYgKHJlbGF5b3V0VmFsID09PSBudWxsKSB7XG4gICAgICBfLnVuc2V0KHBhcmVudE9iaiwgcmF3S2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5zZXQocGFyZW50T2JqLCByYXdLZXksIHJlbGF5b3V0VmFsKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIGEgUGxvdGx5LnJlc3R5bGUgbGlrZSBvcGVyYXRpb24gb24gYW4gaW5wdXQgb2JqZWN0IGFycmF5XG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gcGFyZW50QXJyYXlcbiAqICBUaGUgb2JqZWN0IHRoYXQgdGhlIHJlc3R5bGUgb3BlcmF0aW9uIHNob3VsZCBiZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzdHlsZURhdGFcbiAqICBBIHJlc3R5bGUgb2JqZWN0IGFzIGFjY2VwdGVkIGJ5IFBsb3RseS5yZXN0eWxlXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSByZXN0eWxlVHJhY2VzXG4gKiAgQXJyYXkgb2YgaW5kZXhlcyBvZiB0aGUgdHJhY2VzIHRoYXQgdGhlIHJlc3l0bGUgb3BlcmF0aW9uIGFwcGxpZXMgdG9cbiAqXG4gKiAgRXhhbXBsZXM6XG4gKiAgICAgIHZhciBkID0gW3tmb286IHtiYXI6IDF9fSwge30sIHt9XVxuICogICAgICBwZXJmb3JtUmVzdHlsZUxpa2UoZCwgeydmb28uYmFyJzogMn0sIFswXSlcbiAqICAgICAgZCAtPiBbe2Zvbzoge2JhcjogMn19LCB7fSwge31dXG4gKlxuICogICAgICB2YXIgZCA9IFt7Zm9vOiB7YmFyOiAxfX0sIHt9LCB7fV1cbiAqICAgICAgcGVyZm9ybVJlc3R5bGVMaWtlKGQsIHsnZm9vLmJhcic6IDJ9LCBbMCwgMSwgMl0pXG4gKiAgICAgIGQgLT4gW3tmb286IHtiYXI6IDJ9fSwge2Zvbzoge2JhcjogMn19LCB7Zm9vOiB7YmFyOiAyfX1dXG4gKlxuICogICAgICB2YXIgZCA9IFt7Zm9vOiB7YmFyOiAxfX0sIHt9LCB7fV1cbiAqICAgICAgcGVyZm9ybVJlc3R5bGVMaWtlKGQsIHsnZm9vLmJhcic6IFsyLCAzLCA0XX0sIFswLCAxLCAyXSlcbiAqICAgICAgZCAtPiBbe2Zvbzoge2JhcjogMn19LCB7Zm9vOiB7YmFyOiAzfX0sIHtmb286IHtiYXI6IDR9fV1cbiAqXG4gKi9cbmZ1bmN0aW9uIHBlcmZvcm1SZXN0eWxlTGlrZShcbiAgcGFyZW50QXJyYXk6IGFueVtdLFxuICByZXN0eWxlRGF0YTogYW55LFxuICByZXN0eWxlVHJhY2VzOiBudW1iZXJbXVxuKSB7XG4gIC8vIExvb3Agb3ZlciB0aGUgcHJvcGVydGllcyBvZiByZXN0eWxlRGF0YVxuICBmb3IgKHZhciByYXdLZXkgaW4gcmVzdHlsZURhdGEpIHtcbiAgICBpZiAoIXJlc3R5bGVEYXRhLmhhc093blByb3BlcnR5KHJhd0tleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgdmFsdWUgZm9yIHByb3BlcnR5IGFuZCBub3JtYWxpemUgaW50byBhIHZhbHVlIGxpc3RcbiAgICB2YXIgdmFsQXJyYXkgPSByZXN0eWxlRGF0YVtyYXdLZXldO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWxBcnJheSkpIHtcbiAgICAgIHZhbEFycmF5ID0gW3ZhbEFycmF5XTtcbiAgICB9XG5cbiAgICAvLyBMb29wIG92ZXIgdGhlIGluZGV4ZXMgb2YgdGhlIHRyYWNlcyBiZWluZyByZXN0eWxlZFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdHlsZVRyYWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gR2V0IHRyYWNlIG9iamVjdFxuICAgICAgdmFyIHRyYWNlSW5kID0gcmVzdHlsZVRyYWNlc1tpXTtcbiAgICAgIHZhciB0cmFjZSA9IHBhcmVudEFycmF5W3RyYWNlSW5kXTtcblxuICAgICAgLy8gRXh0cmFjdCB2YWx1ZSBmb3IgdGhpcyB0cmFjZVxuICAgICAgdmFyIHNpbmdsZVZhbCA9IHZhbEFycmF5W2kgJSB2YWxBcnJheS5sZW5ndGhdO1xuXG4gICAgICAvLyBTZXQgcHJvcGVydHkgdmFsdWVcbiAgICAgIGlmIChzaW5nbGVWYWwgPT09IG51bGwpIHtcbiAgICAgICAgXy51bnNldCh0cmFjZSwgcmF3S2V5KTtcbiAgICAgIH0gZWxzZSBpZiAoc2luZ2xlVmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgXy5zZXQodHJhY2UsIHJhd0tleSwgc2luZ2xlVmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIGEgUGxvdGx5Lm1vdmVUcmFjZXMgbGlrZSBvcGVyYXRpb24gb24gYW4gaW5wdXQgb2JqZWN0IGFycmF5XG4gKiBAcGFyYW0gcGFyZW50QXJyYXlcbiAqICBUaGUgb2JqZWN0IHRoYXQgdGhlIG1vdmVUcmFjZXMgb3BlcmF0aW9uIHNob3VsZCBiZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gY3VycmVudEluZHNcbiAqICBBcnJheSBvZiB0aGUgY3VycmVudCBpbmRleGVzIG9mIHRyYWNlcyB0byBiZSBtb3ZlZFxuICogQHBhcmFtIG5ld0luZHNcbiAqICBBcnJheSBvZiB0aGUgbmV3IGluZGV4ZXMgdGhhdCB0cmFjZXMgc2VsZWN0ZWQgYnkgY3VycmVudEluZHMgc2hvdWxkIGJlXG4gKiAgbW92ZWQgdG8uXG4gKlxuICogIEV4YW1wbGVzOlxuICogICAgICB2YXIgZCA9IFt7Zm9vOiAwfSwge2ZvbzogMX0sIHtmb286IDJ9XVxuICogICAgICBwZXJmb3JtTW92ZVRyYWNlc0xpa2UoZCwgWzAsIDFdLCBbMiwgMF0pXG4gKiAgICAgIGQgLT4gW3tmb286IDF9LCB7Zm9vOiAyfSwge2ZvbzogMH1dXG4gKlxuICogICAgICB2YXIgZCA9IFt7Zm9vOiAwfSwge2ZvbzogMX0sIHtmb286IDJ9XVxuICogICAgICBwZXJmb3JtTW92ZVRyYWNlc0xpa2UoZCwgWzAsIDJdLCBbMSwgMl0pXG4gKiAgICAgIGQgLT4gW3tmb286IDF9LCB7Zm9vOiAwfSwge2ZvbzogMn1dXG4gKi9cbmZ1bmN0aW9uIHBlcmZvcm1Nb3ZlVHJhY2VzTGlrZShcbiAgcGFyZW50QXJyYXk6IGFueVtdLFxuICBjdXJyZW50SW5kczogbnVtYmVyW10sXG4gIG5ld0luZHM6IG51bWJlcltdXG4pIHtcbiAgLy8gIyMjIFJlbW92ZSBieSBjdXJyZW50SW5kcyBpbiByZXZlcnNlIG9yZGVyICMjI1xuICB2YXIgbW92aW5nVHJhY2VzRGF0YTogYW55W10gPSBbXTtcbiAgZm9yICh2YXIgY2kgPSBjdXJyZW50SW5kcy5sZW5ndGggLSAxOyBjaSA+PSAwOyBjaS0tKSB7XG4gICAgLy8gSW5zZXJ0IG1vdmluZyBwYXJlbnRBcnJheSBhdCBiZWdpbm5pbmcgb2YgdGhlIGxpc3RcbiAgICBtb3ZpbmdUcmFjZXNEYXRhLnNwbGljZSgwLCAwLCBwYXJlbnRBcnJheVtjdXJyZW50SW5kc1tjaV1dKTtcbiAgICBwYXJlbnRBcnJheS5zcGxpY2UoY3VycmVudEluZHNbY2ldLCAxKTtcbiAgfVxuXG4gIC8vICMjIyBTb3J0IG5ld0luZHMgYW5kIG1vdmluZ1RyYWNlc0RhdGEgYnkgbmV3SW5kcyAjIyNcbiAgdmFyIG5ld0luZGV4U29ydGVkQXJyYXlzID0gXyhuZXdJbmRzKVxuICAgIC56aXAobW92aW5nVHJhY2VzRGF0YSlcbiAgICAuc29ydEJ5KDApXG4gICAgLnVuemlwKClcbiAgICAudmFsdWUoKTtcblxuICBuZXdJbmRzID0gbmV3SW5kZXhTb3J0ZWRBcnJheXNbMF07XG4gIG1vdmluZ1RyYWNlc0RhdGEgPSBuZXdJbmRleFNvcnRlZEFycmF5c1sxXTtcblxuICAvLyAjIyMgSW5zZXJ0IGJ5IG5ld0luZHMgaW4gZm9yd2FyZCBvcmRlciAjIyNcbiAgZm9yICh2YXIgbmkgPSAwOyBuaSA8IG5ld0luZHMubGVuZ3RoOyBuaSsrKSB7XG4gICAgcGFyZW50QXJyYXkuc3BsaWNlKG5ld0luZHNbbmldLCAwLCBtb3ZpbmdUcmFjZXNEYXRhW25pXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbmVzdGVkIHByb3BlcnRpZXMgZnJvbSBhIHBhcmVudCBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRPYmpcbiAqICBQYXJlbnQgb2JqZWN0IGZyb20gd2hpY2ggcHJvcGVydGllcyBvciBuZXN0ZWQgcHJvcGVydGllcyBzaG91bGQgYmUgcmVtb3ZlZFxuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPE51bWJlcnxTdHJpbmc+Pn0ga2V5UGF0aHNcbiAqICBBcnJheSBvZiBrZXkgcGF0aHMgZm9yIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZC4gRWFjaCBrZXkgcGF0aFxuICogIGlzIGFuIGFycmF5IG9mIHByb3BlcnRpZXMgbmFtZXMgb3IgYXJyYXkgaW5kZXhlcyB0aGF0IHJlZmVyZW5jZSBhXG4gKiAgcHJvcGVydHkgdG8gYmUgcmVtb3ZlZFxuICpcbiAqICBFeGFtcGxlczpcbiAqICAgICAgdmFyIGQgPSB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XSwgYmF6OiAzMn1cbiAqICAgICAgcGVyZm9ybVJlbW92ZVByb3BzKGQsIFsnYmF6J10pXG4gKiAgICAgIGQgLT4ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV19XG4gKlxuICogICAgICB2YXIgZCA9IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dLCBiYXo6IDMyfVxuICogICAgICBwZXJmb3JtUmVtb3ZlUHJvcHMoZCwgWydmb29bMV0uYmFyJywgJ2JheiddKVxuICogICAgICBkIC0+IHtmb286IFt7YmFyOiAwfSwge31dfVxuICpcbiAqL1xuZnVuY3Rpb24gcGVyZm9ybVJlbW92ZVByb3BzKFxuICBwYXJlbnRPYmo6IG9iamVjdCxcbiAga2V5UGF0aHM6IEFycmF5PEFycmF5PG51bWJlciB8IHN0cmluZz4+XG4pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlQYXRocy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXlQYXRoID0ga2V5UGF0aHNbaV07XG4gICAgXy51bnNldChwYXJlbnRPYmosIGtleVBhdGgpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCBwcm9wZXJ0aWVzIGluIGZ1bGxPYmogdGhhdCBhcmUgbm90XG4gKiBpZGVudGljYWwgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBpbiByZW1vdmVPYmpcbiAqXG4gKiBQcm9wZXJ0aWVzIG9mIGZ1bGxPYmogYW5kIHJlbW92ZU9iaiBtYXkgYmUgb2JqZWN0cyBvciBhcnJheXMgb2Ygb2JqZWN0c1xuICpcbiAqIFJldHVybmVkIG9iamVjdCBpcyBhIGRlZXAgY2xvbmUgb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGlucHV0IG9iamVjdHNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZnVsbE9ialxuICogQHBhcmFtIHtPYmplY3R9IHJlbW92ZU9ialxuICpcbiAqICBFeGFtcGxlczpcbiAqICAgICAgdmFyIGZ1bGxEID0ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV0sIGJhejogMzJ9XG4gKiAgICAgIHZhciByZW1vdmVEID0ge2JhejogMzJ9XG4gKiAgICAgIGNyZWF0ZURlbHRhT2JqZWN0KGZ1bGxELCByZW1vdmVEKVxuICogICAgICAgICAgLT4ge2ZvbzogW3tiYXI6IDB9LCB7YmFyOiAxfV19XG4gKlxuICogICAgICB2YXIgZnVsbEQgPSB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XSwgYmF6OiAzMn1cbiAqICAgICAgdmFyIHJlbW92ZUQgPSB7YmF6OiA0NX1cbiAqICAgICAgY3JlYXRlRGVsdGFPYmplY3QoZnVsbEQsIHJlbW92ZUQpXG4gKiAgICAgICAgICAtPiB7Zm9vOiBbe2JhcjogMH0sIHtiYXI6IDF9XSwgYmF6OiAzMn1cbiAqXG4gKiAgICAgIHZhciBmdWxsRCA9IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dLCBiYXo6IDMyfVxuICogICAgICB2YXIgcmVtb3ZlRCA9IHtmb286IFt7YmFyOiAwfSwge2JhcjogMX1dfVxuICogICAgICBjcmVhdGVEZWx0YU9iamVjdChmdWxsRCwgcmVtb3ZlRClcbiAqICAgICAgICAgIC0+IHtiYXo6IDMyfVxuICpcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGVsdGFPYmplY3QoZnVsbE9iajogYW55LCByZW1vdmVPYmo6IGFueSkge1xuICAvLyBJbml0aWFsaXplIHJlc3VsdCBhcyBvYmplY3Qgb3IgYXJyYXlcbiAgdmFyIHJlczogYW55O1xuICBpZiAoQXJyYXkuaXNBcnJheShmdWxsT2JqKSkge1xuICAgIHJlcyA9IG5ldyBBcnJheShmdWxsT2JqLmxlbmd0aCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzID0ge307XG4gIH1cblxuICAvLyBJbml0aWFsaXplIHJlbW92ZU9iaiB0byBlbXB0eSBvYmplY3QgaWYgbm90IHNwZWNpZmllZFxuICBpZiAocmVtb3ZlT2JqID09PSBudWxsIHx8IHJlbW92ZU9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmVtb3ZlT2JqID0ge307XG4gIH1cblxuICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IHByb3BlcnRpZXMgb3IgYXJyYXkgaW5kaWNlc1xuICBmb3IgKHZhciBwIGluIGZ1bGxPYmopIHtcbiAgICBpZiAoXG4gICAgICBwWzBdICE9PSBcIl9cIiAmJiAvLyBEb24ndCBjb25zaWRlciBwcml2YXRlIHByb3BlcnRpZXNcbiAgICAgIGZ1bGxPYmouaGFzT3duUHJvcGVydHkocCkgJiYgLy8gRXhjbHVkZSBwYXJlbnQgcHJvcGVydGllc1xuICAgICAgZnVsbE9ialtwXSAhPT0gbnVsbCAvLyBFeGNsdWRlIGNhc2VzIHdoZXJlIGZ1bGxPYmogZG9lc24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHJvcGVydHlcbiAgICApIHtcbiAgICAgIC8vIENvbXB1dGUgb2JqZWN0IGVxdWFsaXR5XG4gICAgICB2YXIgcHJvcHNfZXF1YWw7XG4gICAgICBwcm9wc19lcXVhbCA9IF8uaXNFcXVhbChmdWxsT2JqW3BdLCByZW1vdmVPYmpbcF0pO1xuXG4gICAgICAvLyBQZXJmb3JtIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGlmIHByb3BzIGFyZSBub3QgZXF1YWxcbiAgICAgIGlmICghcHJvcHNfZXF1YWwgfHwgcCA9PT0gXCJ1aWRcIikge1xuICAgICAgICAvLyBMZXQgdWlkcyB0aHJvdWdoXG5cbiAgICAgICAgLy8gcHJvcGVydHkgaGFzIG5vbi1udWxsIHZhbHVlIGluIGZ1bGxPYmogdGhhdCBkb2Vzbid0XG4gICAgICAgIC8vIG1hdGNoIHRoZSB2YWx1ZSBpbiByZW1vdmVPYmpcbiAgICAgICAgdmFyIGZ1bGxWYWwgPSBmdWxsT2JqW3BdO1xuICAgICAgICBpZiAocmVtb3ZlT2JqLmhhc093blByb3BlcnR5KHApICYmIHR5cGVvZiBmdWxsVmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgLy8gUmVjdXJzZSBvdmVyIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZnVsbFZhbCkpIHtcbiAgICAgICAgICAgIGlmIChmdWxsVmFsLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGZ1bGxWYWxbMF0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhbiBvYmplY3QgYXJyYXlcbiAgICAgICAgICAgICAgcmVzW3BdID0gbmV3IEFycmF5KGZ1bGxWYWwubGVuZ3RoKTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdWxsVmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlbW92ZU9ialtwXSkgfHwgcmVtb3ZlT2JqW3BdLmxlbmd0aCA8PSBpKSB7XG4gICAgICAgICAgICAgICAgICByZXNbcF1baV0gPSBmdWxsVmFsW2ldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXNbcF1baV0gPSBjcmVhdGVEZWx0YU9iamVjdChmdWxsVmFsW2ldLCByZW1vdmVPYmpbcF1baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIHByaW1pdGl2ZSBhcnJheSBvciB0eXBlZCBhcnJheVxuICAgICAgICAgICAgICByZXNbcF0gPSBmdWxsVmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBvYmplY3RcbiAgICAgICAgICAgIHZhciBmdWxsX29iaiA9IGNyZWF0ZURlbHRhT2JqZWN0KGZ1bGxWYWwsIHJlbW92ZU9ialtwXSk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZnVsbF9vYmopLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgLy8gbmV3IG9iamVjdCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgcmVzW3BdID0gZnVsbF9vYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmdWxsVmFsID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGZ1bGxWYWwpKSB7XG4gICAgICAgICAgLy8gUmV0dXJuICdjbG9uZScgb2YgZnVsbFZhbFxuICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSBhIHN0YW5kYXJkIGNsb25lIG1ldGhvZCBzbyB0aGF0IHdlIGtlZXBcbiAgICAgICAgICAvLyB0aGUgc3BlY2lhbCBjYXNlIGhhbmRsaW5nIG9mIHRoaXMgbWV0aG9kXG4gICAgICAgICAgcmVzW3BdID0gY3JlYXRlRGVsdGFPYmplY3QoZnVsbFZhbCwge30pO1xuICAgICAgICB9IGVsc2UgaWYgKGZ1bGxWYWwgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZnVsbFZhbCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgLy8gTm8gcmVjdXJzaW9uIG5lY2Vzc2FyeSwgSnVzdCBrZWVwIHZhbHVlIGZyb20gZnVsbE9iai5cbiAgICAgICAgICAvLyBCdXQgc2tpcCB2YWx1ZXMgd2l0aCBmdW5jdGlvbiB0eXBlXG4gICAgICAgICAgcmVzW3BdID0gZnVsbFZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiByYW5kc3RyKFxuICBleGlzdGluZz86IHsgW2s6IHN0cmluZ106IGFueSB9LFxuICBiaXRzPzogbnVtYmVyLFxuICBiYXNlPzogbnVtYmVyLFxuICBfcmVjdXJzaW9uPzogbnVtYmVyXG4pOiBzdHJpbmcge1xuICBpZiAoIWJhc2UpIGJhc2UgPSAxNjtcbiAgaWYgKGJpdHMgPT09IHVuZGVmaW5lZCkgYml0cyA9IDI0O1xuICBpZiAoYml0cyA8PSAwKSByZXR1cm4gXCIwXCI7XG5cbiAgdmFyIGRpZ2l0cyA9IE1hdGgubG9nKE1hdGgucG93KDIsIGJpdHMpKSAvIE1hdGgubG9nKGJhc2UpO1xuICB2YXIgcmVzID0gXCJcIjtcbiAgdmFyIGksIGIsIHg7XG5cbiAgZm9yIChpID0gMjsgZGlnaXRzID09PSBJbmZpbml0eTsgaSAqPSAyKSB7XG4gICAgZGlnaXRzID0gKE1hdGgubG9nKE1hdGgucG93KDIsIGJpdHMgLyBpKSkgLyBNYXRoLmxvZyhiYXNlKSkgKiBpO1xuICB9XG5cbiAgdmFyIHJlbSA9IGRpZ2l0cyAtIE1hdGguZmxvb3IoZGlnaXRzKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgTWF0aC5mbG9vcihkaWdpdHMpOyBpKyspIHtcbiAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmFzZSkudG9TdHJpbmcoYmFzZSk7XG4gICAgcmVzID0geCArIHJlcztcbiAgfVxuXG4gIGlmIChyZW0pIHtcbiAgICBiID0gTWF0aC5wb3coYmFzZSwgcmVtKTtcbiAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYikudG9TdHJpbmcoYmFzZSk7XG4gICAgcmVzID0geCArIHJlcztcbiAgfVxuXG4gIHZhciBwYXJzZWQgPSBwYXJzZUludChyZXMsIGJhc2UpO1xuICBpZiAoXG4gICAgKGV4aXN0aW5nICYmIGV4aXN0aW5nW3Jlc10pIHx8XG4gICAgKHBhcnNlZCAhPT0gSW5maW5pdHkgJiYgcGFyc2VkID49IE1hdGgucG93KDIsIGJpdHMpKVxuICApIHtcbiAgICBpZiAoKF9yZWN1cnNpb24gPz8gMCkgPiAxMCkge1xuICAgICAgY29uc29sZS53YXJuKFwicmFuZHN0ciBmYWlsZWQgdW5pcXVlbmVzc1wiKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIHJldHVybiByYW5kc3RyKGV4aXN0aW5nLCBiaXRzLCBiYXNlLCAoX3JlY3Vyc2lvbiB8fCAwKSArIDEpO1xuICB9IGVsc2UgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBsZXQgbW9kZWw6IEZpZ3VyZU1vZGVsO1xuICByZXR1cm4ge1xuICAgIGluaXRpYWxpemUoY3R4OiBhbnkpIHtcbiAgICAgIG1vZGVsID0gbmV3IEZpZ3VyZU1vZGVsKGN0eC5tb2RlbCwgc2VyaWFsaXplcnMpO1xuICAgICAgbW9kZWwuaW5pdGlhbGl6ZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyKHsgZWwgfTogYW55KSB7XG4gICAgICBjb25zdCB2aWV3ID0gbmV3IEZpZ3VyZVZpZXcobW9kZWwsIGVsKTtcbiAgICAgIHZpZXcucGVyZm9ybV9yZW5kZXIoKVxuICAgICAgcmV0dXJuICgpID0+IHZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sT0FBTztBQUNkLE9BQU8sWUFBWTtBQUduQixPQUFPLGVBQWUsRUFBRSxlQUFlLFFBQVE7QUFnSXhDLElBQU0sY0FBTixNQUFrQjtBQUFBLEVBSXZCLFlBQVksT0FBdUJBLGNB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
>>>>>>> Stashed changes
