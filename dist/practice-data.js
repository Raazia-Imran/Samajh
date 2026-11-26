export const packs = {
  files: 'Files & folders', meetings: 'Meetings', sharing: 'Links & sharing', safety: 'Email & online safety',
};

export const curated = [
  {id:'rename-pdf',pack:'files',title:'Give a PDF a name you’ll recognize',goal:'Download a renamed copy that you can find later.',steps:['Choose a PDF you’re comfortable using on this device.','Open the rename tool and enter a clear name, such as Course notes.','Download the copy, open Downloads, and find the new name.'],success_check:'Open the copy and check that the PDF still displays correctly.',tool:'rename',event:'Rename download requested'},
  {id:'find-download',pack:'files',title:'Find a download and organize it',goal:'Move a file you own to a folder you will remember.',steps:['Open your browser’s Downloads list or your device’s Downloads folder.','Find a non-sensitive file and make a folder for it in your file manager.','Move the file into that folder and reopen it from there.'],success_check:'You can name the folder and open your file from it.',tool:'downloads'},
  {id:'mic-check',pack:'meetings',title:'Check your mic before a call',goal:'Find out whether your microphone picks up your voice.',steps:['Open the microphone tool and choose Start microphone check.','Allow microphone access and speak at your normal volume.','Watch the signal move as you speak, then choose Stop check.'],success_check:'The meter responded and the check has stopped.',tool:'device',event:'Microphone check started'},
  {id:'pick-window',pack:'meetings',title:'Choose just one window',goal:'Recognize what someone would see if you shared a window.',steps:['Open a non-sensitive document or blank tab.','Use the screen preview tool and select that window or tab.','Check that it is the only thing shown, then stop the preview.'],success_check:'You saw only the intended window and stopped the preview.',tool:'screen-preview',event:'Screen preview started'},
  {id:'check-recipient',pack:'sharing',title:'Check who can open a link',goal:'Verify the access setting for one file you own.',steps:['Open a non-sensitive file in its original service.','Open Share and check who is listed and what access they have.','If you plan to send the link, copy it only after checking the recipient and access level.'],success_check:'You can state who has access and whether they can view or edit.',tool:'access-check'},
  {id:'share-pdf',pack:'sharing',title:'Share the right PDF with the right person',goal:'Use your device’s share menu or your usual messaging app.',steps:['Pick a non-sensitive PDF you intend to share.','Choose the PDF tool, select the file, and open the share menu if available.','Check the recipient and attachment in the chosen app before you send.'],success_check:'The attachment and recipient match your intention. Check delivery in your chosen app.',tool:'share-file',event:'PDF handed to the share menu'},
  {id:'email-draft',pack:'safety',title:'Draft an email with an attachment',goal:'Prepare a clear email draft without sending it.',steps:['Open your email app and start a draft.','Add a specific subject and attach a non-sensitive file.','Check the file and reread the message, then save it as a draft.'],success_check:'The subject describes the message, the attachment is visible, and the message is still a draft.',tool:'email-draft'},
  {id:'spot-link',pack:'safety',title:'Spot a suspicious link',goal:'Decide how to verify a message before opening a link.',steps:['Read this example: “Your account will close today. Sign in at account-check dot example.”','Notice the urgency and the unfamiliar address. Do not open it.','Explain how you’d reach the real service using a saved bookmark or official app.'],success_check:'You can name two warning signs and one safer next step.',example:true,tool:'message-safety'},
  {"id":"open-meeting","pack":"meetings","title":"Open your meeting invitation","goal":"Find the real meeting preview before joining.","steps":["Choose a Zoom or Meet invitation you expected from someone you know.","Use the meeting tool to open it and look for the meeting name and device controls.","Check your microphone and camera in the meeting app. Join only if you intend to participate."],"success_check":"You recognized the right meeting and found its camera and microphone controls.","tool":"meeting","event":"Meeting invitation opened"},
  {"id":"copy-link","pack":"sharing","title":"Copy a link and paste it into a note","goal":"Practise moving a link between your browser and a notes app.","steps":["Choose a public page you recognize and copy its address from the address bar.","Paste the address into Copy a link and select Copy link.","Open a private note, paste the link, and compare it with the original."],"success_check":"The note shows the same address as the page you chose.","tool":"link","event":"Link copied"},
  {"id":"check-internet","pack":"files","title":"Get your phone back online","goal":"Find your phone’s connection settings and check whether you can browse.","steps":["Open the connection guide and choose your phone.","Check airplane mode and Wi-Fi. If you have a data plan, check mobile data.","Reopen a website you already know."],"success_check":"You can say whether you used Wi-Fi or mobile data and whether the website loaded.","tool":"phone-internet"},
  {"id":"take-screenshot","pack":"files","title":"Take and find a screenshot","goal":"Capture a non-sensitive screen and find the saved image.","steps":["Open the screenshot guide and choose your phone.","Try the button combination on a screen with no personal information.","Open Photos or Gallery and look for the latest screenshot."],"success_check":"You opened the image and can recognize what you captured.","tool":"phone-screenshot"},
];

export const draftKey = 'samajh-practice-drafts';
const textOnly = value => typeof value === 'string' ? value.trim() : '';
const lengthOK = (value,min,max) => value.length >= min && value.length <= max;

export function validatePractice(raw) {
  const item = {
    pack:textOnly(raw.pack), title:textOnly(raw.title), goal:textOnly(raw.goal),
    steps:Array.isArray(raw.steps) ? raw.steps.map(textOnly).filter(Boolean) : [],
    success_check:textOnly(raw.success_check), credit:textOnly(raw.credit),
  };
  if (!Object.hasOwn(packs,item.pack)) return {error:'Choose a practice pack.'};
  if (!lengthOK(item.title,5,80)) return {error:'Use 5–80 characters for the title.'};
  if (!lengthOK(item.goal,8,240) || !lengthOK(item.success_check,8,240)) return {error:'Use 8–240 characters for the goal and the success check.'};
  if (item.steps.length < 3 || item.steps.length > 5 || item.steps.some(step => !lengthOK(step,3,220))) return {error:'Add 3–5 steps, each 3–220 characters.'};
  if (item.credit.length > 40) return {error:'Keep the optional contributor name under 41 characters.'};
  if ([item.title,item.goal,item.success_check,item.credit,...item.steps].some(value => /https?:\/\/|www\.|[<>]/i.test(value))) return {error:'Use plain text without links or HTML.'};
  return {item};
}
