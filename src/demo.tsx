import AceEditor from "react-ace";
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore, ILink } from './store';
import {ForceGraph2D} from 'react-force-graph'

const ForceGraph = ForceGraph2D
interface Props { }

const Demo: React.FC<Props> = observer(() => {
    const store = useStore()
  
    return 
        <div className="row">
            <style jsx>
                {`
                    .row {
                    display: flex;
                    }

                    .columnA {
                    flex: 20%;
                    }

                    .columnB {
                    flex: 80%;
                    }
                `}
            </style>
            <div className="columnA">
                <AceEditor
                    mode="javascript"
                    theme="solarized_dark"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    value={store.text} 
                    onChange={(text) => {
                        store.updateGraph(text)
                    }}
                    setOptions={{ showLineNumbers: false }}
                    />
              
                
                {/* <Button onClick={() => store.updateGraph()}>Update</Button> */}
            </div>
            <div className="columnB">
                <ForceGraph
                    width={600}
                    height={600}
                    enableNodeDrag={true}
                    dagLevelDistance={20}
                    linkDirectionalArrowLength={3}
                    linkDirectionalArrowRelPos={1}
                    linkDirectionalParticles="value"
                    linkDirectionalParticleSpeed={(d:ILink) => d.value * 0.001}
                    // linkCurvature={0.25}
                    graphData={JSON.parse(store.graph)}
                    // onNodeDragEnd={onDrag}
                    onNodeDragEnd={node => {
                        // https://github.com/vasturiano/react-force-graph/blob/master/example/fix-dragged-nodes/index.html
                        node.fx = node.x;
                        node.fy = node.y;
                        // node.fz = node.z;
                        console.log(node)
                    }}
                    // onEngineStop={() => fgRef.current.zoomToFit(400)}
                    nodeAutoColorBy="group"
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id as string;
                        const fontSize = 18 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);
                    }}
                />
            </div>
        </div>
}
)
export default Demo;