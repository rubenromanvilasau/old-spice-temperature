import { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import './App.scss';

export const App = () => {

  const [showAnimation, setShowAnimation] = useState( true );
  const [showVictoryAnimation, setShowVictoryAnimation] = useState( false );
  const [showLossAnimation, setShowLossAnimation] = useState( false );
  const [currentTemp, setCurrentTemp] = useState( 0 );
  const [firstTemp, setFirstTemp] = useState( 0 );
  const [secondTemp, setSecondTemp] = useState( 0 );
  const currentTempRef = useRef( 0 );
  const firstTempRef = useRef( 0 );
  const secondTempRef = useRef( 0 );

  useEffect( () => {
    socket.emit( 'execute' );

    socket.on('temperature',( temp ) =>{
      console.log( temp );
      currentTempRef.current = temp;
      setCurrentTemp( temp );
    });

    document.addEventListener('keydown', handleTakeTemp);

    return () => {
      socket.disconnect();
    }
  }, []);

  /**
   * Handle when user clicks a key, Enter to take first temperature, k to take the second one, and m to reset 
   * @param {Event} event 
   */
  const handleTakeTemp = (event) => {
    switch ( event.key ) {
      case 'Enter':
        setFirstTemp( currentTempRef.current );
        firstTempRef.current = currentTempRef.current;
        console.log('Enter key pressed. First temperature:', currentTempRef.current);
        break;
    
      case 'k':
        setSecondTemp( currentTempRef.current );
        secondTempRef.current = currentTempRef.current;
        console.log('k key pressed. Second temperature:', secondTempRef.current, 'first', firstTempRef.current);
  
        if( secondTempRef.current > firstTempRef.current ) {
          setShowLossAnimation( true );
          setShowAnimation( false );
          setShowVictoryAnimation( false );
        }else{
          setShowVictoryAnimation( true );
          setShowAnimation( false );
          setShowLossAnimation( false );
        }
        break;
      
      case 'm':
        handleReset()
        break;
      
      default:
        break;
    }

  };

  const handleReset = () => {
    setShowLossAnimation( false );
    setShowVictoryAnimation( false );
    setShowAnimation( true );
    setFirstTemp( 0 );
    setSecondTemp( 0 );
    firstTempRef.current = 0;
    secondTempRef.current = 0;
  }

  return (

    <div className="container">
    <h1 style={{ color: 'lightblue', fontWeight: 600}}>{ currentTemp }°C</h1>
      {
        showVictoryAnimation && !showLossAnimation && !showAnimation && 
          (<>
            <h1>YOU WON</h1>
            <video key="breaking-bad" width="1024" height="768" autoPlay loop muted>
              <source src="breaking-bad.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
      {
        showAnimation && !showVictoryAnimation && !showLossAnimation &&
          (<>
            <h1>NORMAL</h1>
            <video key="milkiway" width="1024" height="768" autoPlay loop muted>
              <source src="milkyway.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
      {
        showLossAnimation && !showVictoryAnimation && !showAnimation &&
          (<>
            <h1>YOU LOST</h1>
            <video key="flag" width="1024" height="768" autoPlay loop muted>
              <source src="flag.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
    </div>
  )
};
