import { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import './App.scss';

export const App = () => {

  const [showAnimation, setShowAnimation] = useState( false );
  const brea = useRef(null)

  useEffect( () => {
    socket.emit( 'execute' );


    socket.on('temperature',( temp ) =>{
      console.log( temp );
      setShowAnimation( !showAnimation );
    });

    socket.on('reset',( temp ) =>{
      console.log( temp );
      setShowAnimation( false );
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (

    <div className="container">
      { showAnimation
        ? (<video ref={brea} key="breaking-bad" width="1024" height="768" autoPlay loop muted>
            <source src="breaking-bad.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>)
        : (<video key="milkiway" width="1024" height="768" autoPlay loop muted>
            <source src="milkyway.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>)
      }
    </div>
  )
};
