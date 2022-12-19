import { createContext, useState } from "react";
import PlayList from "./components/PlayList";
import { IAudio } from "./Interfaces";
import Form from 'react-bootstrap/Form';

export const AudioContext = createContext<IAudio | null>(null);

function App() {
    const [inputValue, setInputValue] = useState('');
    const [playListUrl, setPlayListUrl] = useState('');
    const [audioFile, setAudioFile] = useState<HTMLAudioElement | null>(null);
    const [currentAudioItem, setCurrentAudioItem] = useState<IAudio | null>(null);
    const [audioProperties, setAudioProperties] = useState({ isPaused: false, isPlaying: false });
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeInterval, setCurrentTimeInterval] = useState<NodeJS.Timer | null>(null);

    const handleButtonClick = () => {
        setPlayListUrl(inputValue);
        setInputValue('');
    };

    const handleButtonPause = () => {
        audioFile?.pause();
        setAudioProperties({isPlaying: false, isPaused: true});
    };

    const handleButtonPlay = () => {
        audioFile?.play();
        setAudioProperties({isPlaying: true, isPaused: false});
    };

    const handleButtonStop = () => {
        resetPlayer();
    };

    const resetPlayer = () => {
        if (currentAudioItem !== null)
            setCurrentAudioItem(null);

        if (audioFile !== null) {
            audioFile.pause();
            setAudioProperties({isPlaying: false, isPaused: false});
            setAudioFile(null);
        }

        if (currentTimeInterval !== null) {
            clearInterval(currentTimeInterval);
            setCurrentTimeInterval(null);
            setCurrentTime(0);
        }
    };

    const handleAudioItemClick = (audioItem: IAudio) => {
        resetPlayer();
        let newAudio = new Audio(`https://localhost:7154/api/Audio?name=${audioItem.url}`);
        newAudio.addEventListener("canplaythrough", (event) => {
            newAudio.play();
            newAudio.onplaying = (e: Event) => {
                setAudioProperties({isPlaying: true, isPaused: false});
                setAudioFile(newAudio);
                setCurrentAudioItem(audioItem);
                const intervalTimer = setInterval(() => {
                    let calculation = (newAudio.currentTime / newAudio.duration) * 100;
                    setCurrentTime(calculation);
                }, 1);
                setCurrentTimeInterval(intervalTimer);
            };
        });
        
    };

    return (
        <AudioContext.Provider value={currentAudioItem}>
            <div className="container">
                <div className="row mt-5 mb-3">
                    <div className="col-12">
                        <div className="input-group input-group-lg">
                            <input 
                                className="form-control mb-2" 
                                value={inputValue} 
                                placeholder="PlayList Url"
                                onChange={(e) => setInputValue(e.target.value)} />
                        </div>
                        <button className="form-control" onClick={handleButtonClick}>Download</button>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <p style={{ 
                            overflowX: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap', 
                            fontSize: '16px' 
                        }}>{ currentAudioItem?.title }</p>
                    </div>
                    <div className="col-12">
                        <Form.Range onChange={() => {}} value={currentTime} />
                    </div>
                    <div className="col-4">
                        <button 
                            className="form-control" 
                            disabled={audioFile === null || audioProperties.isPlaying} 
                            onClick={handleButtonPlay}>
                                <i className="bi bi-play-circle-fill"
                                    style={{ ...(audioFile === null || audioProperties.isPlaying) && { color: '#b7b7b7'} }}
                                ></i>
                            </button>
                    </div>
                    <div className="col-4">
                        <button 
                            className="form-control" 
                            disabled={audioFile === null ||audioProperties.isPaused} 
                            onClick={handleButtonPause}>
                                <i className="bi bi-pause-circle-fill"
                                    style={{ ...(audioFile === null || audioProperties.isPaused) && { color: '#b7b7b7'} }}
                                ></i>
                            </button>
                    </div>
                    <div className="col-4">
                        <button 
                            className="form-control" 
                            disabled={audioFile === null} 
                            onClick={handleButtonStop}>
                                <i className="bi bi-stop-circle-fill"
                                    style={{ ...(audioFile === null) && { color: '#b7b7b7'} }}
                                ></i>
                            </button>
                    </div>
                </div>

                <div className="row" style={{ backgroundColor: 'grey', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div className="col-12">
                        <PlayList url={playListUrl} handleAudioItemClick={handleAudioItemClick} />
                    </div>
                </div>
            </div>
        </AudioContext.Provider>
    );
}

export default App;