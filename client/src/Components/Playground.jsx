import React from 'react'
import Terminal from './Terminal'
import FolderStructure from './Folder'
import EdittingSpace from './Editor'
const Playground = () => {
    return (
        <div style={{display:"grid",gridTemplateColumns:"1.25fr 5.8fr 3fr", columnGap:"0.5rem",height:"100%"}}>
            <div style={{height:"100%"}}>
                <FolderStructure />
            </div>
            <div style={{ height:"100%"}}>
                <EdittingSpace />
            </div>
            <div style={{ height:"100%"}}>
                <Terminal />
            </div>
        </div>
    )
}

export default Playground

