/** 
 *  This a custom JS script that immitates a struggling baboon looking 
 *  across hundrends of games to find the one time in his life that he won.
 * 
 *  Helper functions:
 *  - Find current cursor position: eval $(xdotool getmouselocation --shell) and then print it: echo $X $Y
*/

const fs = require('fs');
const robot = require("robotjs");
const screenshot = require('screenshot-desktop');
const tesseract = require('tesseract.js');
const sharp = require('sharp');

// ---------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------
function extractDateTimeComponents(inputString) {
    const regex = /@(\d{4})\.(\d{2})\.(\d{2}) (\d{2})(\d{2})(\d{2})/;
    const match = inputString.match(regex);
  
    if (match && match.length === 7) {
      return {
        year: match[1].split('').map(Number),
        month: match[2].split('').map(Number),
        day: match[3].split('').map(Number),
        rest: match.slice(4).join('').split('').map(Number)
      };
    } else {
      return null; // Return null if no match is found
    }
}

function moveCursorToTextInputAndTypeRecordingName(recordingName) {
    console.log("...Moving cursor to text input and typing recording name...")
    
    robot.moveMouse(816, 699)
    robot.mouseClick()

    const dateTimeComponents = extractDateTimeComponents(recordingName)

    robot.keyToggle('shift', 'down')
    robot.keyTap('R')
    robot.keyToggle('shift', 'up')
    robot.keyTap('e')
    robot.keyTap('p')
    robot.keyTap('l')
    robot.keyTap('a')
    robot.keyTap('y')
    robot.keyTap('space')
    robot.keyTap('v')
    robot.keyTap('2')
    robot.keyTap('.')
    robot.keyTap('8')
    robot.keyTap('space')
    robot.keyToggle('shift', 'down')
    robot.keyTap('@')
    robot.keyToggle('shift', 'up')
    robot.keyTap(dateTimeComponents.year[0])
    robot.keyTap(dateTimeComponents.year[1])
    robot.keyTap(dateTimeComponents.year[2])
    robot.keyTap(dateTimeComponents.year[3])
    robot.keyTap('.')
    robot.keyTap(dateTimeComponents.month[0])
    robot.keyTap(dateTimeComponents.month[1])
    robot.keyTap('.')
    robot.keyTap(dateTimeComponents.day[0])
    robot.keyTap(dateTimeComponents.day[1])
    robot.keyTap('space')
    robot.keyTap(dateTimeComponents.rest[0])
    robot.keyTap(dateTimeComponents.rest[1])
    robot.keyTap(dateTimeComponents.rest[2])
    robot.keyTap(dateTimeComponents.rest[3])
    robot.keyTap(dateTimeComponents.rest[4])
    robot.keyTap(dateTimeComponents.rest[5])
    robot.keyTap('.')
    robot.keyTap('r')
    robot.keyTap('c')
    robot.keyTap('x')
}

function openTheRecording() {
    console.log("...Opening the recording...")

    robot.moveMouse(906, 753)
    robot.mouseClick()
}

function openTheDropdownMenuWithUsernames() {
    console.log("...Opening the dropdown...")

    robot.moveMouse(622, 908)
    robot.mouseClick()
}

async function cropScreenshotTaken() {
    try {
        await sharp('shot.jpg')
            .extract({ left: 533, top: 923, width: 180, height: 80 })
            .toFile('shot2.jpg');
        
        console.log('...Image cropped and saved successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}
 
async function takeScreenshotAndCropUsernamesPart() {
    console.log("...Taking a screenshot and cropping usernames part...")

    try {
        await screenshot({ filename: 'shot.jpg' })
        await cropScreenshotTaken()
    } catch(error) {
        console.log('Error', error)
    }
}

async function tesseractRecognizeUsernamesInScreenshot() {
    console.log("...Waiting for tesseract to recognize usernames in screenshot...")

    try {
        const tesseractResponse = await tesseract.recognize('shot2.jpg', 'eng')
        return tesseractResponse.data.text
    } catch (error) {
        console.error('Error in tesseract usernames recognition:', error)
    }
}

function moveRecordingToFolderForThoseUserMatches(usernamesRecognized) {
    // It gets text input like this 'Haki Terror\nSkelo\n' and returns this 'Haki Terror-Skelo'
    const usernames = usernamesRecognized.split('\n')
    const matchesFolderName = usernames[0] + '-' + usernames[1]

    console.log(`...Moving matches to folder: ${matchesFolderName} 🟢 `)
    // TODO 🙂
}

function openWindowToWatchAnotherRecording() {
    console.log("...Opening new window to watch another recording...\n")

    robot.moveMouse(1533, 138)
    robot.mouseClick()

    robot.moveMouse(895, 561)
    robot.mouseClick()
}

async function automateRecordingArchivalProcess(recordingName) {
    moveCursorToTextInputAndTypeRecordingName(recordingName);
    openTheRecording();
    openTheDropdownMenuWithUsernames();
    await takeScreenshotAndCropUsernamesPart();
    const usernamesRecognized = await tesseractRecognizeUsernamesInScreenshot();
    moveRecordingToFolderForThoseUserMatches(usernamesRecognized);
    openWindowToWatchAnotherRecording();
}

// ---------------------------------------------------------------------
// Initial configurations
// ---------------------------------------------------------------------
robot.setKeyboardDelay(20);
robot.setMouseDelay(2000);

// ---------------------------------------------------------------------
// Start of the automation
// ---------------------------------------------------------------------
async function automateRecordingsArchivalProcess() {
    const folderPath = './haki_games_small_subset';

    const files = await fs.promises.readdir(folderPath, (err) => err && console.error(err));

    for (const fileName of files) {
        console.log(`🔴 Archiving recording with name ${fileName}`);
        await automateRecordingArchivalProcess(fileName);
    }
}

console.log("\n\n🤖 🫱 🙉 Employing a robot to help a struggling baboon archive\nhundrends of games against other struggling baboons.\n\n")
automateRecordingsArchivalProcess();