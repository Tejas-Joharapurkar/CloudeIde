import React, { useState } from 'react'

const folderStyle = {
    display: "grid",
    height: "100%",
    with: "550px",
    cursor: "pointer",
    border: "2px solid red"

}
const Folder = ({ folder, fetchDir }) => {
    const [show, setShow] = useState(false)
    // console.log(folder);
    const check = (f) => {
        if (!f.hasOwnProperty("children")) {
            console.log(f);
            fetchDir(f.path)
        }
        setShow(!show)
    }
    return (
        <div style={folderStyle}>
            {
                folder?.map((f) => {
                    if (show && f.children) {
                        return (
                            <div key={f.path}>
                                <div className="fName" onClick={() => { setShow(!show) }}>
                                    {f.name}
                                    {show}
                                </div>
                                <Folder folder={f.children} fetchDir={fetchDir} key={f.path} />
                            </div>
                        )
                    }
                    if (f.type === 'dir') {
                        return (
                            <div key={f.path} onClick={() => { check(f) }}>
                                {f.name}
                                {show}
                            </div>
                        )
                    }
                    if (f.type === 'file') {
                        return (
                            <div key={f.path} >{f.name}</div>
                        )
                    }
                })
            }
        </div>
    )
}

export default Folder