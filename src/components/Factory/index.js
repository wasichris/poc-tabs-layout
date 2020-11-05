import React from 'react';
import cytoscape from 'cytoscape';
import { Button, DatePicker, Layout, Menu, Space } from 'antd';
import { PlusCircleOutlined, SaveOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';

class Card extends React.Component {

  cy = null

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    this.cy = cytoscape({
      container: document.getElementById('cy'),

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
        }
      ]

    });
  }

  handleAddMachine01 = () => {
    this.cy.add({
      group: 'nodes',
      data: { name: 'M', weight: 75, type: 'rectangle', width: 30, height: 50},
      position: { x: 50, y: 100 }
    })
  }

  handleAddMachine02 = () => {
    this.cy.add({
      group: 'nodes',
      data: { name: 'P', weight: 75, type: 'rectangle', width: 80, height: 50},
      position: { x: 50, y: 100 }
    })
  }

  handleAddLayoutNode = () => {
    this.cy.add({
      group: 'nodes',
      data: { name: 'N', weight: 100, type: 'circle', width: 20, height: 20},
      position: { x: 50, y: 50 }
    })
  }

  handleSave = () => {
    const cyjsonStr = JSON.stringify(this.cy.json())
    window.localStorage.setItem("elements", cyjsonStr);
  }

  handleRestore = () => {
    this.cy.elements().remove();
    const cyjson = JSON.parse(window.localStorage.getItem("elements"))
    this.cy.json({ ...cyjson });
  }

  handleRemove = () => {
    this.cy.$(':selected').remove();
  }

  render() {

    return (
      <>
        <Space>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddMachine01}> Add Machine 01 </Button>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddMachine02}> Add Machine 02 </Button>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddLayoutNode}> Add Layout Node </Button>
          <Button type="primary" icon={<MinusCircleOutlined />} onClick={this.handleRemove}> Remove  </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={this.handleRestore}> Restore </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={this.handleSave}> Save </Button>
        </Space>

        <div id='cy'>

        </div>
      </>
    );
  }
}

export default Card