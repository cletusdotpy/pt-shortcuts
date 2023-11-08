// MAKE THIS CODE MORE READABLE YOU SCUMBAG. NEED TO GO THROUGH AND COMMENT ON WHAT ISN'T COMMENTED ON.

import React, { useState, useEffect } from 'react';
import './App.css';
import Keyboard from './Keyboard'
import { act } from '@testing-library/react';
import Papa from 'papaparse';
import ptshortcuts from './editmenushortcuts.csv';

function App() {
  // I believe this means that the application launches in noncapture mode, which is good cheese.
  // What is the scope in which I can reference capture mode? Useful to know if I want to make an indicator of when the app has fuller control of keyboard..
  const [captureMode, setCaptureMode] = useState(false);

  // This section helps enter/escape the application. This should pair well with a popup tooltip upon visiting the site
  // This should include some form of instruction like "Press ESC to leave, press enter to start!" < revisit these keys though.

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (captureMode) {

        // Prevents key events from default behaviour (ex: f11 wont fullscreen)
        event.preventDefault();

// Also... wtf.. this const handleKeyDown exists twice.. consolidate these, and look for other similar mistakes..?
// Update: Spaghetti code breaks and I don't want to troubleshoot this rn.. something about these being in different "useEffect"s... maybe when I learn what that is. o7

// Are multiple "useEffects" less efficient than just one? wtf is a useEffect?
// Jesus dude youre rusty

// Account for various functional keys here (escape character, ctrl/alt/shift, etc)

        // Toggle capture mode off with escape key
        if (event.key === 'Escape') {
          setCaptureMode(false);
          console.log("Exited capture mode")
        }

/*
        // Add the key to the active keys if it's not already there
        // This if statement by itself will successfully highlight keys, but won't "let go"
        // going to comment this back out, and return to using the next useEffect for now.
        if (!activeKeys.includes(event.key.toUpperCase())) {
          setActiveKeys([...activeKeys, event.key.toUpperCase()]);
        }
*/


      // NON CAPTURE MODE  
      } else {
        // Toggle capture mode on with a specific key (e.g., Enter)
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

  const [activeKeys, setActiveKeys] = useState([]);
  //const [pressedKeys, setPressedKeys] = useState('');


// I think I maybe want to try adding code to the below useEffect to process ctrl/alt/shift/etc. I really should combine this with above at some point.. it's just so gross up there.....
// Wait a minute..... is this only checking and updating a the consant "activeKeys", which is otherwise non existent if not for this useEffect? Is this actually helping the app?


useEffect(() => {
    const handleKeyDown = (event) => {
      // Add the key to the active keys if it's not already there
      if (!activeKeys.includes(event.key.toUpperCase())) {
        setActiveKeys([...activeKeys, event.key.toUpperCase()]);

        //logging
        console.log('event key:', event.key);
        console.log('Active keys: ', activeKeys);
        console.log('current shortcut: ', currentShortcut);
        console.log('target stroke: ', shortcutStroke)
      }
    };

    const handleKeyUp = (event) => {
      // Remove the key from active keys
      setActiveKeys(activeKeys.filter(key => key !== event.key.toUpperCase()));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup the event listeners on component unmount
    // WTF is this... this is why u shouldnt program with chatgpt u idiot...
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKeys]);


  const [shortcuts, setShortcuts] = useState([]);

  const [currentShortcut, setCurrentShortcut] = useState([]);

  //define the randomly generated starting point in the index
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  var positionInArray = getRandomInt(11);

  //feel like i might need this, not sure where yet.
  const [shortcutStroke, setShortcutStroke] = useState([]);

  //Section to set the current shortcut from CSV
  useEffect(() => {
    Papa.parse(ptshortcuts, {
      download: true,
      header: true,
      complete: (result) => {
        //Next line pulls all data into shortcuts const
        setShortcuts(result.data);

        //really struggling in here... why can't I get a display of the shortcut name and actively set the shortcut to a const to be compared to the users input?
        //Feel like i might have to move these 2 elsewhere in the program..
        //In dev tools, when starting the web app, the current shortcut is an array including "Ctrl+C". After an action this updates to the full object as specified below
        // This might not be a problem down the line when considering the visual overlay I want to instrument for when out of capture mode

        //Update, this works. Might be a pain to revisit when I want these to randomly generate. Probably not, just need to sub 0 for RNG
        setCurrentShortcut(result.data[positionInArray]);
        setShortcutStroke(result.data[positionInArray]['Windows']);
      }
    });
  }, []);

  // condence array of pressed keys to correct format for comparison to shorcut CSV
  const activeKeyString = activeKeys.join('+');
  //Check for correct. Currently not working because of formatting differences between active keys and shortcut DB
  // Fixed :) delete later. Want to bask in my successes tomorrow
  useEffect(() => {
    if (activeKeyString === currentShortcut.Windows) {
      console.log('Correct shortcut pressed!');
      // Advance to the next shortcut, reset pressedKeys, etc.
      positionInArray = getRandomInt(11);
      setCurrentShortcut(shortcuts[positionInArray]);
      setShortcutStroke(shortcuts[positionInArray]['Windows']);
    }
  }, [activeKeys, currentShortcut, shortcuts]);


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
