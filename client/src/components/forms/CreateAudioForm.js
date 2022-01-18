import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import {useState, useRef} from "react"
import {useNavigate, Link} from "react-router-dom"

function CreateAudioForm({contentType, creator}) {
    const [creationThumbnail, setCreationThumbnail] = useState(null)
    const [thumbnailDisplay, setThumbnailDisplay] = useState(null)
    const [audioFile, setAudioFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [audioLoading, setAudioLoading] = useState(false)
    const [audioDisplay, setAudioDisplay] = useState(null)
    const [title, setTitle] = useState("")
    const thumbRef = useRef()
    const audioRef = useRef()
    const [creationId, setCreationId] = useState(0)
    const [tag, setTag] = useState("")
    const [taglinks, setTaglinks] = useState([])
    const displayTaglinks = taglinks?.map(taglink => <span key={taglink}> {taglink} </span>)

    function picChangeHandler(e){
        const thumbnail = e.target.files[0]
        if (thumbnail.name.endsWith(".jpg") || thumbnail.name.endsWith(".jpeg") ){
            setCreationThumbnail(thumbnail)
        } else if (thumbnail.name.endsWith(".png")){
            setCreationThumbnail(thumbnail)
        } else{
            alert("That is not an appropriate image file.")
            thumbRef.current.value=""
            console.log(e.target.value)
        } 
    }

    function submitPic(e){
        e.preventDefault()
        setLoading(true)
        if (creationThumbnail instanceof File){
            const cloudinaryUrl = "https://api.cloudinary.com/v1_1/freecreate/image/upload"
            const fd = new FormData()
            fd.append('file', creationThumbnail)
            fd.append('upload_preset', 'you-create')
            const configObj = {
                method: "POST",
                body: fd
            }
            fetch(cloudinaryUrl, configObj)
            .then(r => {
                console.log(r)
                if (r.ok){
                    r.json()
                    .catch(error => console.log(error))
                    .then(data =>{
                        setThumbnailDisplay(data.secure_url)
                        setLoading(false)
                    })
                } else{
                    setLoading(false)
                    alert("You did not select a valid image file")
                    thumbRef.current.value=""
                }
            })     
        } else {
            alert("please select an image")
            setLoading(false)
        }
    }

    function audioChangeHandler(e){
        const file = e.target.files[0]
        if (file.name.endsWith(".mp3")){
            setAudioFile(file)
        } else{
            alert("That is not an appropriate image file.")
            audioRef.current.value=""
            console.log(e.target.value)
        } 
    }

    function uploadAudio(e){
        e.preventDefault()
        setAudioLoading(true)
        if (audioFile instanceof File){
            const cloudinaryUrl = "https://api.cloudinary.com/v1_1/freecreate/raw/upload"
            const fd = new FormData()
            fd.append('file', audioFile)
            fd.append('upload_preset', 'you-create')
            const configObj = {
                method: "POST",
                body: fd
            }
            fetch(cloudinaryUrl, configObj)
            .then(r => {
                console.log(r)
                if (r.ok){
                    r.json()
                    .catch(error => console.log(error))
                    .then(data =>{
                        setAudioDisplay(data.secure_url)
                        setAudioLoading(false)
                    })
                } else{
                    setAudioLoading(false)
                    alert("You did not select a valid audio file")
                    audioRef.current.value=""
                }
            })
        } else {
            alert("please select an image")
            setAudioLoading(false)
        }
    }

    function createAudio(e){
        e.preventDefault()
        const newAudio = {
            title: title,
            content: audioDisplay,
            thumbnail: thumbnailDisplay,
            creator_id: creator.id
        }
        const configObj = {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newAudio)
        }

        fetch("/api/audios", configObj)
        .then(r => {
            if (r.ok){
                r.json().then(data =>{
                    console.log(data)
                    setCreationId(data.id)
                })
            } else{
                r.json().then(data => console.log(data))
            }
        })
    }

    function submitTag(e){
        e.preventDefault()
        for (const taglink of taglinks){
            if (taglink === tag) {
                setTag("")
                console.log("no new")
                return alert("you have already added that tag")
            }
        }
        const newTag = {
            tag: tag,
            audio_id: creationId
        }
        const configObj = {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(newTag)
        }
        fetch("/api/vid_taglinks", configObj)
        .then(r =>{
            if (r.ok){
                r.json().then(data =>{
                    setTaglinks([...taglinks, data.tag.tag])
                    setTag("")
                })
            } else {
                r.json().then(data=>{
                    // console.log(data)
                })
            }
        })
    }

    return (
        <Container>
            <h4>Add {contentType}:</h4>
            <Row>
                <Col>
                    <h4>Select creation thumbnail:</h4>
                    {thumbnailDisplay ?  null : <Form onSubmit={submitPic}>
                        <Form.Group>
                            <Form.Label>Upload Thumbnail:</Form.Label>
                            <Form.Control type="file" name="file" ref={thumbRef} onChange={picChangeHandler}/>
                        </Form.Group>
                        <Button type="submit">Add Thumbnail</Button>
                    </Form> }
                </Col>
                <Col>
                    {loading ? <p>Loading thumbnail...</p> : null}
                    {thumbnailDisplay ? <Image src={thumbnailDisplay} style={{"height": "100px"}}/> : <h4><em>Your Thumbnail Here</em></h4>}
                </Col>
            </Row>
            <Row>
                {audioLoading ? <p>Loading audio...</p> : null}
                {audioDisplay ? <audio controls src={audioDisplay}>Your browser does not support this element</audio> : <Form onSubmit={uploadAudio}>
                    <Form.Group>
                        <Form.Label>Content:</Form.Label>
                        <Form.Control type="file" ref={audioRef} onChange={audioChangeHandler}/>
                        <Button type="submit">Upload Audio</Button>
                    </Form.Group>
                </Form>}
            </Row>
            <Row>
                <Form onChange={(e) => setTitle(e.target.value)} onSubmit={createAudio}>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        {creationId === 0 ? <Form.Control type="text" value={title}/> : <Form.Control disabled type="text" value={title}/> }
                    </Form.Group>
                    {(title === "" || creationId !== 0) || (audioDisplay === null || thumbnailDisplay === null) ? <Button type="submit" disabled>Create</Button> : <Button type="submit">Create</Button>}
                </Form>
            </Row>
            <Form onChange={(e) => setTag(e.target.value.toLowerCase())} onSubmit={submitTag}>
                <Form.Label>Add Tags:</Form.Label>
                <Form.Control type="text" value={tag}/>
                {creationId === 0 ? <Button type="submit" disabled>Add Tag</Button> : <Button type="submit">Add Tag</Button> }
            </Form>
            <p>
                {displayTaglinks}
            </p>
            {creationId !== 0 ? <Link to="/"><Button>Finish</Button></Link> : <Link to="/"><Button>Cancel</Button></Link>}
            
        </Container>
    )
}

export default CreateAudioForm