import React from 'react';
import { Button, DatePicker, Layout, Switch, Space, message, Modal, Select } from 'antd';
import { PlusCircleOutlined, SaveOutlined, UploadOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import cytoscape from 'cytoscape';
import cytoscapeOptions from './cytoscapeOptions'
import edgehandles from 'cytoscape-edgehandles';

const { Option } = Select;

class Card extends React.Component {

  cy = null
  eh = null
  ur = null

  constructor(props) {
    super(props)

    this.state = {
      isEnableEh: false,
      selectedNodeId: '',
      isFindMeVisible: false,
      machines: []
    }
  }



  componentDidMount() {


    // ==================================
    // using cytoscape related plugins
    try {

      cytoscape.use(edgehandles);
      var undoRedo = require('cytoscape-undo-redo');
      undoRedo(cytoscape);
    } catch (error) {

    }

    // ==================================
    // cytoscape

    const container = document.getElementById('cy')
    this.cy = cytoscape(cytoscapeOptions(container));



    // ==================================
    // edgehandles


    // the default values of each option are outlined below:
    let defaults = {
      preview: true, // whether to show added edges preview before releasing selection
      hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
      snap: false, // when enabled, the edge can be drawn by just moving close to a target node
      snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
      snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
      disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
      handlePosition: function (node) {
        return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
      },
      handleInDrawMode: false, // whether to show the handle in draw mode
      edgeType: function (sourceNode, targetNode) {
        // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
        // returning null/undefined means an edge can't be added between the two nodes
        return 'flat';
      },
      loopAllowed: function (node) {
        // for the specified node, return whether edges from itself to itself are allowed
        return false;
      },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      nodeParams: function (sourceNode, targetNode) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for intermediary node
        return {};
      },
      edgeParams: function (sourceNode, targetNode, i) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        // NB: i indicates edge index in case of edgeType: 'node'
        return {};
      },
      ghostEdgeParams: function () {
        // return element object to be passed to cy.add() for the ghost edge
        // (default classes are always added for you)
        return {};
      },
      show: function (sourceNode) {
        // fired when handle is shown
        // console.log(sourceNode)
      },
      hide: function (sourceNode) {
        // fired when the handle is hidden
      },
      start: function (sourceNode) {
        // fired when edgehandles interaction starts (drag on handle)
      },
      complete: function (sourceNode, targetNode, addedEles) {
        // fired when edgehandles is done and elements are added

        // for undo
        // 猜測應該重複的物件不會重複加入，所以這邊只會列入 undo plugin 的記憶陣列中，不會再產生新的 eles 了
        self.ur.do("add", addedEles)
      },
      stop: function (sourceNode) {
        // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
      },
      cancel: function (sourceNode, cancelledTargets) {
        // fired when edgehandles are cancelled (incomplete gesture)
      },
      hoverover: function (sourceNode, targetNode) {
        // fired when a target is hovered
      },
      hoverout: function (sourceNode, targetNode) {
        // fired when a target isn't hovered anymore
      },
      previewon: function (sourceNode, targetNode, previewEles) {
        // fired when preview is shown
      },
      previewoff: function (sourceNode, targetNode, previewEles) {
        // fired when preview is hidden
      },
      drawon: function () {
        // fired when draw mode enabled
      },
      drawoff: function () {
        // fired when draw mode disabled
      }
    };

    this.eh = this.cy.edgehandles(defaults);

    const self = this
    this.cy.on('click', 'node', function (evt) {
      var node = evt.target;
      console.log('click ' + node.id());
      const nodeData = node.json()
      self.setState({ selectedNodeId: nodeData.data.id })
    });

    // default not let connect mode on
    this.eh.hide()
    this.eh.disable();



    // ==================================
    // undoRedo

    var options = {
      isDebug: false, // Debug mode for console messages
      actions: {},// actions to be added
      undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
      stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
      ready: function () { // callback when undo-redo is ready

      }
    }

    this.ur = this.cy.undoRedo(options); // Can also be set whenever wanted.
    document.addEventListener("keydown", function (e) {
      if (e.which === 46) {
        var selecteds = self.cy.$(":selected");
        if (selecteds.length > 0)
          self.ur.do("remove", selecteds);
      }
      else if (e.ctrlKey && e.target.nodeName === 'BODY')
        if (e.which === 90)
          self.ur.undo();
        else if (e.which === 89)
          self.ur.redo();

    });

  }

  handleAddMachine01 = () => {
    // 原本寫法
    // this.cy.add({
    //   group: 'nodes',
    //   data: { name: 'M', weight: 75, type: 'rectangle', width: 30, height: 50 },
    //   position: { x: 50, y: 100 }
    // })

    // 加入undo功能寫法
    const node = this.ur.do("add", {
      group: 'nodes',
      data: { name: 'M', weight: 75, type: 'rectangle', width: 30, height: 50 },
      position: { x: 50, y: 100 }
    })

    this.flicker(node.data().id)

  }

  handleAddMachine02 = () => {
    // 原本寫法
    // this.cy.add({
    //   group: 'nodes',
    //   data: { name: 'P', weight: 75, type: 'rectangle', width: 80, height: 50 },
    //   position: { x: 50, y: 100 }
    // })

    // 加入undo功能寫法
    const node = this.ur.do("add", {
      group: 'nodes',
      data: { name: 'P', weight: 75, type: 'rectangle', width: 80, height: 50 },
      position: { x: 50, y: 100 }
    })

    this.flicker(node.data().id)

  }

  handleAddLayoutNode = () => {
    // 原本寫法
    // this.cy.add({
    //   group: 'nodes',
    //   data: { name: 'N', weight: 100, type: 'circle', width: 20, height: 20 },
    //   position: { x: 50, y: 50 }
    // })

    // 加入undo功能寫法
    const node = this.ur.do("add", {
      group: 'nodes',
      data: { name: 'N', weight: 100, type: 'circle', width: 20, height: 20 },
      position: { x: 50, y: 50 }
    })

    this.flicker(node.data().id)
  }

  handleSave = () => {

    // 避免node連線模式下，連線indicator殘留也存下，因此在儲存前先清除 indicator
    this.eh.hide()


    // 儲存目前的畫面資料
    const cyjsonStr = JSON.stringify(this.cy.json())
    window.localStorage.setItem("elements", cyjsonStr);
    message.success('This layout has been Saved.');
  }



  handleRestore = () => {
    this.cy.elements().remove();
    const cyjson = JSON.parse(window.localStorage.getItem("elements"))
    this.cy.json({ ...cyjson })
      .style().fromJson(cytoscapeOptions().style).update() // 以目前新定義的 style 更新舊資料，這樣新功能使用的 style 才可以在舊資料上呈現

  }

  handleRemove = () => {
    // 原本寫法
    // const eles = this.cy.$(':selected');
    // eles.remove()

    // 加入undo功能寫法
    this.ur.do("remove", this.cy.$(':selected'))
  }

  handleSwitchConnectMode = () => {
    // 可以開啟或關閉node連線模式，避免在拖曳的時候影響使用者體驗
    const { isEnableEh } = this.state

    if (isEnableEh) {
      this.eh.hide()
      this.eh.disable();
    } else {
      this.eh.enable();
    }

    this.setState({ isEnableEh: !isEnableEh })

  }

  handleLoadDemoFactory = () => {
    this.cy.elements().remove();
    const cyjson = JSON.parse('{"elements":{"nodes":[{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"98360eeb-ba40-44b8-a9a7-624d8a4fa5b0"},"position":{"x":-7.999995825425927,"y":13.00000266309035},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"06fad397-3b14-4624-af3f-c426583f9b28"},"position":{"x":-7.999995825425927,"y":140.99999345023718},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"ef762fca-9314-46e9-a781-729ffdf270b8"},"position":{"x":474.9999694104488,"y":12.000002735065777},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"4cb6c3ee-fa18-4e44-a1e6-1136c64048e9"},"position":{"x":476.99996926649794,"y":236.99998654059746},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"863e3dd5-e7e3-45f7-a66d-e6b2713b062a"},"position":{"x":333.99934165060824,"y":237.99998646862204},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"c967d7bf-83e6-4b41-9b2e-e0557c9fbd9d"},"position":{"x":163.99999179480272,"y":141.99999337826185},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"7f392cf4-0174-45b0-8a66-6d18b3ae4475"},"position":{"x":163.99999179480267,"y":310.9999812144167},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":"eh-preview-active"},{"data":{"name":"N","weight":100,"type":"circle","width":20,"height":20,"id":"3c97c123-bc2a-4ba5-a5bd-96c14ca55e34"},"position":{"x":334.99997948700684,"y":310.9999812144169},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"0908d846-dd08-4648-8e1b-1fe0022322c8"},"position":{"x":38.000000863705,"y":63.00000266309034},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"e4b550f1-0d60-4cce-b314-06d12bb707a9"},"position":{"x":82.9999976248113,"y":62.00000273506578},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"bb9183e0-a780-4dd1-a9f6-4ab3b30aaa02"},"position":{"x":131.99999409801597,"y":62.00000273506576},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"P","weight":75,"type":"rectangle","width":80,"height":50,"id":"b4811136-18a3-45db-b706-efc1035919f6"},"position":{"x":220.99998769220406,"y":62.00000273506578},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"d02d5720-e8ff-40a0-8885-f0f8eb9b8ada"},"position":{"x":445.99997149773577,"y":63.00000266309037},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"P","weight":75,"type":"rectangle","width":80,"height":50,"id":"b584689a-245c-4519-8a4e-cc12d596309e"},"position":{"x":321.99998042268714,"y":61.00000280704117},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"74d893b4-9af9-4703-9dd8-2956e3e86fb6"},"position":{"x":302.99966283603305,"y":140.999678094821},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"9c174881-4f54-4115-9f26-146a0003d296"},"position":{"x":345.99997869527726,"y":140.999997049008},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"P","weight":75,"type":"rectangle","width":80,"height":50,"id":"fc181054-3949-47dd-96bf-ff1204fdb029"},"position":{"x":253.9999853170154,"y":264.9999881240566},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"name":"M","weight":75,"type":"rectangle","width":30,"height":50,"id":"b924b634-792b-48f7-b4ee-2513e3cf5a8f"},"position":{"x":403.9999745207031,"y":63.00000266309034},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""}],"edges":[{"data":{"source":"98360eeb-ba40-44b8-a9a7-624d8a4fa5b0","target":"06fad397-3b14-4624-af3f-c426583f9b28","id":"c3746787-6ea1-4330-b189-1a176256da86"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"98360eeb-ba40-44b8-a9a7-624d8a4fa5b0","target":"ef762fca-9314-46e9-a781-729ffdf270b8","id":"24091a9e-8729-4285-bf8a-e37aa431a2a7"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"ef762fca-9314-46e9-a781-729ffdf270b8","target":"4cb6c3ee-fa18-4e44-a1e6-1136c64048e9","id":"352fde2a-2487-4787-8197-96e35af7f231"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"4cb6c3ee-fa18-4e44-a1e6-1136c64048e9","target":"863e3dd5-e7e3-45f7-a66d-e6b2713b062a","id":"87de24b6-617d-4735-a0da-b93118c3569a"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"863e3dd5-e7e3-45f7-a66d-e6b2713b062a","target":"3c97c123-bc2a-4ba5-a5bd-96c14ca55e34","id":"be2d17a3-a631-48ba-be4c-f3b93bca6533"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"3c97c123-bc2a-4ba5-a5bd-96c14ca55e34","target":"7f392cf4-0174-45b0-8a66-6d18b3ae4475","id":"4309d0a1-7335-422f-99b7-2b93d0c1164f"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"7f392cf4-0174-45b0-8a66-6d18b3ae4475","target":"c967d7bf-83e6-4b41-9b2e-e0557c9fbd9d","id":"16affd75-f91b-4e0e-b0bb-4aac03542aeb"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"06fad397-3b14-4624-af3f-c426583f9b28","target":"c967d7bf-83e6-4b41-9b2e-e0557c9fbd9d","id":"c01afa6e-d72e-4894-a9cf-e73bd1cae74b"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""}]},"style":[{"selector":"node","style":{"label":"data(name)","shape":"data(type)","width":"data(width)","height":"data(height)","font-size":"12px"}},{"selector":".eh-handle","style":{"background-color":"rgb(255,0,0)","width":"12px","height":"12px","shape":"ellipse","overlay-opacity":"0","border-width":"12px","border-opacity":"0"}},{"selector":".eh-hover","style":{"background-color":"rgb(255,0,0)"}},{"selector":".eh-source","style":{"border-width":"2px","border-color":"rgb(255,0,0)"}},{"selector":".eh-target","style":{"border-width":"2px","border-color":"rgb(255,0,0)"}},{"selector":".eh-preview, .eh-ghost-edge","style":{"background-color":"rgb(255,0,0)","line-color":"rgb(255,0,0)","target-arrow-color":"rgb(255,0,0)","source-arrow-color":"rgb(255,0,0)"}},{"selector":".eh-ghost-edge.eh-preview-active","style":{"opacity":"0"}}],"data":{},"zoomingEnabled":true,"userZoomingEnabled":true,"zoom":1,"minZoom":1e-50,"maxZoom":1e+50,"panningEnabled":true,"userPanningEnabled":true,"pan":{"x":251.96234526812918,"y":55.99521165657174},"boxSelectionEnabled":true,"renderer":{"name":"canvas"}}')
    this.cy.json({ ...cyjson })
      .style().fromJson(cytoscapeOptions().style).update() // 以目前新定義的 style 更新舊資料，這樣新功能使用的 style 才可以在舊資料上呈現
  }

  highlight = (eleId) => {
    // 套用 class 固定時間後復原
    this.cy.$(`#${eleId}`).flashClass('highlight', 1500);
  }

  flicker = (eleId) => {
    // 閃爍動畫
    const ele = this.cy.$(`#${eleId}`)
    ele
      .animate({ style: { backgroundColor: '#000000' } }, { duration: 800 })
      .animate({ style: { backgroundColor: '#999999' } }, { duration: 1 })
      .animate({ style: { backgroundColor: '#000000' } }, { duration: 500 })
      .animate({ style: { backgroundColor: '#999999' } }, { duration: 1 })
      .animate({ style: { backgroundColor: '#000000' } }, { duration: 500 })
      .animate({ style: { backgroundColor: '#999999' } }, {
        duration: 1, complete: function () {
          // 清除以上額外加入的背景 style，避免原本元件被 selected 的顏色無法顯示
          ele.removeStyle()  // Remove all style overrides.
        }
      })
  }

  handleFindMe = () => {

    const source = this.cy.json()
    if (source) {
      const { elements: { nodes: nodes } } = source
      if (nodes && nodes.length > 0) {
        const machines = nodes.filter(node => node.data.type === "rectangle").map(n => n.data)
        this.setState({ machines: machines })
        this.showFindMeModal()
      }
    }
  }

  showFindMeModal = () => {
    this.setState({ isFindMeVisible: true, });
  }

  handleFindMeModalOk = e => {
    console.log(e);
    this.setState({ isFindMeVisible: false, });

    const eleId = this.state.selectedNodeId
    if (eleId) {
      // this.cy.$(eleId).toggleClass('highlight');
      this.cy.animate({ center: { eles: `#${eleId}` } })
      this.highlight(eleId)
    }

  };

  handleFindMeModalCancel = e => {
    console.log(e);
    this.setState({ isFindMeVisible: false, });

  };

  handleFindMachineChange = (value) => {
    this.setState({ selectedNodeId: value })
  }

  render() {

    const { isEnableEh, selectedNodeId, isFindMeVisible, machines } = this.state

    return (
      <>
        <div className='factory_tool'>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddMachine01}> Add Machine 01 </Button>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddMachine02}> Add Machine 02 </Button>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.handleAddLayoutNode}> Add Layout Node </Button>
          <Button type="primary" icon={<MinusCircleOutlined />} onClick={this.handleRemove}> Remove  </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={this.handleRestore}> Restore </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={this.handleSave}> Save </Button>
          <Button type="primary" icon={<SearchOutlined />} onClick={this.handleFindMe}> Find Me </Button>
          <Button type="primary" onClick={this.handleSwitchConnectMode}> Turn {isEnableEh ? 'OFF' : 'ON'} Connect Mode</Button>

          <Button onClick={this.handleLoadDemoFactory}> Load Demo Data </Button>
        </div>

        <div id='cy'>

        </div>

        <div className="factory_machine_info">
          {selectedNodeId ? 'ID: '+selectedNodeId : ''}
        </div>


        {/* find me modal */}
        <Modal
          title="Machines"
          visible={isFindMeVisible}
          onOk={this.handleFindMeModalOk}
          onCancel={this.handleFindMeModalCancel}
        >
          <p>Please choose a machine</p>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a machine"
            optionFilterProp="children"
            onChange={this.handleFindMachineChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {machines.map(m => <Option key={m.id} value={m.id}>{m.id}</Option>)}

          </Select>
        </Modal>
      </>
    );
  }
}

export default Card