import { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import './App.scss';

export const App = () => {

  const [showAnimation, setShowAnimation] = useState( true );
  const [showVictoryAnimation, setShowVictoryAnimation] = useState( false );
  const [showLossAnimation, setShowLossAnimation] = useState( false );
  const [currentTemp, setCurrentTemp] = useState( 0 );
  const [showTemp, setShowTemp] = useState( false );
  const [tolerance, setTolerance] = useState( 0.1 );
  const [showConfig, setShowConfig] = useState( false );
  const [liveTemp, setLiveTemp] = useState( 0 );
  const showConfigRef = useRef( false );
  const currentTempRef = useRef( 0 );
  const firstTempRef = useRef( 0 );
  const secondTempRef = useRef( 0 );
  const toleranceRef = useRef( 0.1 );

  useEffect( () => {
    socket.emit( 'execute' );

    socket.on('temperature',( temp ) =>{
      console.log( temp, temp.toFixed(1) );
      currentTempRef.current = temp;
      setLiveTemp( temp );
    });

    document.addEventListener('keydown', handleTakeTemp);
    document.addEventListener('click', handleTakeFirstTemp);
    document.addEventListener('contextmenu', handleTakeSecondTemp);
    document.addEventListener('wheel', handleReset);

    return () => {
      socket.disconnect();
    }
  }, []);

  const handleTakeFirstTemp = () => {
    const difference = 36 - Number( currentTempRef.current.toString().split('.')[0] ) ;
    firstTempRef.current = currentTempRef.current + difference;
    setCurrentTemp( 36 );
    setShowTemp( true );
    
    console.log('Enter key pressed. First temperature:', currentTempRef.current + difference);
  }

  const handleTakeSecondTemp = ( event ) => {
    event.preventDefault();

    const difference = 36 - Number( currentTempRef.current.toString().split('.')[0] );
    secondTempRef.current = currentTempRef.current + difference;
    console.log('k key pressed. Second temperature:', secondTempRef.current, 'first', firstTempRef.current);

    if( secondTempRef.current > firstTempRef.current && secondTempRef.current - firstTempRef.current >= toleranceRef.current ) {
      console.log('TOLERANCE', toleranceRef.current);
      setShowLossAnimation( true );
      setShowAnimation( false );
      setShowVictoryAnimation( false );
      setShowTemp( true );
      setCurrentTemp( 37 );

      setTimeout( () => {
        handleReset();
      },15000);

    }else if( secondTempRef.current <= firstTempRef.current ){
      console.log('TOLERANCE', toleranceRef.current);
      setShowVictoryAnimation( true );
      setShowAnimation( false );
      setShowLossAnimation( false );
      setShowTemp( true );
      setCurrentTemp( 36 );

      setTimeout( () => {
        handleReset();
      },15000);
    }
  }

  const handleReset = () => {
    setShowLossAnimation( false );
    setShowVictoryAnimation( false );
    setShowAnimation( true );
    setShowTemp( false );

    firstTempRef.current = 0;
    secondTempRef.current = 0;
  }

  const handleTakeTemp = (event) => {

    if( event.key === 't' || event.key === 'T' ) {
      showConfigRef.current = !showConfigRef.current;
      setShowConfig( showConfigRef.current );
    }else if( event.key === '1' ) {
      toleranceRef.current = 0.1;
      setTolerance( 0.1 );
    }else if( event.key === '2' ) {
      toleranceRef.current = 0.2;
      setTolerance( 0.2 );
    }else if( event.key === '3' ) {
      toleranceRef.current = 0.3;
      setTolerance( 0.3 );
    }else if( event.key === '4' ) {
      toleranceRef.current = 0.4;
      setTolerance( 0.4 );
    }

  };

  return (

    <div className="container">
      { showConfig &&
      <>
        <h2 style={{ color: 'red', fontWeight: 600}}>Tolerancia: { tolerance }</h2>
        <h2 style={{ color: 'red', fontWeight: 600}}>Temperatura en vivo: { liveTemp.toFixed( 1 ) }°C</h2>
      </>
      }
      { showTemp && 
        <h1 style={{fontWeight: 600}}>{ currentTemp }°C</h1>
      }
      {
        showVictoryAnimation && !showLossAnimation && !showAnimation && 
          (<>
            <video key="win" autoPlay loop muted>
              <source src="ganar.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
      {
        showAnimation && !showVictoryAnimation && !showLossAnimation &&
          (<>
            <video key="normal" autoPlay loop muted>
              <source src="normal.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
      {
        showLossAnimation && !showVictoryAnimation && !showAnimation &&
          (<>
            <video key="lost" autoPlay loop muted>
              <source src="perder.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </>)
      }
    </div>
  )
};
