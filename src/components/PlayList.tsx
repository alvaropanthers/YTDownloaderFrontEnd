import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IAudio, IPlayList } from "../Interfaces";
import { AudioContext } from '../App';

function AudioItem(props: { data: IAudio, handleAudioItemClick: (item: IAudio) => void }) {
    const value = useContext(AudioContext);
    return (
        <div className="card mb-2" 
            style={{ cursor: 'pointer' }}
            onClick={() => props.handleAudioItemClick(props.data)}>
            <div className="card-body">
                <h5 className="card-title">{ props.data.title }</h5>
                <h6 className="card-subtitle mb-2 text-muted">{ props.data.channelTitle }</h6>
                
                { value !== null && value.id === props.data.id && (
                    <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                        <i className="bi bi-file-music-fill"></i>
                    </div>
                )}
                {/* <a href={`https://localhost:7154/api/Audio?name=${props.data.url}`} download="file.mp4" className="card-link">Download</a> */}
            </div>
        </div>
    );
}

function AudioList(props: { data: Array<IAudio> | null, handleAudioItemClick: (item: IAudio) => void }) {
    return (
        <div style={{ maxHeight: '70%', overflowY: 'scroll' }}>
            {props.data === null && (<h5>Nothing To Show</h5>)}
            {props.data !== null && props.data?.map((item: IAudio) => (
                <AudioItem key={item.id} data={item} handleAudioItemClick={props.handleAudioItemClick} />
            ))}
        </div>
    );
}

export default function PlayList(props: { url: string, handleAudioItemClick: (item: IAudio) => void }) {
    const [playList, setPlayList] = useState<IPlayList | null>(null);

    useEffect(() => {
        if (props.url !== '')
            axios.get(`https://localhost:7154/api/PlayList?url=${props.url}`)
            .then(response => setPlayList(response.data))
            .catch(err => console.error(err));
    }, [props.url]);

    return (
        <AudioList 
            data={playList === null ? null : playList.videos}  
            handleAudioItemClick={props.handleAudioItemClick} 
        />
    );
}