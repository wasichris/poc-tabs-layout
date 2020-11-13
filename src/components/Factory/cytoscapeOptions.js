export default (container) => ({

    container: container || document.getElementById('cy'),

    elements: [ // flat array of nodes and edges
      // { // node n1
      //   group: 'nodes', // 'nodes' for a node, 'edges' for an edge
      //   // NB the group field can be automatically inferred for you but specifying it
      //   // gives you nice debug messages if you mis-init elements


      //   data: { // element data (put json serialisable dev data here)
      //     id: 'n1', // mandatory (string) id for each element, assigned automatically on undefined
      //     name: 'N1',
      //     parent: 'nparent', // indicates the compound node parent id; not defined => no parent
      //     // (`parent` can be effectively changed by `eles.move()`)
      //   },

      //   // scratchpad data (usually temp or nonserialisable data)
      //   scratch: {
      //     _foo: 'bar' // app fields prefixed by underscore; extension fields unprefixed
      //   },

      //   position: { // the model position of the node (optional on init, mandatory after)
      //     x: 100,
      //     y: 100
      //   },

      //   selected: false, // whether the element is selected (default false)

      //   selectable: true, // whether the selection state is mutable (default true)

      //   locked: false, // when locked a node's position is immutable (default false)

      //   grabbable: true, // whether the node can be grabbed and moved by the user

      //   pannable: false, // whether dragging the node causes panning instead of grabbing

      //   classes: ['foo', 'bar'] // an array (or a space separated string) of class names that the element has
      // },

      // { // node n2
      //   data: { id: 'n2', name: 'N2' },
      //   renderedPosition: { x: 200, y: 200 } // can alternatively specify position in rendered on-screen pixels
      // },

      // { // node n3
      //   data: { id: 'n3', name: 'N3', parent: 'nparent' },
      //   position: { x: 123, y: 234 }
      // },

      // { // node nparent
      //   data: { id: 'nparent' }
      // },

      // { // edge e1
      //   data: {
      //     id: 'e1',
      //     // inferred as an edge because `source` and `target` are specified:
      //     source: 'n1', // the source node id (edge comes from this node)
      //     target: 'n2'  // the target node id (edge goes to this node)
      //     // (`source` and `target` can be effectively changed by `eles.move()`)
      //   },

      //   pannable: true // whether dragging on the edge causes panning
      // }
    ],

    layout: {
      name: 'preset'
    },

    // so we can see the ids
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(name)',
          "shape": "data(type)",
          'width': "data(width)",
          'height': "data(height)",
          'font-size': 12,
        }
      },
      // some style for the extension
      {
        selector: '.eh-handle',
        style: {
          'background-color': 'red',
          'width': 12,
          'height': 12,
          'shape': 'ellipse',
          'overlay-opacity': 0,
          'border-width': 12, // makes the handle easier to hit
          'border-opacity': 0
        }
      },

      {
        selector: '.eh-hover',
        style: {
          'background-color': 'red'
        }
      },

      {
        selector: '.eh-source',
        style: {
          'border-width': 2,
          'border-color': 'red'
        }
      },

      {
        selector: '.eh-target',
        style: {
          'border-width': 2,
          'border-color': 'red'
        }
      },

      {
        selector: '.eh-preview, .eh-ghost-edge',
        style: {
          'background-color': 'red',
          'line-color': 'red',
          'target-arrow-color': 'red',
          'source-arrow-color': 'red'
        }
      },

      {
        selector: '.eh-ghost-edge.eh-preview-active',
        style: {
          'opacity': 0
        }
      },
      {
        selector: '.highlight',
        style: {
          'background-color': '#ffd118',
          'line-color': '#ffd118',
          'target-arrow-color': '#ffd118',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }
      },
    ]

  })