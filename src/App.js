// MAKE THIS CODE MORE READABLE YOU SCUMBAG. NEED TO GO THROUGH AND COMMENT ON WHAT ISN'T COMMENTED ON.
// Geez, alright dude!
// 11/7/23 11:59pm EST - code is cleaned up/commented :D See various TODOs throughout

import React, { useState, useEffect } from 'react';
import './App.css';
import Keyboard from './Keyboard'
import { act } from '@testing-library/react';
import Papa from 'papaparse';
import ptshortcuts from './editmenushortcuts.csv';

function App() {
  // used to determine if keys like ctrl/alt/win should have default behavior (!capturemode=not locked in)
  const [captureMode, setCaptureMode] = useState(false);

  // TODO: Give pop up with instructions, prompt to enter capture mode

  // Logic for captureMode
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (captureMode) {
        // Prevents key events from default behaviour (ex: f11 wont fullscreen)
        event.preventDefault();

        // Toggle capture mode off with escape key
        if (event.key === 'Escape') {
          setCaptureMode(false);
          console.log("Exited capture mode")
        }

      // NON CAPTURE MODE  
      } else {
        // Toggle capture mode on with enter key
        if (event.key === 'Enter') {
          setCaptureMode(true);
          console.log("Capture mode entered")
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [captureMode]);

  ///////

  // Const to be used to compare to CSV containing various key combinations
  const [activeKeys, setActiveKeys] = useState([]);

//TODO: FIX ONSCREEN KEYBOARD LIGHTING
//       in the next useEffect, nest the 
//      "if (!activeKeys.includes(event.key.toUpperCase())) {"
//      conditional in a check for ctrl/win/alt/space keys (might need to check others)
//
//      ALSO, see 'activeKeyString' on line ~120. Might be relevant to above.

  // Generate array of keys pressed 
  useEffect(() => {
      const handleKeyDown = (event) => {
        // Add the key to the activeKeys if it's not already there
        if (!activeKeys.includes(event.key.toUpperCase())) {
          setActiveKeys([...activeKeys, event.key.toUpperCase()]);

          //logging for troubleshooting, ignore..
          console.log('event key:', event.key);
          console.log('Active keys: ', activeKeys);
          console.log('current shortcut: ', currentShortcut);
        }
      };

      const handleKeyUp = (event) => {
        // Remove the key from activeKeys when released
        setActiveKeys(activeKeys.filter(key => key !== event.key.toUpperCase()));
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Cleanup the event listeners on component unmount
      // ^^ Real talk ChatGPT said this. Still trying to figure out what this return does down here (as well as the logic behind the above addEventListeners..).
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [activeKeys]);

    // const containing full contents of shortcuts CSV.
    // If plan is to have differnet "sections" of shortcut lessons, this can be replicated.
    const [shortcuts, setShortcuts] = useState([]);

//TODO: Populate CSV with Mac shortcuts. Opens a whole can of worms of determining which OS user is on/changing onscreen keyboard

    // Used to hold the current "profile" of the shortcut (all columns for a row in CSV),
    // currently including Keystroke name, keystroke pattern in plaintext for windows, and an empty column of the same for Mac.
    const [currentShortcut, setCurrentShortcut] = useState([]);

    //define randomly generated starting point in the table of shortcuts
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    var positionInArray = getRandomInt(11);

    //Section to set the current shortcut from CSV
    useEffect(() => {
      Papa.parse(ptshortcuts, {
        download: true,
        header: true,
        complete: (result) => {
          //Next line pulls all data into shortcuts const
          setShortcuts(result.data);

          // Populate currentShortcut with all columns in row
          setCurrentShortcut(result.data[positionInArray]);
        }
      });
    }, []);

    // Condence array of pressed keys to into correct format for comparison to shorcut CSV
    // Ex: ['Control'], ['Z']    --->    "CONTROL+Z"
    // Might be able to fix faulty ctrl/alt/win key onscreen issue here... referenced this in at line with comment "  // Generate array of keys pressed " line ~57
    const activeKeyString = activeKeys.join('+');
  
    // Compare activeKeyString to the keystroke from the table, meaning user provided right keystroke
    useEffect(() => {
      if (activeKeyString === currentShortcut.Windows) {
        console.log('Correct shortcut pressed!');

        //Roll new number and jump to next random position. Might want to eventually implement a limit here for "levels"
        positionInArray = getRandomInt(11);
        setCurrentShortcut(shortcuts[positionInArray]);
      }
    }, [activeKeys, currentShortcut, shortcuts]);

// Duh HTML I guess.. it just chills in this javascript file..?
    return (
      <div className="App">
        <header className="App-header">
          <h1>Pro Tools Shortcut Practice</h1>
        </header>
        <main>
          <div className="shortcut-display">
            <h2>Current Shortcut: {currentShortcut.Action}</h2>
          </div>
          <div className="keyboard-visualization">
            <Keyboard activeKeys={activeKeys} />
          </div>
        </main>
      </div>
      
    );

  }


export default App;
