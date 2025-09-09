const RESTORE_ICON_SVG=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>`;
const TRASH_ICON_SVG=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>`;
const sessionList=document.querySelector(".sessionsList");

document.addEventListener('DOMContentLoaded',async ()=>{
    console.log("Strange Tabs popup script Loaded");
    const tab=await getCurrentTabs();
    displayCurrent(tab);
    const result = await getAllSession();
    const allSessions=result.savedsession||[];
    console.log("result",allSessions);
    displaySavedSessions(allSessions);
    const saveSessionBtn=document.querySelector('#saveBtn');
    saveSessionBtn.addEventListener('click',async ()=>{
        const tabsToSave=await getCurrentTabs();
        const sessionName=window.prompt('enter the name of the session');
        if(!sessionName){
            return;
        }
        else{
            const session={
                id:Date.now(),
                title:sessionName,
                createdAt:new Date().toLocaleDateString(),
                tabs:tabsToSave
            }
            await saveSession(session);
        }
    });
});


async function getCurrentTabs(){
    try{
        const tab=await chrome.tabs.query({currentWindow:true,pinned:false});
        console.log(tab);
        return tab;
    }catch(e){
        console.log("Problem fetching the data",e);
    }
}


async function getAllSession(){
    try{
        const result=await chrome.storage.local.get(['savedsession']);
        console.log("Data fetching successfull");
        return result
    }
    catch(error){
        console.log("Error occured while getting the data",error);
    }
}

async function saveSession(session){
    try{
        const result=await getAllSession();
        const allSession=result.savedsession||[];
        if(session){
            allSession.push(session);
            await chrome.storage.local.set({savedsession:allSession});
            console.log("your session was saved successfully",allSession);
            alert("Session saved successfully");
            displaySavedSessions(allSession);
        }
        }
    catch(error){
        console.log("Error occured while saving the session",error);
        alert("Error",error);
    }
}

function displayCurrent(tabs){
    const currentList=document.querySelector(".currentTabList");
    currentList.innerHTML="";
    for (const element of tabs)  {
        const currentdiv=document.createElement('div');
        currentdiv.classList.add('tab-item');
        const icon=document.createElement('img');
        icon.classList.add("icon");
        icon.src=element.favIconUrl;
        const tabtitle=document.createElement('span');
        tabtitle.textContent=element.title;
        currentdiv.appendChild(icon);
        currentdiv.appendChild(tabtitle);
        currentList.appendChild(currentdiv);
    }; 
}

function displaySavedSessions(sessionToDisplay){
    console.log("here is session to display",sessionToDisplay);
    sessionList.innerHTML="";

    for (const element of sessionToDisplay)  {
        const sessionDiv=document.createElement('div');
        sessionDiv.classList.add('session-item');
        sessionDiv.dataset.id=element.id;
        const sessionTitle=document.createElement('span');
        sessionTitle.textContent=element.title;

        const deleteBtn=document.createElement('button');
        const restoreBtn=document.createElement('button');

        deleteBtn.classList.add('delete-btn');
        deleteBtn.classList.add('actions');
        deleteBtn.innerHTML=TRASH_ICON_SVG;

        restoreBtn.classList.add('restore-btn');
        restoreBtn.classList.add('actions');
        restoreBtn.innerHTML=RESTORE_ICON_SVG;

        sessionDiv.appendChild(sessionTitle);
        sessionDiv.appendChild(restoreBtn);
        sessionDiv.appendChild(deleteBtn);
        sessionList.appendChild(sessionDiv);
    }; 
    console.log("displayed session successfully");
}



sessionList.addEventListener('click',async (event)=>{
    const sessionDelBtn=event.target.closest('.delete-btn');
    console.log("session del btn",sessionDelBtn);
        if(sessionDelBtn){
            const sessionItem=event.target.closest('.session-item');
            console.log("session Item",sessionItem);
            if(sessionItem){
            const sessionId=sessionItem.dataset.id;
            console.log("session id is ",sessionId)
            const sessionIdAsNumber = Number(sessionId);
            console.log('Note to delete : ',sessionIdAsNumber);
            deleteSession(sessionIdAsNumber);
            }
        }
});

async function deleteSession(sessionId){

    try{
        const result=await getAllSession();
        const allSession=result.savedsession||[];
        const updatedSession=allSession.filter(session => session.id !== sessionId);
        console.log("sessions after deleting",updatedSession);

        await chrome.storage.local.set({savedsession:updatedSession});
        console.log("your session was saved successfully",updatedSession);
        alert("Session saved successfully");
        displaySavedSessions(updatedSession);
    }

    catch(e){
        console.log("error in deleting the session",e);
    }
    
}
